/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  experimental: {
    // Exclude large 3D/animation packages from build traces — prevents
    // Vercel memory exhaustion during the "Collecting build traces" step.
    outputFileTracingExcludes: {
      "*": [
        "node_modules/three/**",
        "node_modules/@react-three/**",
        "node_modules/gsap/**",
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
    ],
  },
};

export default nextConfig;
