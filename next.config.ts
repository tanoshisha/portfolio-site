import type { NextConfig } from "next";

const oldHosts = ["hayatonaoe.vercel.app", "portfolio-site.vercel.app"];

const nextConfig: NextConfig = {
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
