/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid Windows dev crashes from the experimental segment explorer devtool
  // (React Client Manifest / SegmentViewNode errors after cache upgrades).
  experimental: {
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
