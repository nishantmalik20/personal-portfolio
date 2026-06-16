import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Nishant — Web Designer & Developer in Winnipeg, Canada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Storybook palette (matches the site + transactional emails).
const INK = "#1F2A52";
const MAPLE = "#E63946";
const MAPLE_DEEP = "#D62839";
const CREAM = "#FFF9EC";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(160deg,#FF9966 0%,#FFC371 24%,#FFEFC4 62%)",
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            background: CREAM,
            border: `8px solid ${INK}`,
            borderRadius: 40,
            boxShadow: `18px 22px 0 rgba(31,42,82,0.55)`,
            padding: "60px 72px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                background: MAPLE,
                color: CREAM,
                border: `5px solid ${INK}`,
                borderRadius: 999,
                padding: "12px 30px",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {SITE.location}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 168, fontWeight: 800, color: INK, lineHeight: 1 }}>
              {SITE.displayName}
            </div>
            <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: MAPLE_DEEP, marginTop: 10 }}>
              {SITE.role}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 30, color: INK, maxWidth: 760, lineHeight: 1.3 }}>
              {SITE.tagline}
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: INK }}>inishant.com</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
