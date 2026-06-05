import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",

  admin: {
    useAsTitle: "id",
    defaultColumns: [
      "id",
      "user",
      "total",
      "status",
      "paymentStatus",
      "createdAt",
    ],
  },

  access: {
    create: ({ req }) => Boolean(req.user),

    read: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }

      if (req.user) {
        return {
          user: {
            equals: req.user.id,
          },
        };
      }

      return false;
    },

    update: ({ req }) => req.user?.role === "admin",

    delete: ({ req }) => req.user?.role === "admin",
  },

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },

    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        {
          name: "artwork",
          type: "relationship",
          relationTo: "artworks",
          required: true,
        },

        {
          name: "title",
          type: "text",
          required: true,
        },

        {
          name: "slug",
          type: "text",
          required: true,
        },

        {
          name: "image",
          type: "text",
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
          name: "type",
          type: "select",
          defaultValue: "digital",
          options: [
            {
              label: "Digital",
              value: "digital",
            },
            {
              label: "Physical",
              value: "physical",
            },
          ],
        },
      ],
    },

    {
      name: "total",
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
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Cancelled",
          value: "cancelled",
        },
      ],
    },

    {
      name: "paymentStatus",
      type: "select",
      defaultValue: "unpaid",
      options: [
        {
          label: "Unpaid",
          value: "unpaid",
        },
        {
          label: "Paid",
          value: "paid",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
      ],
    },

    {
      name: "stripeSessionId",
      type: "text",
      admin: {
        readOnly: true,
      },
    },

    {
      name: "stripePaymentIntentId",
      type: "text",
      admin: {
        readOnly: true,
      },
    },

    {
      name: "customerName",
      type: "text",
      required: true,
    },

    {
      name: "customerEmail",
      type: "email",
      required: true,
    },

    {
      name: "notes",
      type: "textarea",
    },
  ],
};