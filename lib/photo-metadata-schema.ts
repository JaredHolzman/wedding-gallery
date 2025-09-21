export interface PhotoMetadata {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  blurDataURL?: string;
  category: PhotoCategory;
  description: string;
  tags: string[];
  timestamp?: string;
  location?: string;
  people?: string[];
}

export type PhotoCategory = "Ceremony" | "Portraits" | "Reception" | "Party";

export interface CategoryDefinition {
  id: PhotoCategory;
  name: string;
  description: string;
  icon: string;
}

export const PHOTO_CATEGORIES: CategoryDefinition[] = [
  {
    id: "Ceremony",
    name: "Ceremony",
    description: "Processional, vows, first kiss, recessional",
    icon: "Heart",
  },
  {
    id: "Portraits",
    name: "Portraits",
    description: "Couple, family, bridal party",
    icon: "Camera",
  },
  {
    id: "Reception",
    name: "Reception",
    description: "Entrance, first dance, speeches, cake cutting",
    icon: "Music",
  },
  {
    id: "Party",
    name: "Party",
    description: "Dancing, celebration shots",
    icon: "Zap",
  },
];
