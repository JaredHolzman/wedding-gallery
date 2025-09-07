import { WeddingGallery } from "@/components/WeddingGallery";
import { getAllPhotos } from "@/lib/photos-with-metadata";

export default async function Home() {
  const photos = await getAllPhotos();

  return <WeddingGallery photos={photos} />;
}
