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
      name: "shortDescription",
      type: "textarea",
    },

    {
      name: "description",
      type: "textarea",
    },

    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },

    {
      name: "type",
      type: "select",
      required: true,
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
    },

    {
      name: "gallery",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "media",
          type: "relationship",
          relationTo: "media",
          required: true,
        },
      ],
    },

    {
      name: "videos",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
    },

    {
      name: "digitalFile",
      type: "relationship",
      relationTo: "media",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === "digital",
      },
    },

    {
      name: "price",
      type: "number",
      required: true,
    },

    {
      name: "currency",
      type: "select",
      defaultValue: "EUR",
      options: [
        {
          label: "EUR",
          value: "EUR",
        },
        {
          label: "USD",
          value: "USD",
        },
      ],
    },

    {
      name: "availability",
      type: "select",
      defaultValue: "available",
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
    },

    {
      name: "year",
      type: "number",
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
      name: "medium",
      type: "text",
      admin: {
        description:
          "Example: Oil on Canvas",
      },
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
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },

    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
  ],
};