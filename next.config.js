/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "upload.wikimedia.org",
      "cdn.pixabay.com",
      "res.cloudinary.com",
      "your-s3-bucket.s3.amazonaws.com",
      "lh3.googleusercontent.com",
      "media.istockphoto.com",
      "i.imgur.com",
    ],
  },
};

module.exports = nextConfig;
