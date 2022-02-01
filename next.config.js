/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ['d3ap4b9057p1g7.cloudfront.net', `${process.env.NEXT_PUBLIC_MEDIA_URL}`,"cdn.sanity.io"],
  },
}

module.exports = nextConfig
