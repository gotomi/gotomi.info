import gdyniaJson from "../_data/galleries/Gdynia-2022.json";
import martaJson from "../_data/galleries/marta.json";
import nadmorskieJson from "../_data/galleries/nadmorskie-klimaty.json";
import instagramJson from "../_data/instagram.json";
import musicJson from "../_data/music.json";
import photosJson from "../_data/photos.json";
import projectsJson from "../_data/projects.json";
import type { GalleryData, HomePhoto, InstagramItem, MusicTrack, Project } from "../types/photos";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function fail(source: string, message: string): never {
  throw new Error(`[data] ${source}: ${message}`);
}

function requireString(source: string, value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    fail(source, `expected "${field}" to be a non-empty string`);
  }
}

function validateGallery(source: string, value: unknown): GalleryData {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    fail(source, "expected an object with an items array");
  }

  value.items.forEach((item: unknown, index: number) => {
    if (!isRecord(item)) {
      fail(source, `items[${index}] is not an object`);
    }

    for (const field of ["normal", "thumbnail", "alt"] as const) {
      requireString(source, item[field], `items[${index}].${field}`);
    }

    if (typeof item.width !== "number" || typeof item.height !== "number") {
      fail(source, `items[${index}] is missing numeric width/height`);
    }
  });

  return value as unknown as GalleryData;
}

function validateMusic(value: unknown): MusicTrack[] {
  if (!Array.isArray(value)) {
    fail("music.json", "expected an array");
  }

  value.forEach((track: unknown, index: number) => {
    if (!isRecord(track)) {
      fail("music.json", `track ${index} is not an object`);
    }

    for (const field of ["audioSource", "title", "albumCover", "trackCover"] as const) {
      requireString("music.json", track[field], `[${index}].${field}`);
    }
  });

  return value as unknown as MusicTrack[];
}

function validateProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) {
    fail("projects.json", "expected an array");
  }

  value.forEach((project: unknown, index: number) => {
    if (!isRecord(project)) {
      fail("projects.json", `project ${index} is not an object`);
    }

    for (const field of ["name", "description", "svn_url", "thumbnail"] as const) {
      requireString("projects.json", project[field], `[${index}].${field}`);
    }
  });

  return value as unknown as Project[];
}

function validateInstagram(value: unknown): InstagramItem[] {
  if (!Array.isArray(value)) {
    fail("instagram.json", "expected an array");
  }

  value.forEach((item: unknown, index: number) => {
    if (!isRecord(item)) {
      fail("instagram.json", `item ${index} is not an object`);
    }

    requireString("instagram.json", item.uri, `[${index}].uri`);

    if (item.title !== undefined && typeof item.title !== "string") {
      fail("instagram.json", `[${index}].title must be a string`);
    }
  });

  return value as unknown as InstagramItem[];
}

function getHomePhotos(value: unknown): HomePhoto[] {
  if (!Array.isArray(value)) {
    fail("photos.json", "expected an array");
  }

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        isRecord(item) && item.type === "image" && typeof item.id === "string",
    )
    .map((item) => ({
      uri: `/photos/${String(item.id)}.webp`,
      text: typeof item.text === "string" ? item.text : "",
    }))
    .slice(0, 13);
}

export const galleries = {
  marta: validateGallery("marta.json", martaJson),
  gdynia: validateGallery("Gdynia-2022.json", gdyniaJson),
  nadmorskie: validateGallery("nadmorskie-klimaty.json", nadmorskieJson),
};

export const music = validateMusic(musicJson);
export const projects = validateProjects(projectsJson);
export const instagramPhotos = validateInstagram(instagramJson);
export const homePhotos = getHomePhotos(photosJson);
