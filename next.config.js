/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid corrupted persistent cache on Windows when multiple dev servers share .next
      config.cache = false;
      if (process.platform === "win32") {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
    }
    return config;
  },
};

module.exports = nextConfig;
