export const SITE_CONFIG = {
  title: "L & V Wedding Gallery",
  description: "Browse and download beautiful memories from our special day",
  coupleNames: {
    partner1: "L",
    partner2: "V",
    combined: "L & V",
  },
  weddingDate: "June 18, 2025",
  venue: "Beautiful Venue Name",
  photographer: "Professional Photography Studio",
};

export const PHOTOS_PER_LOAD = 20;

export const IMAGE_CONFIG = {
  thumbnailWidth: 400,
  thumbnailQuality: 85,
  fullSizeQuality: 95,
  blurDataURLWidth: 10,
  blurDataURLHeight: 7,
  photosPerPage: 20,
  preloadCount: 5,
};

export const ANIMATION_CONFIG = {
  defaultDuration: 0.3,
  staggerDelay: 0.05,
  springConfig: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export const GRID_COLUMNS = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
} as const;
