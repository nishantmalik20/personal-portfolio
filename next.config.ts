import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow loading the dev server from this machine's LAN IP (e.g. on a phone)
     without Next blocking cross-origin dev/HMR requests. */
  allowedDevOrigins: ["192.168.2.29"],
};

export default nextConfig;
