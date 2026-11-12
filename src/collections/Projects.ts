import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "projectType", "company", "visibility", "updatedAt"],
  },
  access: {
    read: ({ req }) =>
      req.user?.role === "admin" ? true : { visibility: { equals: "published" } },
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", unique: true, required: true },
    {
      name: "visibility",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft / private", value: "draft" },
        { label: "Published / public", value: "published" },
      ],
      admin: {
        description: "Publish only work that you are permitted to show publicly.",
      },
    },
    {
      name: "projectType",
      type: "select",
      required: true,
      defaultValue: "personal",
      options: [
        { label: "Company", value: "company" },
        { label: "Freelance", value: "freelance" },
        { label: "Personal", value: "personal" },
      ],
    },
    { name: "company", type: "text" },
    { name: "client", type: "text" },
    { name: "role", type: "text" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    { name: "summary", type: "textarea" },
    { name: "description", type: "textarea" },
    {
      name: "contribution",
      type: "textarea",
      admin: { description: "What Zlata personally did, separate from the team's work." },
    },
    { name: "cover", type: "relationship", relationTo: "media" },
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "media", type: "relationship", relationTo: "media", required: true },
      ],
    },
    { name: "videos", type: "relationship", relationTo: "media", hasMany: true },
    {
      name: "skills",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "tools",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "externalLink", type: "text" },
    { name: "featured", type: "checkbox", defaultValue: false },
  ],
};
