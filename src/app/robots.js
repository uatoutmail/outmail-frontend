export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://outmail.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/app-login/", "/auth/", "/dashboard/", "/student/", "/tpo/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
