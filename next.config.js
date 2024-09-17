/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "storage.googleapis.com"],
  },
  experimental: {
    serverMinification: false,
  },
};

module.exports = nextConfig;
