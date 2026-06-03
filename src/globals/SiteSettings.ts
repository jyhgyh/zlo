import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",

  access: {
    read: () => true,
  },

  fields: [
    {
      name: "home",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Zlata",
        },
        {
          name: "subtitle",
          type: "text",
          defaultValue: "Artist & Illustrator",
        },
        {
          name: "description",
          type: "textarea",
          defaultValue:
            "Discover original artworks, illustrations, and digital creations. Browse the portfolio and find unique pieces available for purchase.",
        },
        {
          name: "heroImage",
          type: "relationship",
          relationTo: "media",
        },
      ],
    },

    {
      name: "about",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "About Me",
        },
        {
          name: "image",
          type: "relationship",
          relationTo: "media",
        },
        {
          name: "paragraphs",
          type: "array",
          fields: [
            {
              name: "text",
              type: "textarea",
              required: true,
            },
          ],
        },
      ],
    },

    {
      name: "resume",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Resume",
        },
        {
          name: "education",
          type: "textarea",
        },
        {
          name: "experience",
          type: "textarea",
        },
        {
          name: "achievements",
          type: "textarea",
        },
        {
          name: "cvFile",
          type: "relationship",
          relationTo: "media",
        },
      ],
    },

    {
      name: "contact",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Contact",
        },
        {
          name: "description",
          type: "textarea",
          defaultValue:
            "For commissions, purchases or collaborations, feel free to contact me.",
        },
        {
          name: "email",
          type: "email",
        },
        {
          name: "instagram",
          type: "text",
        },
        {
          name: "whatsapp",
          type: "text",
        },
      ],
    },
  ],
};