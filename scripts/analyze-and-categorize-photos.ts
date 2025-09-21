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

  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log(`\n✅ Generated metadata for ${metadata.length} photos`);
  console.log(`📁 Saved to: ${outputPath}`);
}

generatePhotoMetadata().catch(console.error);
