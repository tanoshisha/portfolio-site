import type { NextConfig } from "next";

const oldHosts = ["hayatonaoe.vercel.app", "portfolio-site.vercel.app"];

const nextConfig: NextConfig = {
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
