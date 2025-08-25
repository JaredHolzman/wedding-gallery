'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Maximize2, Heart } from 'lucide-react';
import { Photo } from '@/lib/photo-types';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
  onDownload: () => void;
}

export function PhotoCard({ photo, index, onClick, onDownload }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true,
  });

  const isVisible = entry?.isIntersecting;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-stone-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/2]">
        {isVisible && (
          <Image
            src={photo.src}
            alt={`Wedding photo ${photo.id}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-700',
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
              isHovered && 'scale-105'
            )}
            onLoad={() => setIsLoaded(true)}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAHAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQQDAAMAAAAAAAAAAAABAgMABAUREiExQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAZEQADAQEBAAAAAAAAAAAAAAAAAQIRMUH/2gAMAwEAAhEDEQA/AKXIYu1vYQs8YZh52dA2DrvRBoexUWTn4IudlbvFK+yjbLse6IJPn3REzgaKD6qyOJxEElvqrOe0TaMf/9k="
          />
        )}
        
        {!isLoaded && isVisible && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse" />
        )}
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 text-white"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{photo.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Download photo"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}