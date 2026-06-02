import type { CollectionConfig } from "payload";

export const Artworks: CollectionConfig = {
  slug: "artworks",

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

    {
      name: "description",
      type: "textarea",
    },

    {
      name: "images",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
    },

    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },

    {
      name: "type",
      type: "select",
      options: [
        {
          label: "Physical",
          value: "physical",
        },
        {
          label: "Digital",
          value: "digital",
        },
      ],
      required: true,
    },

    {
      name: "price",
      type: "number",
      required: true,
    },

    {
      name: "availability",
      type: "select",
      options: [
        {
          label: "Available",
          value: "available",
        },
        {
          label: "Sold",
          value: "sold",
        },
      ],
      defaultValue: "available",
    },

    {
      name: "orientation",
      type: "select",
      options: [
        {
          label: "Portrait",
          value: "portrait",
        },
        {
          label: "Landscape",
          value: "landscape",
        },
      ],
    },

    {
      name: "sizeCategory",
      type: "select",
      options: [
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
    },

    {
      name: "material",
      type: "select",
      options: [
        {
          label: "Oil",
          value: "oil",
        },
        {
          label: "Acrylic",
          value: "acrylic",
        },
        {
          label: "Watercolor",
          value: "watercolor",
        },
      ],
    },

    {
      name: "surface",
      type: "select",
      options: [
        {
          label: "Canvas",
          value: "canvas",
        },
        {
          label: "Paper",
          value: "paper",
        },
        {
          label: "Glass",
          value: "glass",
        },
      ],
    },

    {
      name: "widthCm",
      type: "number",
    },

    {
      name: "heightCm",
      type: "number",
    },

    {
      name: "widthPx",
      type: "number",
    },

    {
      name: "heightPx",
      type: "number",
    },

    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },

    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
  ],
};