export type Photo = {
  id: string;
  userId?: string;
  title: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  uploadedAt: string;
  takenAt?: string;
  albumId?: string;
  favorite: boolean;
  deletedAt?: string | null;
  dominantColor?: string;
  category?: PhotoCategory;
  tags?: string[];
  exif?: {
    camera?: string;
    lens?: string;
    iso?: number;
    focalLength?: string;
  };
};

export type PhotoCategory = "person" | "animal" | "plant" | "city" | "landscape" | "interior" | "food" | "other";

export type LumaUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  provider: "email" | "phone" | "wechat";
};

export type Album = {
  id: string;
  userId?: string;
  title: string;
  description: string;
  coverPhotoId?: string;
  createdAt: string;
  isPrivate: boolean;
  theme: "editorial" | "minimal" | "noir";
};

export type Share = {
  id: string;
  userId?: string;
  token: string;
  albumId?: string;
  photoId?: string;
  title: string;
  isPublic: boolean;
  password?: string;
  allowDownload: boolean;
  theme: "editorial" | "minimal" | "noir";
  createdAt: string;
};

export type GridMode = "grid" | "masonry";
