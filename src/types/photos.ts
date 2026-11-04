export interface ExifDataTypes {
  FFNumber?: number;
  ISO?: number;
  exposureTime?: string;
  LensMake?: string;
  FocalLength?: number;
  FocalLengthIn35mmFormat?: number;
  LensModel?: string;
}

export interface GalleryPhoto {
  normal: string;
  thumbnail: string;
  exif?: ExifDataTypes;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryData {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  items: GalleryPhoto[];
}

export interface MusicTrack {
  audioSource: string;
  title: string;
  albumCover: string;
  trackCover: string;
}

export interface Project {
  name: string;
  description: string;
  homepage?: string | null;
  svn_url: string;
  thumbnail: string;
}

export interface InstagramItem {
  title?: string;
  uri: string;
  type?: "image" | "video";
}

export interface HomePhoto {
  uri: string;
  text: string;
}
