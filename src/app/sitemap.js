import { siteUrl } from "@/lib/env";
export default function sitemap() {
  const baseUrl = siteUrl;

  const routes = [
    {
      path: "",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      path: "/features",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/pricing",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/partnership",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // Was missing entirely: /faq exists, is linked from the footer and
      // every page, and answers the questions people search for by name.
      path: "/faq",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/aboutus",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/contactus",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/privacy-policy",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      path: "/terms-and-conditions",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      path: "/refund-and-cancellation",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
