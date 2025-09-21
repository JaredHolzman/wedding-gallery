"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

import type { Photo } from "@/lib/photo-types";

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
  onDownload: () => void;
}

export function PhotoCard({ photo, onClick, onDownload }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "100px",
    freezeOnceVisible: true,
  });

  const isVisible = entry?.isIntersecting;

  return (
    <div
      ref={ref}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-lg bg-stone-100 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/2]">
        {isVisible && (
          <Image
            src={photo.src}
            alt={`Wedding photo ${photo.id}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-500 ease-out",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
              isHovered && "scale-105",
            )}
            onLoad={() => setIsLoaded(true)}
            quality={85}
            placeholder="blur"
            blurDataURL={photo.blurDataURL}
            fill
          />
        )}

        {!isLoaded && isVisible && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300">
            <div className="absolute inset-0 bg-stone-100 animate-pulse" />
          </div>
        )}
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 transform",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
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
      </div>
    </div>
  );
}
