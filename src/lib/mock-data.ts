import type { Album, Photo, Share } from "@/types/lumadrop";

export const mockPhotos: Photo[] = [
  {
    id: "p-aurora",
    title: "晨雾海岸",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1500,
    size: 2840000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    albumId: "a-soft-days",
    favorite: true,
    dominantColor: "#d8c7ae",
    category: "landscape",
    tags: ["海岸", "晨雾", "旅行"],
    exif: { camera: "Luma One", lens: "35mm f/1.8", iso: 160, focalLength: "35mm" }
  },
  {
    id: "p-greenhouse",
    title: "温室午后",
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 900,
    size: 2180000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    albumId: "a-soft-days",
    favorite: false,
    dominantColor: "#8fb08d",
    category: "plant",
    tags: ["花园", "植物", "午后"],
    exif: { camera: "Luma One", lens: "50mm f/1.4", iso: 100, focalLength: "50mm" }
  },
  {
    id: "p-city",
    title: "雨后街角",
    url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1600,
    size: 3120000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
    albumId: "a-night-walk",
    favorite: true,
    dominantColor: "#66717a",
    category: "city",
    tags: ["城市", "雨后", "街角"]
  },
  {
    id: "p-gallery",
    title: "白墙展厅",
    url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 800,
    size: 1920000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    albumId: "a-night-walk",
    favorite: false,
    dominantColor: "#d7d3ca",
    category: "interior",
    tags: ["展厅", "建筑", "空间"]
  },
  {
    id: "p-river",
    title: "河面蓝调",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 780,
    size: 2440000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 520).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    albumId: "a-soft-days",
    favorite: false,
    dominantColor: "#7290a0",
    category: "landscape",
    tags: ["河面", "蓝调", "自然"]
  },
  {
    id: "p-portrait",
    title: "窗边肖像",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 1500,
    size: 2680000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    albumId: "a-portraits",
    favorite: true,
    dominantColor: "#c6a892",
    category: "person",
    tags: ["人物", "肖像", "窗边"]
  },
  {
    id: "p-cat",
    title: "午睡伙伴",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
    width: 1200,
    height: 900,
    size: 2080000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 880).toISOString(),
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 58).toISOString(),
    albumId: "a-soft-days",
    favorite: false,
    dominantColor: "#b69b80",
    category: "animal",
    tags: ["动物", "宠物", "猫"]
  }
];

export const mockAlbums: Album[] = [
  {
    id: "a-soft-days",
    title: "Soft Days",
    description: "光线柔和的旅行片段，适合分享给亲密朋友的小型相册。",
    coverPhotoId: "p-aurora",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    isPrivate: false,
    theme: "editorial"
  },
  {
    id: "a-night-walk",
    title: "After Rain",
    description: "城市、墙面、湿润空气和一点安静的蓝。",
    coverPhotoId: "p-city",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isPrivate: true,
    theme: "noir"
  },
  {
    id: "a-portraits",
    title: "Quiet Portraits",
    description: "人物照片的私密交付页，默认关闭公开下载。",
    coverPhotoId: "p-portrait",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    isPrivate: true,
    theme: "minimal"
  }
];

export const mockShares: Share[] = [
  {
    id: "s-soft-days",
    token: "SOFTDAY",
    albumId: "a-soft-days",
    title: "Soft Days Collection",
    isPublic: true,
    allowDownload: true,
    theme: "editorial",
    createdAt: new Date().toISOString()
  }
];
