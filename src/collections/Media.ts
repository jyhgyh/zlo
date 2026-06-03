// src/collections/Media.ts
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",

  access: {
    read: () => true,
  },

  admin: {
    useAsTitle: "alt",
  },

  upload: true,

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
        {
          label: "Image",
          value: "image",
        },
        {
          label: "Video",
          value: "video",
        },
      ],
    },
  ],
};