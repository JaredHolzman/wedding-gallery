"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PhotoCard } from "./PhotoCard";
import { Lightbox } from "./Lightbox";
import { downloadImage, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { PHOTOS_PER_LOAD } from "@/lib/constants";

import type { Photo } from "@/lib/photo-types";

interface PhotoGridProps {
  photos: Photo[];
  initialCategory?: string;
  selectedCategory?: string;
}

export function PhotoGrid({
  photos,
  initialCategory = "all",
  selectedCategory,
}: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState(selectedCategory || initialCategory);

  // Filter photos by category
  const filteredPhotos = React.useMemo(() => {
    if (!category || category === "all") return photos;
    const categoryName = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Convert kebab-case to Title Case
    return photos.filter((photo) => photo.category === categoryName);
  }, [photos, category]);

  const loadInitialPhotos = useCallback(() => {
    const initial = filteredPhotos.slice(0, PHOTOS_PER_LOAD);
    setVisiblePhotos(initial);
    setHasMore(filteredPhotos.length > PHOTOS_PER_LOAD);
  }, [filteredPhotos]);

  const loadMorePhotos = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = visiblePhotos.length;
      const nextPhotos = filteredPhotos.slice(
        currentLength,
        currentLength + PHOTOS_PER_LOAD,
      );

      setVisiblePhotos((prev) => [...prev, ...nextPhotos]);
      setHasMore(currentLength + PHOTOS_PER_LOAD < filteredPhotos.length);
      setLoadingMore(false);
    }, 500);
  }, [visiblePhotos, filteredPhotos, loadingMore, hasMore]);

  useEffect(() => {
    loadInitialPhotos();
  }, [loadInitialPhotos]);

  // Update category when selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory !== undefined) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMorePhotos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMorePhotos]);

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handleDownload = (photo: Photo) => {
    downloadImage(photo.src, photo.filename);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (selectedPhotoIndex === -1) return;

    const newIndex =
      direction === "next"
        ? Math.min(selectedPhotoIndex + 1, visiblePhotos.length - 1)
        : Math.max(selectedPhotoIndex - 1, 0);

    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(visiblePhotos[newIndex]);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visiblePhotos.map((photo, index) => (
            <PhotoCard
              key={`${photo.id}-${index}`}
              photo={photo}
              index={index}
              onClick={() => handlePhotoClick(photo, index)}
              onDownload={() => handleDownload(photo)}
            />
          ))}
        </div>

        <div
          className={cn(
            "flex justify-center items-center py-12 transition-opacity duration-300",
            loadingMore ? "opacity-100" : "opacity-0 h-0 py-0 overflow-hidden",
          )}
        >
          <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
        </div>

        {!hasMore && visiblePhotos.length > 0 && (
          <div className="text-center py-12 transition-all duration-500">
            <p className="text-stone-500">
              {"You've reached the end of the gallery (" +
                visiblePhotos.length +
                " photos)"}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            onClose={() => {
              setSelectedPhoto(null);
              setSelectedPhotoIndex(-1);
            }}
            onNavigate={handleNavigate}
            onDownload={() => handleDownload(selectedPhoto)}
            hasNext={selectedPhotoIndex < visiblePhotos.length - 1}
            hasPrev={selectedPhotoIndex > 0}
          />
        )}
      </AnimatePresence>
    </>
  );
}
