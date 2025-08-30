/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable for build
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily disable for build
  },
  images: {
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: ["res.cloudinary.com"],
  },
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
