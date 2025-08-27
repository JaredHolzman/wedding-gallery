import fs from "fs";
import path from "path";

import type { Photo, PhotoCategory } from "./photo-types";

const PHOTOS_DIR = "public/wedding_photos";
const PHOTOS_PATH = "/wedding_photos";

export async function getAllPhotos(): Promise<Photo[]> {
  const photosDirectory = path.join(process.cwd(), PHOTOS_DIR);
  const filenames = fs
    .readdirSync(photosDirectory)
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".JPG"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  const uniqueIds = new Set<string>();
  const photos: Photo[] = [];
  
  filenames.forEach((filename, index) => {
    const filePath = path.join(photosDirectory, filename);
    const stats = fs.statSync(filePath);
    let id = filename.replace(/\.(jpg|JPG)$/, "");
    
    // Ensure unique ID
    if (uniqueIds.has(id)) {
      id = `${id}_${index}`;
    }
    uniqueIds.add(id);

    photos.push({
      id,
      filename,
      src: `${PHOTOS_PATH}/${filename}`,
      width: 6000,
      height: 4000,
      aspectRatio: 1.5,
      fileSize: stats.size,
    });
  });

  return photos;
}

export function getPhotoById(id: string): Photo | undefined {
  const photos = getAllPhotosSync();
  return photos.find((photo) => photo.id === id);
}

export function getAllPhotosSync(): Photo[] {
  const photosDirectory = path.join(process.cwd(), PHOTOS_DIR);
  const filenames = fs
    .readdirSync(photosDirectory)
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".JPG"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  const uniqueIds = new Set<string>();
  const photos: Photo[] = [];
  
  filenames.forEach((filename, index) => {
    const filePath = path.join(photosDirectory, filename);
    const stats = fs.statSync(filePath);
    let id = filename.replace(/\.(jpg|JPG)$/, "");
    
    // Ensure unique ID
    if (uniqueIds.has(id)) {
      id = `${id}_${index}`;
    }
    uniqueIds.add(id);

    photos.push({
      id,
      filename,
      src: `${PHOTOS_PATH}/${filename}`,
      width: 6000,
      height: 4000,
      aspectRatio: 1.5,
      fileSize: stats.size,
    });
  });

  return photos;
}

export function getPhotoCategories(): PhotoCategory[] {
  const photos = getAllPhotosSync();
  const photoIds = photos.map((p) => p.id);

  const categories: PhotoCategory[] = [
    {
      id: "all",
      name: "All Photos",
      photoIds: photoIds,
    },
    {
      id: "portraits",
      name: "Portraits",
      photoIds: photoIds.filter((id) => {
        const num = parseInt(id.match(/\d+/)?.[0] || "0");
        return num >= 16 && num <= 100;
      }),
    },
    {
      id: "ceremony",
      name: "Ceremony",
      photoIds: photoIds.filter((id) => {
        const num = parseInt(id.match(/\d+/)?.[0] || "0");
        return num >= 101 && num <= 300;
      }),
    },
    {
      id: "reception",
      name: "Reception",
      photoIds: photoIds.filter((id) => {
        const num = parseInt(id.match(/\d+/)?.[0] || "0");
        return num >= 301 && num <= 500;
      }),
    },
    {
      id: "details",
      name: "Details",
      photoIds: photoIds.filter((id) => {
        const num = parseInt(id.match(/\d+/)?.[0] || "0");
        return num > 500;
      }),
    },
  ];

  return categories.filter((cat) => cat.photoIds.length > 0);
}
