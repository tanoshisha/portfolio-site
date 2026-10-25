import type { NextConfig } from "next";

const oldHosts = ["hayatonaoe.vercel.app", "portfolio-site.vercel.app"];

const nextConfig: NextConfig = {
  // 写真はブラウザに7日キャッシュ（何度も見に来る人が同じ写真を落とし直さないように。Vercelの通信量対策）
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  // 管理画面（Sveltia CMS）は public/admin/index.html。/admin でも開けるようにする
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
    ];
  },
  async redirects() {
    return oldHosts.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "https://hayatonaoe.com/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://hayatonaoe.com/:path*",
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
