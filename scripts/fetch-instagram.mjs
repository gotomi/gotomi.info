import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import Path from "node:path";
import { Readable } from "node:stream";
import sharp from "sharp";

const username = process.env.IG_USERNAME ?? "gotomik";
const appId = process.env.IG_APP_ID;
const csrfToken = process.env.IG_CSRF_TOKEN;
const claim = process.env.IG_CLAIM;

if (!appId || !csrfToken || !claim) {
  console.error(
    "Missing Instagram credentials. Set IG_APP_ID, IG_CSRF_TOKEN and IG_CLAIM (see .env.example).",
  );
  process.exit(1);
}

const instagramFeedUrl = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
const instagramPageUrl = "https://www.instagram.com/p/";

const requestHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "X-CSRFToken": csrfToken,
  "X-Instagram-AJAX": "1006144512",
  "X-IG-App-ID": appId,
  "X-ASBD-ID": "198387",
  "X-IG-WWW-Claim": claim,
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "Sec-GPC": "1",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
};

async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
      }
    }
  }

  throw lastError;
}

const getUserFeed = async () => {
  const result = await fetchWithRetry(instagramFeedUrl, {
    headers: requestHeaders,
    referrer: "https://www.instagram.com/",
    method: "GET",
    mode: "cors",
  });

  const json = await result.json();
  const edges = json?.data?.user?.edge_owner_to_timeline_media?.edges;

  if (!Array.isArray(edges)) {
    throw new Error("Unexpected Instagram response: missing edge_owner_to_timeline_media.edges");
  }

  const images = [];

  edges.forEach((item) => {
    const caption = item.node?.edge_media_to_caption?.edges?.[0]?.node?.text ?? "";
    const shortcode = item.node?.shortcode;

    if (!shortcode) return;

    if (item.node.__typename === "GraphImage") {
      images.push({
        text: caption,
        url: item.node.display_url,
        id: shortcode,
        href: instagramPageUrl + shortcode,
        type: "image",
      });
    } else if (item.node.__typename === "GraphVideo") {
      images.push({
        text: caption,
        url: item.node.video_url,
        id: shortcode,
        href: instagramPageUrl + shortcode,
        type: "video",
      });
    } else {
      item.node.edge_sidecar_to_children?.edges?.forEach((child) => {
        images.push({
          text: caption,
          url: child.node.display_url,
          id: shortcode,
          href: instagramPageUrl + shortcode,
          type: "image",
        });
      });
    }
  });

  return images;
};

const mediaDirectory = "./media/photos";
const publicDirectory = "./public/photos";

const downloadImage = async (image, destination) => {
  await mkdir(destination, { recursive: true });

  const path = Path.join(destination, image.id);
  const response = await fetchWithRetry(image.url, {});
  const ext = image.type === "image" ? "jpg" : "mp4";
  const writer = createWriteStream(`${path}.${ext}`);

  if (!response.body) {
    throw new Error(`Empty response body for ${image.url}`);
  }

  Readable.fromWeb(response.body).pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const convertImages = async (filename) => {
  const sourcePath = Path.join(mediaDirectory, `${filename}.jpg`);
  const outputPath = Path.join(publicDirectory, `${filename}.webp`);

  await sharp(sourcePath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);
};

const main = async () => {
  const images = await getUserFeed();

  await mkdir(publicDirectory, { recursive: true });

  for (const image of images) {
    await downloadImage(image, mediaDirectory);

    if (image.type === "image") {
      await convertImages(image.id);
    }
  }

  await writeFile("./src/_data/photos.json", JSON.stringify(images), "utf8");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
