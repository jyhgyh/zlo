import type { CollectionConfig } from "payload";

function getRelationId(value: unknown): string | number | null {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    const id = value.id;
    if (typeof id === "string" || typeof id === "number") {
      return id;
    }
  }

  return null;
}

export const Artworks: CollectionConfig = {
  slug: "artworks",

  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },

  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const nextType = data.type ?? originalDoc?.type;
        const digitalFileId = getRelationId(
          data.digitalFile ?? originalDoc?.digitalFile
        );

        if (nextType !== "digital" || digitalFileId === null) {
          return data;
        }

        // Protect the original before saving an artwork that references it.
        // No public URL should serve this upload after the artwork is saved.
        const media = await req.payload.findByID({
          collection: "media",
          id: digitalFileId,
          depth: 0,
          overrideAccess: true,
          req,
        });

        if (!media) {
          throw new Error("Digital original was not found in Media.");
        }

        if (!media.isProtected) {
          await req.payload.update({
            collection: "media",
            id: digitalFileId,
            data: { isProtected: true },
            depth: 0,
            overrideAccess: true,
            req,
          });
        }

        return data;
      },
    ],
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
      name: "showInShop",
      label: "Show in Shop",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Display this artwork in the shop catalog.",
      },
    },
    {
      name: "showInPortfolio",
      label: "Show in Portfolio",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Display selected artworks in the portfolio (not all shop products).",
      },
    },
    {
      name: "isPurchasable",
      label: "Offer for sale / inquiry",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description:
          "For digital artworks: allow Stripe purchases. For physical paintings: allow Contact inquiries. Sold physical works are hidden from Shop.",
      },
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
      access: {
        read: ({ req }) => req.user?.role === "admin",
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === "digital",
      },
    },

    {
      name: "price",
      type: "number",
      min: 0,
      admin: { description: "Required for digital sales. Optional for physical paintings (price on request)." },
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
