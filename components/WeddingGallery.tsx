'use client';

import { useState, useMemo } from 'react';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import { PhotoGrid } from './PhotoGrid';
import { Photo } from '@/lib/photo-types';

interface WeddingGalleryProps {
  photos: Photo[];
}

export function WeddingGallery({ photos }: WeddingGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = photos.reduce((acc, photo) => {
      acc[photo.category] = (acc[photo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      all: photos.length,
      'Getting Ready': counts['Getting Ready'] || 0,
      'Ceremony': counts['Ceremony'] || 0,
      'Portraits': counts['Portraits'] || 0,
      'Cocktail Hour': counts['Cocktail Hour'] || 0,
      'Reception': counts['Reception'] || 0,
      'Party': counts['Party'] || 0,
      'Details': counts['Details'] || 0,
    };
  }, [photos]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Scroll to gallery section
    document.getElementById('gallery')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleDownloadAll = () => {
    // TODO: Implement bulk download functionality
    alert('Download all functionality coming soon!');
  };

  return (
    <main className="min-h-screen bg-white">
      <Navigation 
        onCategoryChange={handleCategoryChange}
        onDownloadAll={handleDownloadAll}
        selectedCategory={selectedCategory}
        categoryCounts={categoryCounts}
      />
      <Hero />
      <section id="gallery" className="py-20">
        <PhotoGrid 
          photos={photos} 
          selectedCategory={selectedCategory}
        />
      </section>
    </main>
  );
}