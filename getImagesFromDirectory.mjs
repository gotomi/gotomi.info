import { argv } from "node:process";
import exifReader from "exif-reader";
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, writeFile } from "fs";
import { join } from "path";
import { format, fraction } from "mathjs";
import exifr from "exifr";

const slug = argv[2];
const title = slug;
const description = slug;

const publicPhotosDirectory = `/gallery/${slug}/`;
const rootPhotosDirectory = `./public/gallery/${slug}/`;

const files = readdirSync(rootPhotosDirectory).filter((file) =>
  file.endsWith(".jpg")
);

let photos = {
  slug: slug,
  title: title,
  description: description,
  thumbnail: "",
  items: [],
};

const processImage = (imageSource, item, directory, size) => {
  if (!existsSync(join(rootPhotosDirectory, directory))) {
    mkdirSync(join(rootPhotosDirectory, directory));
  }
  imageSource
    .resize({ height: size })
    .jpeg()
    .toFile(
      `${join(rootPhotosDirectory, `${directory}/`)}${item}`,
      (err, info) => {
        console.log(info, err);
      },
    );
};

const imageMetaTask = files.map((item, index) => {
  return new Promise((resolve, reject) => {
    const imageSource = sharp(join(rootPhotosDirectory, item));

    // exifr.thumbnail(join(rootPhotosDirectory, item)).then((output) => {
    //   writeFile(item + "-t.jpg", output, (err) => {
    //     console.log(err);
    //   });
    // });

    imageSource.metadata().then(function (metadata) {
      let exif = {};

      if (metadata.exif) {
        const exifData = exifReader(metadata.exif);

        const {
          FNumber,
          DateTimeOriginal,
          ISOSpeedRatings,
          ExposureTime,
          LensMake,
          FocalLength,
          FocalLengthIn35mmFilm,
          LensModel,
        } = exifData.Photo;

        const { Make, Model } = exifData.Image;
        exif = {
          FNumber,
          DateTimeOriginal,
          ISOSpeedRatings,
          ExposureTime,
          LensMake,
          FocalLength,
          FocalLengthIn35mmFilm,
          LensModel,
          Make,
          Model,
        };
      }

      processImage(imageSource, item, "thumbnails", 300);
      processImage(imageSource, item, "normal", 1500);

      photos.items.push({
        url: `${publicPhotosDirectory}${item}`,
        normal: `${publicPhotosDirectory}normal/${item}`,
        thumbnail: `${publicPhotosDirectory}thumbnails/${item}`,
        exif: {
          ...exif,
          ExposureTime: exif.ExposureTime &&
            format(fraction(exif.ExposureTime), {
              fraction: "ratio",
            }),
        },
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
    },
  );
  // TODO add gallery to gallery index
});
