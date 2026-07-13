export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://outmail.in";

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
      path: "/aboutus",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/mentorships",
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
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
