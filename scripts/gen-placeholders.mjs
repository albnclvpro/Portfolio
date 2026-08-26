// Génère les images placeholder des projets vitrine (public/projects/*.png).
// Usage : node scripts/gen-placeholders.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const projects = [
  { file: "telegram-assistant", label: "assistant_telegram", accent: true },
  { file: "veille-dashboard", label: "dashboard_veille_ia", accent: false },
  { file: "portfolio-live", label: "portfolio_x_n8n", accent: false },
];

const W = 1024;
const H = 400;

const svg = ({ label, accent }) => `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#F7F7F5"/>
  ${Array.from({ length: 12 }, (_, i) =>
    `<line x1="${(i + 1) * (W / 13)}" y1="0" x2="${(i + 1) * (W / 13)}" y2="${H}" stroke="#E0E0E0" stroke-width="1"/>`,
  ).join("")}
  ${Array.from({ length: 5 }, (_, i) =>
    `<line x1="0" y1="${(i + 1) * (H / 6)}" x2="${W}" y2="${(i + 1) * (H / 6)}" stroke="#E0E0E0" stroke-width="1"/>`,
  ).join("")}
  <rect x="60" y="140" width="200" height="80" rx="16" fill="#FFFFFF" stroke="${accent ? "#FF4D00" : "#0A0A0A"}" stroke-width="2"/>
  <line x1="260" y1="180" x2="412" y2="180" stroke="#0A0A0A" stroke-width="2"/>
  <rect x="412" y="140" width="200" height="80" rx="16" fill="${accent ? "#FF4D00" : "#FFFFFF"}" stroke="#0A0A0A" stroke-width="2"/>
  <line x1="612" y1="180" x2="764 " y2="180" stroke="#0A0A0A" stroke-width="2"/>
  <rect x="764" y="140" width="200" height="80" rx="16" fill="#FFFFFF" stroke="#0A0A0A" stroke-width="2"/>
  <circle cx="512" cy="80" r="6" fill="#FF4D00"/>
  <text x="60" y="330" font-family="Menlo, monospace" font-size="28" fill="#5C5C57">${label}</text>
  <text x="60" y="90" font-family="Menlo, monospace" font-size="22" fill="#0A0A0A">placeholder — capture à venir</text>
</svg>`;

await mkdir(new URL("../public/projects/", import.meta.url), {
  recursive: true,
});

for (const p of projects) {
  await sharp(Buffer.from(svg(p)))
    .png()
    .toFile(
      new URL(`../public/projects/${p.file}.png`, import.meta.url).pathname,
    );
  console.log(`✓ public/projects/${p.file}.png`);
}
