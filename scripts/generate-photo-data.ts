import fs from "fs";
import path from "path";
import sharp from "sharp";

interface PhotoMetadata {
  id: string;
  filename: string;
  width: number;
  height: number;
  aspectRatio: number;
  fileSize: number;
  blurDataURL: string;
}

async function generateBlurDataURL(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .resize(10, 7, { fit: "cover" })
    .blur()
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

async function generatePhotoMetadata(): Promise<void> {
  const photosDir = path.join(process.cwd(), "public", "wedding_photos");
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
    const filePath = path.join(photosDir, filename);
    const stats = fs.statSync(filePath);

    try {
      const image = sharp(filePath);
      const { width, height } = await image.metadata();
      const blurDataURL = await generateBlurDataURL(filePath);

      metadata.push({
        id: filename.replace(/\.(jpg|JPG)$/, ""),
        filename,
        width: width || 6000,
        height: height || 4000,
        aspectRatio: (width || 6000) / (height || 4000),
        fileSize: stats.size,
        blurDataURL,
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
