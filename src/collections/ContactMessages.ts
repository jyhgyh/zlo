import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",

  admin: {
    useAsTitle: "subject",
    defaultColumns: [
      "name",
      "email",
      "subject",
      "status",
      "createdAt",
    ],
  },

  access: {
    create: () => true,

    read: ({ req }) => Boolean(req.user),

    update: ({ req }) => Boolean(req.user),

    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },

    {
      name: "email",
      type: "email",
      required: true,
    },

    {
      name: "subject",
      type: "text",
      required: true,
    },

    {
      name: "message",
      type: "textarea",
      required: true,
    },

    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        {
          label: "New",
          value: "new",
        },
        {
          label: "Read",
          value: "read",
        },
        {
          label: "Archived",
          value: "archived",
        },
      ],
    },
  ],
};