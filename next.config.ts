import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Off: routes read the session cookie, and nothing uses `use cache`.
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
