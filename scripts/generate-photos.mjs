import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import sharp from "sharp";

const dataFile = resolve("src/_data/photos.json");
const mediaRoot = resolve("media/photos");
const publicRoot = resolve("public/photos");
const sourceExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const items = JSON.parse(await readFile(dataFile, "utf8"));

if (!Array.isArray(items)) {
  throw new Error("photos.json must contain an array");
}

await mkdir(publicRoot, { recursive: true });

let generated = 0;

for (const item of items) {
  if (item.type !== "image" || typeof item.id !== "string") continue;

  const sourcePath = sourceExtensions
    .map((extension) => resolve(mediaRoot, `${item.id}${extension}`))
    .find((candidate) => existsSync(candidate));

  if (!sourcePath) {
    console.warn(`Missing source image for ${item.id}`);
    continue;
  }

  const outputPath = resolve(publicRoot, `${item.id}.webp`);

  await sharp(sourcePath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);

  generated += 1;
  console.log(`[${generated}] ${item.id}${extname(sourcePath)}`);
}

console.log(`Generated ${generated} photos in ${publicRoot}`);
