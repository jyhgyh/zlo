import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",

  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role", "createdAt"],
  },

  auth: true,

  access: {
    admin: ({ req }) => req.user?.role === "admin",

    create: () => true,

    read: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }

      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        };
      }

      return false;
    },

    update: ({ req }) => {
      if (req.user?.role === "admin") {
        return true;
      }

      if (req.user) {
        return {
          id: {
            equals: req.user.id,
          },
        };
      }

      return false;
    },

    delete: ({ req }) => req.user?.role === "admin",
  },

  fields: [
    {
      name: "name",
      type: "text",
    },

    {
      name: "role",
      type: "select",
      defaultValue: "user",
      options: [
        {
          label: "User",
          value: "user",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
      access: {
        create: ({ req }) => req.user?.role === "admin",
        update: ({ req }) => req.user?.role === "admin",
        read: ({ req }) => Boolean(req.user),
      },
    },

    {
      name: "avatar",
      type: "relationship",
      relationTo: "media",
    },

    {
      name: "favorites",
      type: "relationship",
      relationTo: "artworks",
      hasMany: true,
      access: {
        read: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
  ],
};