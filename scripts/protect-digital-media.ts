import { loadEnvConfig } from "@next/env";
import { getPayload } from "payload";

function getRelationId(value: unknown): number | null {
  let id: unknown = value;

  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value
  ) {
    id = value.id;
  }

  const numberId = Number(id);

  if (
    id === null ||
    id === undefined ||
    id === "" ||
    !Number.isSafeInteger(numberId) ||
    numberId <= 0
  ) {
    return null;
  }

  return numberId;
}

async function main() {
  console.log("Starting digital media protection migration...");

  loadEnvConfig(process.cwd());

  const { default: config } = await import(
    "../src/payload.config.ts"
  );

  const payload = await getPayload({ config });

  console.log("Connected to Payload CMS.");

  const mediaIds = new Set<number>();

  let page = 1;
  let scannedArtworks = 0;
  let digitalArtworks = 0;

  while (true) {
    const result = await payload.find({
      collection: "artworks",
      depth: 0,
      limit: 100,
      page,
      overrideAccess: true,
    });

    for (const artwork of result.docs) {
      scannedArtworks++;

      if (artwork.type !== "digital") {
        continue;
      }

      digitalArtworks++;

      const mediaId = getRelationId(artwork.digitalFile);

      if (mediaId === null) {
        console.warn(
          `Digital artwork #${artwork.id} has no valid digitalFile`
        );
        continue;
      }

      mediaIds.add(mediaId);
    }

    if (!result.hasNextPage) {
      break;
    }

    page++;
  }

  console.log(`Scanned artworks: ${scannedArtworks}`);
  console.log(`Digital artworks: ${digitalArtworks}`);
  console.log(`Unique digital originals: ${mediaIds.size}`);

  let protectedCount = 0;
  let alreadyProtectedCount = 0;

  for (const mediaId of mediaIds) {
    const media = await payload.findByID({
      collection: "media",
      id: mediaId,
      depth: 0,
      overrideAccess: true,
    });

    if (media.isProtected === true) {
      alreadyProtectedCount++;
      console.log(`Media #${mediaId}: already protected`);
      continue;
    }

    await payload.update({
      collection: "media",
      id: mediaId,
      data: {
        isProtected: true,
      },
      depth: 0,
      overrideAccess: true,
    });

    const verifiedMedia = await payload.findByID({
      collection: "media",
      id: mediaId,
      depth: 0,
      overrideAccess: true,
    });

    if (verifiedMedia.isProtected !== true) {
      throw new Error(
        `Failed to verify protection of Media #${mediaId}`
      );
    }

    protectedCount++;

    console.log(`Media #${mediaId}: protected successfully`);
  }

  console.log("---------------------------------------");
  console.log(`Newly protected: ${protectedCount}`);
  console.log(`Already protected: ${alreadyProtectedCount}`);

  if (mediaIds.size === 0) {
    console.warn(
      "No digital originals found. Check artwork digitalFile relationships."
    );
  }

  console.log("Migration finished successfully.");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
  