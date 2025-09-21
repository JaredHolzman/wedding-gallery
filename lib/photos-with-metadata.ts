import { Photo, PhotoCategory, PhotoCategoryType } from "./photo-types";
import photoMetadata from "./photo-metadata.json";

export async function getAllPhotos(): Promise<Photo[]> {
  return photoMetadata.map((photo) => ({
    ...photo,
    category: photo.category as PhotoCategoryType,
  }));
}

export function getPhotoById(id: string): Photo | undefined {
  const photo = photoMetadata.find((p) => p.id === id);
  if (!photo) return undefined;

  return {
    ...photo,
    category: photo.category as PhotoCategoryType,
  };
}

export function getPhotosByCategory(category: PhotoCategoryType): Photo[] {
  return photoMetadata
    .filter((p) => p.category === category)
    .map((photo) => ({
      ...photo,
      category: photo.category as PhotoCategoryType,
    }));
}

export function getPhotoCategories(): PhotoCategory[] {
  const categoryCounts = photoMetadata.reduce(
    (acc, photo) => {
      const cat = photo.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(photo.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const categories: PhotoCategory[] = [
    {
      id: "all",
      name: "All Photos",
      photoIds: photoMetadata.map((p) => p.id),
    },
  ];

  // Add categories with photos
  Object.entries(categoryCounts).forEach(([categoryName, photoIds]) => {
    categories.push({
      id: categoryName.toLowerCase().replace(/\s+/g, "-"),
      name: categoryName,
      photoIds: photoIds,
    });
  });

  return categories;
}

export function getCategoryStats() {
  const stats = photoMetadata.reduce(
    (acc, photo) => {
      const cat = photo.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    total: photoMetadata.length,
    categories: stats,
  };
}
