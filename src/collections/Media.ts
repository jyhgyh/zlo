import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",

  access: {
    // Payload checks this read access when serving upload URLs too.
    // Paid originals must never be available from a public Media URL.
    read: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }

      // Includes documents created before isProtected was introduced.
      return {
        or: [
          { isProtected: { equals: false } },
          { isProtected: { exists: false } },
        ],
      };
    },
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },

  admin: {
    useAsTitle: "alt",
  },

  upload: true,

  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // An admin cannot accidentally make a referenced paid original public.
        if (data.isProtected === false && originalDoc?.isProtected) {
          const result = await req.payload.find({
            collection: "artworks",
            where: {
              digitalFile: { equals: originalDoc.id },
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
            req,
          });

          if (result.docs.length > 0) {
            throw new Error(
              "This file is used as a digital original. Remove its digitalFile reference before making it public."
            );
          }
        }

        return data;
      },
    ],
  },

  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "mediaType",
      type: "select",
      defaultValue: "image",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
        { label: "ZIP / RAR", value: "archive" },
      ],
    },
    {
      name: "isProtected",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Enable for paid digital originals. Public gallery images and preview videos must remain unchecked.",
      },
    },
  ],
};
