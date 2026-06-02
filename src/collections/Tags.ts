import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",

  access: {
    read: () => true,
  },

  admin: {
    useAsTitle: "title",
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },

    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};