import type { NextConfig } from "next";

// GitHub Pages serves this project from https://<user>.github.io/<repo>/,
// a subpath — only apply basePath/assetPrefix when building for that target
// (set by the CI workflow) so local dev still runs at the root.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "multi-agent";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
};

export default nextConfig;
