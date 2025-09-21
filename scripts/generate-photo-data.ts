import fs from "fs";
import path from "path";
import sharp from "sharp";

interface PhotoMetadata {
  id: string;
  filename: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  blurDataURL: string;

  category: string;
  description: string;
  tags: string[];
  location: string;
}

const PHOTOS_DIR = "public/wedding_photos";
const PHOTOS_PATH = "/wedding_photos";

function categorizePhoto(
  filename: string,
  photoNumber: number,
): {
  category: string;
  description: string;
  tags: string[];
} {
  if (photoNumber <= 150) {
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

async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10, 7, { fit: "cover" })
    .blur()
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
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

  console.log(`Processing ${files.length} photos...`);

  const metadata: PhotoMetadata[] = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];

    try {
      const filePath = path.join(photosDir, filename);
      const stats = fs.statSync(filePath);
      const photoNumber = parseInt(filename.match(/\d+/)?.[0] || "0");
      const id = filename.replace(/\.(jpg|JPG)$/, "");

      const image = sharp(filePath);
      const { width, height } = await image.metadata();
      const blurDataURL = await generateBlurDataURL(filePath);
      const analysis = categorizePhoto(filename, photoNumber);

      metadata.push({
        id,
        filename,
        src: `${PHOTOS_PATH}/${filename}`,
        width: width || 6000,
        height: height || 4000,
        aspectRatio: (width || 6000) / (height || 4000),
        fileSize: stats.size,
        blurDataURL,

        category: analysis.category,
        description: analysis.description,
        tags: analysis.tags,
        location: "Majestic Mirage, Punta Cana",
      });

      console.log(`✓ Processed ${i + 1}/${files.length}: ${filename}`);
    } catch (error) {
      console.error(`✗ Error processing ${filename}:`, error);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log(`\n✅ Generated metadata for ${metadata.length} photos`);
  console.log(`📁 Saved to: ${outputPath}`);
}

generatePhotoMetadata().catch(console.error);
