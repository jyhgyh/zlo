import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Categories } from "./collections/Categories.ts";
import { Tags } from "./collections/Tags.ts";
import { Artworks } from "./collections/Artworks.ts";
import { ContactMessages } from "./collections/ContactMessages.ts";
import { Orders } from "./collections/Orders.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Artworks,
    ContactMessages,
    Orders,
  ],

  globals: [
    SiteSettings,
  ],

  secret: process.env.PAYLOAD_SECRET || "",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),

  sharp,

  plugins: [],
});