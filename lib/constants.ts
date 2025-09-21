export const PHOTOS_PER_LOAD = 20;

export const SITE_CONFIG = {
  title: "Jared & Joanna Wedding Gallery",
  description: "Browse and download beautiful memories from our special day",
  coupleNames: {
    partner1: "Jared",
    partner2: "Joanna",
    combined: "Jared & Joanna",
  },
  weddingDate: "June 06, 2025",
  venue: "Majestic Mirage, Punta Cana",
};

export const DOWNLOAD_URL =
  "https://drive.google.com/file/d/12Vrf0lxyc909tFZOxNXK7_wuay2g0BLa/view?usp=sharing";

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
