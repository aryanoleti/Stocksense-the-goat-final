import type { NextConfig } from "next";

const repo = "stocksense-the-goat";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? `/${repo}` : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? `/${repo}/` : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_ACTIONS ? `/${repo}` : "",
  },
};

export default nextConfig;
