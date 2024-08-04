require("next-ws/server").verifyPatch();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "storage.googleapis.com"],
  },
};

module.exports = nextConfig;
