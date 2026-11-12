import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
  },
  access: {
    // Visitors can send inquiries. Only the administrator may read or manage them.
    create: () => true,
    read: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    beforeChange: [({ data, operation, req }) => {
      // Public API clients cannot choose a fake processed status on creation.
      if (operation === "create" && req.user?.role !== "admin") {
        return { ...data, status: "new" };
      }
      return data;
    }],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "subject", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Read", value: "read" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
};
