'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { Photo, formatFileSize } from '@/lib/photo-types';
import { useScrollLock } from '@/lib/hooks/useScrollLock';
import { useState } from 'react';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDownload: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Lightbox({ 
  photo, 
  onClose, 
  onNavigate, 
  onDownload,
  hasNext,
  hasPrev 
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useScrollLock(true);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (hasPrev) onNavigate('prev');
        break;
      case 'ArrowRight':
        if (hasNext) onNavigate('next');
        break;
      case ' ':
        e.preventDefault();
        setIsZoomed(!isZoomed);
        break;
    }
  }, [onClose, onNavigate, hasNext, hasPrev, isZoomed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Photo ${photo.id}`,
          text: 'Check out this beautiful wedding photo!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-white">
            <p className="text-sm opacity-75">Photo {photo.id}</p>
            <p className="text-xs opacity-50">{formatFileSize(photo.fileSize)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <ZoomOut className="w-5 h-5 text-white" />
            ) : (
              <ZoomIn className="w-5 h-5 text-white" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Download"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div 
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          key={photo.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: isZoomed ? 1.5 : 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative max-w-full max-h-full"
          style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          <Image
            src={photo.src}
            alt={`Wedding photo ${photo.id}`}
            width={photo.width}
            height={photo.height}
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
            quality={95}
            priority
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>
      </div>

      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('prev');
            setImageLoaded(false);
            setIsZoomed(false);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('next');
            setImageLoaded(false);
            setIsZoomed(false);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-sm opacity-75">
            Use arrow keys to navigate • Press space to zoom • Press ESC to close
          </p>
        </div>
      </div>
    </motion.div>
  );
}