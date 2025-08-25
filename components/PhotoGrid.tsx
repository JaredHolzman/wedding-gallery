"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoCard } from "./PhotoCard";
import { Lightbox } from "./Lightbox";
import { downloadImage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import type { Photo } from "@/lib/photo-types";
import { PHOTOS_PER_LOAD } from "@/lib/constants";

interface PhotoGridProps {
  photos: Photo[];
  initialCategory?: string;
}

export function PhotoGrid({ photos, initialCategory = "all" }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(-1);
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState(initialCategory);

  const loadInitialPhotos = useCallback(() => {
    const initial = photos.slice(0, PHOTOS_PER_LOAD);
    setVisiblePhotos(initial);
    setHasMore(photos.length > PHOTOS_PER_LOAD);
  }, [photos]);

  const loadMorePhotos = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = visiblePhotos.length;
      const nextPhotos = photos.slice(
        currentLength,
        currentLength + PHOTOS_PER_LOAD,
      );

      setVisiblePhotos((prev) => [...prev, ...nextPhotos]);
      setHasMore(currentLength + PHOTOS_PER_LOAD < photos.length);
      setLoadingMore(false);
    }, 500);
  }, [visiblePhotos, photos, loadingMore, hasMore]);

  useEffect(() => {
    loadInitialPhotos();
  }, [loadInitialPhotos]);

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
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visiblePhotos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                onClick={() => handlePhotoClick(photo, index)}
                onDownload={() => handleDownload(photo)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {loadingMore && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
          </div>
        )}

        {!hasMore && visiblePhotos.length > 0 && (
          <div className="text-center py-12">
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
