import { PhotoCategory, PrismaClient, ShareTargetType, ShareTheme } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "hello@lumadrop.dev" },
    update: {},
    create: { email: "hello@lumadrop.dev", name: "Luma Creator" }
  });

  const album = await prisma.album.create({
    data: {
      userId: user.id,
      title: "Soft Days",
      description: "一组柔和光线里的旅行照片，用于演示 LumaDrop 的作品集分享体验。",
      theme: ShareTheme.editorial,
      isPrivate: false
    }
  });

  const photo = await prisma.photo.create({
    data: {
      userId: user.id,
      albumId: album.id,
      title: "晨雾海岸",
      objectKey: "seed/coast.jpg",
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
      width: 1200,
      height: 1500,
      size: 2840000,
      mimeType: "image/jpeg",
      favorite: true,
      category: PhotoCategory.landscape,
      tags: ["海岸", "晨雾", "旅行"],
      dominantColor: "#d8c7ae",
      exif: { camera: "Luma One", lens: "35mm f/1.8", iso: 160 }
    }
  });

  await prisma.album.update({
    where: { id: album.id },
    data: { coverPhotoId: photo.id }
  });

  await prisma.share.upsert({
    where: { token: "SOFTDAY" },
    update: {},
    create: {
      userId: user.id,
      albumId: album.id,
      targetType: ShareTargetType.ALBUM,
      token: "SOFTDAY",
      title: "Soft Days Collection",
      isPublic: true,
      allowDownload: true,
      theme: ShareTheme.editorial
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
