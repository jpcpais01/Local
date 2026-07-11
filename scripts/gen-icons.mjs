import sharp from "sharp";
import { readFileSync } from "fs";
import path from "path";

const svg = readFileSync(path.join("public", "icons", "icon.svg"));

const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
  { name: "favicon-16.png", size: 16 },
];

for (const t of targets) {
  await sharp(svg, { density: 384 })
    .resize(t.size, t.size)
    .png()
    .toFile(path.join("public", "icons", t.name));
  console.log("wrote", t.name);
}

// Screenshot placeholders removed — not generating fake app screenshots.
