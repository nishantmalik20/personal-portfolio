/**
 * Regenerates lib/email-assets.ts from public/logo-mark.svg.
 *
 * The contact emails embed the logo as an inline (cid) PNG so it renders in every
 * client with no external hosting. The mark is recoloured to cream for placement
 * on the maple sticker in the email header/signature.
 *
 * Run with: node scripts/generate-email-logo.mjs
 */

import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const CREAM = "#FFF9EC";

const svgText = readFileSync("public/logo-mark.svg", "utf8").replace(
  'fill="#E63946"',
  `fill="${CREAM}"`
);

const png = await sharp(Buffer.from(svgText), { density: 400 })
  .resize({ width: 480 })
  .png({ compressionLevel: 9 })
  .toBuffer();

const file = `/**
 * Generated asset — do not edit by hand.
 * Cream "iNishant" logo mark (recoloured from public/logo-mark.svg) as a PNG,
 * embedded so the contact emails can show the real logo as an inline (cid) image
 * with no external hosting. Regenerate with scripts/generate-email-logo.mjs.
 */

export const LOGO_PNG_BASE64 = "${png.toString("base64")}";
`;

writeFileSync("lib/email-assets.ts", file);
console.log(`wrote lib/email-assets.ts (${png.length} png bytes)`);
