import { Photo, PhotoCategory } from './photo-types';
import photoMetadata from './photo-metadata.json';

const PHOTOS_PATH = '/wedding_photos';

export async function getAllPhotos(): Promise<Photo[]> {
  return photoMetadata.map(photo => ({
    ...photo,
    src: `${PHOTOS_PATH}/${photo.filename}`,
  }));
}

export function getPhotoById(id: string): Photo | undefined {
  const photo = photoMetadata.find(p => p.id === id);
  if (!photo) return undefined;
  
  return {
    ...photo,
    src: `${PHOTOS_PATH}/${photo.filename}`,
  };
}

export function getPhotoCategories(): PhotoCategory[] {
  const photoIds = photoMetadata.map(p => p.id);
  
  const categories: PhotoCategory[] = [
    {
      id: 'all',
      name: 'All Photos',
      photoIds: photoIds,
    },
    {
      id: 'portraits',
      name: 'Portraits',
      photoIds: photoIds.filter(id => {
        const num = parseInt(id.match(/\d+/)?.[0] || '0');
        return num >= 16 && num <= 100;
      }),
    },
    {
      id: 'ceremony',
      name: 'Ceremony',
      photoIds: photoIds.filter(id => {
        const num = parseInt(id.match(/\d+/)?.[0] || '0');
        return num >= 101 && num <= 300;
      }),
    },
    {
      id: 'reception',
      name: 'Reception',
      photoIds: photoIds.filter(id => {
        const num = parseInt(id.match(/\d+/)?.[0] || '0');
        return num >= 301 && num <= 500;
      }),
    },
    {
      id: 'details',
      name: 'Details',
      photoIds: photoIds.filter(id => {
        const num = parseInt(id.match(/\d+/)?.[0] || '0');
        return num > 500;
      }),
    },
  ];
  
  return categories.filter(cat => cat.photoIds.length > 0);
}