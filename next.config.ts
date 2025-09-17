// It's recommended to use JSDoc for type-checking in a .js config file.
// If you are using a next.config.ts file, the import type is also fine.
/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// Your existing Next.js configuration
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
    ],
  },

  serverExternalPackages: ["@node-rs/argon2"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Note: This 'api' config is for the Pages Router.
  // It won't affect API Route Handlers in the App Router.
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

// Wrap your config with withPWA and export it
module.exports = withPWA(nextConfig);
