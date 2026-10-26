import type { MetadataRoute } from "next";
import photos from "@/data/photos.json";

// 画像サイトマップ付き：作品の写真（元の画像）を Google 画像検索に伝える
const SITE = "https://hayatonaoe.com";
const abs = (src: string) => `${SITE}${src.includes("/") ? src : `/images/gallery/${src}.jpg`}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const all = [...photos.heroSlides, ...photos.works, ...photos.personal].map((p) => abs(p.src));
  const images = Array.from(new Set(all));
  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images,
    },
    {
      url: `${SITE}/license`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
