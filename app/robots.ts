import { MetadataRoute } from "next";

/**
 * @file robots.ts
 * @description SEO용 robots.txt 생성
 *
 * 검색 엔진 크롤러에게 사이트 크롤링 규칙을 제공합니다.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

