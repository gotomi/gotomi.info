import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, extname, join, parse, resolve } from "node:path";
import sharp from "sharp";

const dataFile = resolve("src/_data/instagram.json");
const mediaRoot = resolve("media/instagram");
const publicRoot = resolve("public/instagram");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const items = JSON.parse(await readFile(dataFile, "utf8"));

if (!Array.isArray(items)) {
  throw new Error("instagram.json must contain an array");
}

const updatedItems = [];
let images = 0;
let videos = 0;

for (const [index, item] of items.entries()) {
  const relativePath = item.uri.replace(/^\/instagram\//, "");
  const sourcePath = resolve(mediaRoot, relativePath);

  if (!sourcePath.startsWith(`${mediaRoot}/`)) {
    throw new Error(`Invalid Instagram media path: ${item.uri}`);
  }

  const parsed = parse(relativePath);
  const extension = extname(relativePath).toLowerCase();
  const directory = parsed.dir;

  if (imageExtensions.has(extension)) {
    const outputFile = `${parsed.name}-400.webp`;
    const outputPath = resolve(publicRoot, directory, outputFile);

    await mkdir(dirname(outputPath), { recursive: true });
    await sharp(sourcePath)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    updatedItems.push({
      ...item,
      uri: `/instagram/${join(directory, outputFile).split("\\").join("/")}`,
      type: "image",
    });
    images += 1;
  } else {
    const outputFile = `${parsed.name}.mp4`;
    const outputPath = resolve(publicRoot, directory, outputFile);

    await mkdir(dirname(outputPath), { recursive: true });
    await copyFile(sourcePath, outputPath);

    updatedItems.push({
      ...item,
      uri: `/instagram/${join(directory, outputFile).split("\\").join("/")}`,
      type: "video",
    });
    videos += 1;
  }

  if ((index + 1) % 25 === 0 || index === items.length - 1) {
    console.log(`[${index + 1}/${items.length}] Instagram derivatives`);
  }
}

const temporaryDataFile = `${dataFile}.tmp`;
await writeFile(temporaryDataFile, JSON.stringify(updatedItems, null, 2), "utf8");
await rename(temporaryDataFile, dataFile);

console.log(`Generated ${images} images and ${videos} videos in ${publicRoot}`);
