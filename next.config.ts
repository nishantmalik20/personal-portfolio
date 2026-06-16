import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  /* Allow loading the dev server from this machine's LAN IP (e.g. on a phone)
     without Next blocking cross-origin dev/HMR requests. */
  allowedDevOrigins: ["192.168.2.29"],
};

// withBotId adds first-party proxy rewrites so the invisible BotID signal
// script can't be stripped by ad-blockers. See instrumentation-client.ts.
export default withBotId(nextConfig);
