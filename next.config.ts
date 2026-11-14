import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Off: routes read the session cookie, and nothing uses `use cache`.
  cacheComponents: false,
  outputFileTracingIncludes: {
    '/api/extract': ['./public/samples/dani-eligibility-notice.pdf'],
  },
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
