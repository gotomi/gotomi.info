import { existsSync } from "node:fs";
import { mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import { join, parse, resolve, sep } from "node:path";
import { argv, exit } from "node:process";
import exifReader from "exif-reader";
import { format, fraction } from "mathjs";
import sharp from "sharp";

const argument = argv[2];
const buildAll = argument === "--all";
const mediaRoot = resolve("media/gallery");
const publicRoot = resolve("public/gallery");
const dataRoot = resolve("src/_data/galleries");

if (!buildAll && !argument) {
  console.error("Usage: npm run data:gallery -- <slug>");
  console.error("       npm run data:gallery -- --all");
  exit(1);
}

if (!existsSync(mediaRoot)) {
  console.error(`Media directory does not exist: ${mediaRoot}`);
  exit(1);
}

const slugs = buildAll
  ? (await readdir(mediaRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  : [argument];

for (const slug of slugs) {
  await buildGallery(slug);
}

async function buildGallery(slug) {
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    console.error(`Invalid gallery slug: ${slug}`);
    console.error("Slug may only contain letters, numbers and dashes.");
    exit(1);
  }

  const sourceDirectory = resolve(mediaRoot, slug);
  const outputDirectory = resolve(publicRoot, slug);

  if (
    !sourceDirectory.startsWith(`${mediaRoot}${sep}`) ||
    !outputDirectory.startsWith(`${publicRoot}${sep}`)
  ) {
    console.error("Invalid gallery path.");
    exit(1);
  }

  if (!existsSync(sourceDirectory)) {
    console.error(`Gallery directory does not exist: ${sourceDirectory}`);
    exit(1);
  }

  const thumbnailsDirectory = join(outputDirectory, "thumbnails");
  const normalDirectory = join(outputDirectory, "normal");
  const dataFile = resolve(dataRoot, `${slug}.json`);

  const files = (await readdir(sourceDirectory))
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    console.error(`No images found in ${sourceDirectory}`);
    exit(1);
  }

  await mkdir(thumbnailsDirectory, { recursive: true });
  await mkdir(normalDirectory, { recursive: true });

  const photos = {
    slug,
    title: slug,
    description: slug,
    thumbnail: "",
    items: [],
  };

  const expectedThumbnails = new Set();
  const expectedNormal = new Set();

  for (const [index, file] of files.entries()) {
    const { name } = parse(file);
    const sourcePath = join(sourceDirectory, file);
    const imageSource = sharp(sourcePath).rotate();
    const metadata = await imageSource.metadata();
    let exif;

    try {
      exif = metadata.exif ? exifReader(metadata.exif).exif : undefined;
    } catch {
      console.warn(`Could not read EXIF data for ${file}`);
    }

    const thumbnailFile = `${name}.jpg`;
    const normalFile = `${name}.webp`;

    await imageSource
      .clone()
      .resize({ height: 300 })
      .jpeg()
      .toFile(join(thumbnailsDirectory, thumbnailFile));

    const normalInfo = await imageSource
      .clone()
      .resize({ height: 1500 })
      .webp({ quality: 82 })
      .toFile(join(normalDirectory, normalFile));

    expectedThumbnails.add(thumbnailFile);
    expectedNormal.add(normalFile);

    photos.items.push({
      normal: `/gallery/${slug}/normal/${normalFile}`,
      thumbnail: `/gallery/${slug}/thumbnails/${thumbnailFile}`,
      exif: exifMapper(exif),
      alt: name,
      width: normalInfo.width,
      height: normalInfo.height,
    });

    if (index === 0) {
      photos.thumbnail = `/gallery/${slug}/thumbnails/${thumbnailFile}`;
    }

    console.log(`[${index + 1}/${files.length}] ${slug}/${file}`);
  }

  await removeOrphanedDerivatives(normalDirectory, expectedNormal);
  await removeOrphanedDerivatives(thumbnailsDirectory, expectedThumbnails);

  const temporaryDataFile = `${dataFile}.tmp`;
  await writeFile(temporaryDataFile, JSON.stringify(photos, null, 2), "utf8");
  await rename(temporaryDataFile, dataFile);

  console.log(`Wrote ${dataFile}`);
}

function exifMapper(exif) {
  if (!exif) return undefined;

  return {
    FFNumber: exif.FNumber,
    ISO: exif.ISO,
    exposureTime:
      exif.ExposureTime !== undefined
        ? format(fraction(exif.ExposureTime), { fraction: "ratio" })
        : undefined,
    LensMake: exif.LensMake,
    FocalLength: exif.FocalLength,
    FocalLengthIn35mmFormat: exif.FocalLengthIn35mmFormat,
    LensModel: exif.LensModel,
  };
}

async function removeOrphanedDerivatives(directory, expectedFiles) {
  const existing = await readdir(directory);

  await Promise.all(
    existing
      .filter((file) => !expectedFiles.has(file))
      .map((file) => rm(join(directory, file), { force: true })),
  );
}
