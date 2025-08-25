import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { getAllPhotos } from "@/lib/photos";

export default async function Home() {
  const photos = await getAllPhotos();
  console.log(photos);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <section id="gallery" className="py-20">
        <PhotoGrid photos={photos} />
      </section>
    </main>
  );
}
