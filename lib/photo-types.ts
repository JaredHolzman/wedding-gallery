export interface Photo {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  blurDataURL?: string;
  category: PhotoCategoryType;
  description: string;
  tags: string[];
  location?: string;
}

export type PhotoCategoryType = 
  | 'Getting Ready'
  | 'Ceremony' 
  | 'Portraits'
  | 'Cocktail Hour'
  | 'Reception'
  | 'Party'
  | 'Details';

export interface PhotoCategory {
  id: string;
  name: string;
  photoIds: string[];
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}