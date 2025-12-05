import { MetadataRoute } from "next";

/**
 * @file manifest.ts
 * @description PWA용 manifest.json 생성
 *
 * Progressive Web App 설정을 제공합니다.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "의류 쇼핑몰",
    short_name: "쇼핑몰",
    description: "Next.js + Clerk + Supabase로 구축된 의류 쇼핑몰",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    scope: "/",
    categories: ["shopping", "ecommerce"],
  };
}

