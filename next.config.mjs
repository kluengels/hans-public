/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["crypr"],
  },
  // needed for docker export
  output: "standalone",
};

export default nextConfig;
