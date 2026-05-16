/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "covmerc-baeef.firebasestorage.app",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "convmerc-baeef.firebasestorage.app",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;

