import { argv } from "node:process";

import exifReader from "exif-reader";
import sharp from "sharp";
import { readdirSync, writeFile, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { format, fraction } from "mathjs";

const slug = argv[2];
// const slug = "nadmorskie-klimaty";
const title = slug;
const description = slug;

// const sourceDirectory = './gallery-source'

const publicPhotosDirectory = `/gallery/${slug}/`;
const rootPhotosDirectory = `./public/gallery/${slug}/`;

const files = readdirSync(rootPhotosDirectory).filter((file) =>
  file.endsWith(".jpg")
);

let photos = {
  slug: slug,
  title: title,
  description: description,
  thumbnail: "https://gotomi.info/assets/me.jpg",
  items: [],
};

const imageMetaTask = files.map((item, index) => {
  return new Promise((resolve, reject) => {
    const imageSource = sharp(join(rootPhotosDirectory, item));
    imageSource.metadata().then(function (metadata) {
      const exif = exifReader(metadata.exif).exif;

      if (!existsSync(join(rootPhotosDirectory, "thumbnails"))) {
        mkdirSync(join(rootPhotosDirectory, "thumbnails"));
      }
      imageSource
        .resize({ height: 300 })
        .jpeg()
        .toFile(
          `${join(rootPhotosDirectory, "thumbnails/")}${item}`,
          (err, info) => {
            console.log(info, err);
          }
        );
      if (!existsSync(join(rootPhotosDirectory, "normal"))) {
        mkdirSync(join(rootPhotosDirectory, "normal"));
      }
      imageSource
        .resize({ height: 1500 })
        .jpeg()
        .toFile(
          `${join(rootPhotosDirectory, "normal/")}${item}`,
          (err, info) => {
            console.log(info, err);
          }
        );
      photos.items.push({
        url: `${publicPhotosDirectory}${item}`,
        normal: `${publicPhotosDirectory}normal/${item}`,
        thumbnail: `${publicPhotosDirectory}thumbnails/${item}`,
        exif: exifMapper(exif),
        alt: item,
        width: metadata.width,
        height: metadata.height,
      });

      if (index === 0) {
        photos.thumbnail = `${publicPhotosDirectory}thumbnails/${item}`;
      }
      resolve();
    });
  });
});

Promise.all(imageMetaTask).then(() => {
  const photoSorted = photos.items.sort((a, b) => {
    return a.normal.localeCompare(b.normal);
  });
  photos.items = photoSorted;
  writeFile(
    `./src/_data/galleries/${slug}.json`,
    JSON.stringify(photos),
    "utf8",
    (err) => {
      console.log(err);
    }
  );
  // TODO add gallery to gallery index
});

function exifMapper(exif) {
  return {
    FFNumber: exif.FNumber,
    ISO: exif.ISO,
    exposureTime: format(fraction(exif.ExposureTime), { fraction: "ratio" }),
    LensMake: exif.LensMake,
    FocalLength: exif.FocalLength,
    FocalLengthIn35mmFormat: exif.FocalLengthIn35mmFormat,
    LensModel: exif.LensModel,
  };
}
