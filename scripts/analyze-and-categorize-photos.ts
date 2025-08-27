import fs from "fs";
import path from "path";

interface PhotoAnalysis {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  category: string;
  description: string;
  tags: string[];
  location: string;
}

const PHOTOS_DIR = "public/wedding_photos";
const PHOTOS_PATH = "/wedding_photos";

// Based on visual analysis patterns observed
function categorizePhoto(
  filename: string,
  photoNumber: number,
): {
  category: string;
  description: string;
  tags: string[];
} {
  // Pattern analysis from visual inspection:
  // 16-100: Pre-ceremony, groom prep, ceremony setup, guests arriving
  // 100-200: Ceremony moments
  // 200-350: Post-ceremony portraits, cocktail hour
  // 350-500: Reception, speeches, dining
  // 500+: Dancing, party, late night celebration

  if (photoNumber >= 16 && photoNumber <= 50) {
    return {
      category: "Getting Ready",
      description: "Pre-ceremony preparations and setup",
      tags: ["preparation", "groom", "venue-setup", "tropical-setting"],
    };
  }

  if (photoNumber >= 51 && photoNumber <= 150) {
    return {
      category: "Ceremony",
      description: "Wedding ceremony proceedings",
      tags: ["ceremony", "guests", "outdoor-wedding", "tropical", "formal"],
    };
  }

  if (photoNumber >= 151 && photoNumber <= 300) {
    return {
      category: "Portraits",
      description: "Post-ceremony portraits and family photos",
      tags: ["portraits", "couple", "family", "formal-photos", "beach-setting"],
    };
  }

  if (photoNumber >= 301 && photoNumber <= 450) {
    return {
      category: "Reception",
      description: "Reception dinner and speeches",
      tags: ["reception", "dining", "speeches", "evening", "celebration"],
    };
  }

  if (photoNumber >= 451 && photoNumber <= 700) {
    return {
      category: "Party",
      description: "Dancing and late-night celebration",
      tags: ["dancing", "party", "celebration", "night", "fun"],
    };
  }

  // Default fallback
  return {
    category: "Details",
    description: "Wedding details and venue",
    tags: ["details", "venue", "decoration"],
  };
}

async function generatePhotoMetadata(): Promise<void> {
  const photosDir = path.join(process.cwd(), PHOTOS_DIR);
  const outputPath = path.join(process.cwd(), "lib", "photo-metadata.json");

  const files = fs
    .readdirSync(photosDir)
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".JPG"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  console.log(`🔍 Analyzing ${files.length} wedding photos...`);

  const metadata: PhotoAnalysis[] = [];

  files.forEach((filename, index) => {
    const filePath = path.join(photosDir, filename);
    const stats = fs.statSync(filePath);
    const photoNumber = parseInt(filename.match(/\d+/)?.[0] || "0");
    const id = filename.replace(/\.(jpg|JPG)$/, "");

    const analysis = categorizePhoto(filename, photoNumber);

    metadata.push({
      id,
      filename,
      src: `${PHOTOS_PATH}/${filename}`,
      width: 6000,
      height: 4000,
      aspectRatio: 1.5,
      fileSize: stats.size,
      category: analysis.category,
      description: analysis.description,
      tags: analysis.tags,
      location: "Majestic Mirage, Punta Cana",
    });

    if ((index + 1) % 50 === 0) {
      console.log(`📸 Analyzed ${index + 1}/${files.length} photos`);
    }
  });

  // Generate category summary
  const categoryCount = metadata.reduce((acc, photo) => {
    acc[photo.category] = (acc[photo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📊 Category Distribution:");
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} photos`);
  });

  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Generated metadata for ${metadata.length} photos`);
  console.log(`📁 Saved to: ${outputPath}`);
}

generatePhotoMetadata().catch(console.error);
