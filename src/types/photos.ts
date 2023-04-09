export interface ExifDataTypes {
  FFNumber: number;
  ISO: number;
  exposureTime: string;
  LensMake: string;
  FocalLength: number;
  FocalLengthIn35mmFormat: number;
  LensModel: number;
}
export interface photo {
  url: string;
  normal: string;
  thumbnail: string;
  exif: ExifDataTypes;
  alt: string;
  width: number;
  height: number;
}
