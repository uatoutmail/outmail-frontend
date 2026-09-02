import { siteUrl } from "@/lib/env";
export default function robots() {
  const baseUrl = siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/app-login/", "/auth/", "/dashboard/", "/student/", "/tpo/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
