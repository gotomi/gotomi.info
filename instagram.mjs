import Path from "node:path";
import { createWriteStream } from "node:fs";
import { writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import sharp from "sharp";

const instagramFeedUrl =
	"https://i.instagram.com/api/v1/users/web_profile_info/?username=gotomik";

const getUserFeed = async () => {
	const instagramPageUrl = "https://www.instagram.com/p/";

	const result = await fetch(instagramFeedUrl, {
		credentials: "include",
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0",
			Accept: "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"X-CSRFToken": "9OhftOa9mxw8Z3qg9XqZjVgySLZOZSvx",
			"X-Instagram-AJAX": "1006144512",
			"X-IG-App-ID": "936619743392459",
			"X-ASBD-ID": "198387",
			"X-IG-WWW-Claim": "hmac.AR02vc3ScFa7bE7RliINAsetunrmktCz8nNVRvvoSWQVyTk2",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "cors",
			"Sec-Fetch-Site": "same-site",
			"Sec-GPC": "1",
			Pragma: "no-cache",
			"Cache-Control": "no-cache",
		},
		referrer: "https://www.instagram.com/",
		method: "GET",
		mode: "cors",
	});
	const json = await result.json();
	const timeline = json.data.user.edge_owner_to_timeline_media.edges;

	const images = [];

	timeline.forEach((item) => {
		if (item.node.__typename === "GraphImage") {
			images.push({
				text: item.node.edge_media_to_caption.edges[0].node.text,
				url: item.node.display_url,
				id: item.node.shortcode,
				href: instagramPageUrl + item.node.shortcode,
				type: "image",
			});
		} else if (item.node.__typename === "GraphVideo") {
			images.push({
				text: item.node.edge_media_to_caption.edges[0].node.text,
				url: item.node.video_url,
				id: item.node.shortcode,
				href: instagramPageUrl + item.node.shortcode,
				type: "video",
			});
		} else {
			//__typename": "GraphSidecar"

			item.node.edge_sidecar_to_children.edges.forEach((it) => {
				const _randomName = `a${Math.floor(Math.random() * 100000000)}`;
				images.push({
					text: item.node.edge_media_to_caption.edges[0].node.text,
					url: it.node.display_url,
					id: it.node.shortcode,
					href: instagramPageUrl + item.node.shortcode,
					type: "image",
				});
			});
		}
	});

	return images;
};

const downloadImage = async (image, dest) => {
	const path = Path.join(dest, image.id);
	const response = await fetch(image.url);
	if (!response.ok)
		throw new Error(`Failed to download ${image.url}: ${response.status}`);
	const ext = image.type === "image" ? "jpg" : "mp4";
	const writer = createWriteStream(`${path}.${ext}`);
	Readable.fromWeb(response.body).pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
};

const convertImages = (filename, dest) => {
	const path = Path.join(dest, filename);

	sharp(`${path}.jpg`)
		.resize(400)
		.jpeg()
		.toFile(`${path}-400.jpg`, (err, info) => {
			console.log(info, err);
		});
	sharp(`${path}.jpg`)
		.resize(400)
		.webp()
		.toFile(`${path}.webp`, (err, info) => {
			console.log(info, err);
		});
};

const images = await getUserFeed();
await writeFile("./src/_data/photos.json", JSON.stringify(images), "utf8");
for (const image of images) {
	await downloadImage(image, "./public/photos");
	if (image.type === "image") {
		convertImages(image.id, "./public/photos");
	}
}
