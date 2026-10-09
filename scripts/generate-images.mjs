import { mkdir, readdir } from "node:fs/promises";
import { join, basename } from "node:path";
import sharp from "sharp";

const imageDir = join(process.cwd(), "public", "images");
await mkdir(imageDir, { recursive: true });

const files = (await readdir(imageDir)).filter((file) => file.endsWith(".svg"));
if (files.length === 0) {
  throw new Error("No source SVG artwork found in public/images.");
}

for (const file of files) {
  const input = join(imageDir, file);
  const output = join(imageDir, `${basename(file, ".svg")}.png`);
  await sharp(input, { density: 160 })
    .resize({ width: 1200, withoutEnlargement: false })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
  process.stdout.write(`Created public/images/${basename(output)}\n`);
}

process.stdout.write(`Rendered ${files.length} high-resolution dental images.\n`);
