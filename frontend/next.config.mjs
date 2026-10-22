/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets you open the dev site from your phone on the same Wi-Fi without the cross-origin warning.
  allowedDevOrigins: ["192.168.1.3", "192.168.1.*", "localhost", "127.0.0.1"],
};
export default nextConfig;
