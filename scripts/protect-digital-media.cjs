/**
 * One-off migration for existing Payload CMS 3 + PostgreSQL digital originals.
 * Uses psql instead of importing Payload, avoiding the tsx/CommonJS loader error.
 *
 * Dry run: node scripts/protect-digital-media.cjs
 * Apply:   node scripts/protect-digital-media.cjs --apply
 *
 * Assumes default Payload Postgres names: artworks.digital_file_id,
 * media.is_protected. Fails without making changes if names differ.
 */
const { spawnSync } = require("node:child_process");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const connection = process.env.DATABASE_URL;
if (!connection) {
  console.error("Missing DATABASE_URL in environment / .env");
  process.exit(1);
}

let url;
try {
  url = new URL(connection);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("Expected a PostgreSQL URL");
  }
} catch (error) {
  console.error("Invalid DATABASE_URL:", error.message);
  process.exit(1);
}

const env = {
  ...process.env,
  PGHOST: url.hostname,
  PGPORT: url.port || "5432",
  PGUSER: decodeURIComponent(url.username),
  PGPASSWORD: decodeURIComponent(url.password),
  PGDATABASE: decodeURIComponent(url.pathname.slice(1)),
};

if (!env.PGDATABASE || !env.PGUSER) {
  console.error("DATABASE_URL must specify database and user.");
  process.exit(1);
}

function psql(sql) {
  const result = spawnSync(
    "psql",
    ["-X", "--set=ON_ERROR_STOP=1", "--pset=pager=off", "-c", sql],
    { env, encoding: "utf8", timeout: 30000, maxBuffer: 1024 * 1024 }
  );

  if (result.error) {
    console.error("Could not run psql:", result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error("SQL failed without changing any records:");
    console.error(result.stderr || result.stdout);
    process.exit(1);
  }
  if (result.stdout) process.stdout.write(result.stdout);
}

console.log("Checking existing digital originals in PostgreSQL...");

// This SELECT also validates the expected table/column names.
psql(`
SELECT
  COUNT(DISTINCT a.digital_file_id) AS referenced_originals,
  COUNT(DISTINCT a.digital_file_id) FILTER (
    WHERE m.is_protected IS TRUE
  ) AS already_protected,
  COUNT(DISTINCT a.digital_file_id) FILTER (
    WHERE m.is_protected IS DISTINCT FROM TRUE
  ) AS still_unprotected
FROM artworks AS a
JOIN media AS m ON m.id = a.digital_file_id
WHERE a.type = 'digital' AND a.digital_file_id IS NOT NULL;
`);

psql(`
SELECT DISTINCT m.id AS media_id, m.filename, m.is_protected
FROM artworks AS a
JOIN media AS m ON m.id = a.digital_file_id
WHERE a.type = 'digital' AND a.digital_file_id IS NOT NULL
ORDER BY m.id;
`);

if (!process.argv.includes("--apply")) {
  console.log("DRY RUN ONLY. No data changed.");
  console.log("After backing up the database, run with --apply to protect originals.");
  process.exit(0);
}

console.log("Protecting all referenced digital originals...");
psql(`
BEGIN;
WITH targets AS (
  SELECT DISTINCT a.digital_file_id AS id
  FROM artworks AS a
  WHERE a.type = 'digital' AND a.digital_file_id IS NOT NULL
), changed AS (
  UPDATE media AS m
  SET is_protected = TRUE
  WHERE m.id IN (SELECT id FROM targets)
    AND m.is_protected IS DISTINCT FROM TRUE
  RETURNING m.id
)
SELECT COUNT(*) AS newly_protected FROM changed;
COMMIT;
`);

console.log("Verifying protected originals...");
psql(`
SELECT
  COUNT(DISTINCT a.digital_file_id) AS referenced_originals,
  COUNT(DISTINCT a.digital_file_id) FILTER (
    WHERE m.is_protected IS TRUE
  ) AS protected,
  COUNT(DISTINCT a.digital_file_id) FILTER (
    WHERE m.is_protected IS DISTINCT FROM TRUE
  ) AS unprotected
FROM artworks AS a
JOIN media AS m ON m.id = a.digital_file_id
WHERE a.type = 'digital' AND a.digital_file_id IS NOT NULL;
`);
console.log("Migration completed. Verify downloads and anonymous direct-file access.");
