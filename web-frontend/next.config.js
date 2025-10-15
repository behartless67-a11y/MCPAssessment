/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Export as static site for Azure Static Web Apps
  trailingSlash: true, // Required for static export
  images: {
    unoptimized: true, // Required for static export
  },
  // Rewrites don't work with static export, API calls will use relative URLs
};

module.exports = nextConfig;
