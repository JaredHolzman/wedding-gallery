"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, MapPin, Camera, ChevronDown } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 to-white">
      <div className="absolute inset-0 bg-[url('/wedding_photos/L&V-16.jpg')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Heart className="w-12 h-12 mx-auto mb-6 text-rose-400" />

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-stone-800 mb-4">
            {SITE_CONFIG.coupleNames.combined}
          </h1>

          <p className="text-xl sm:text-2xl text-stone-600 mb-8 font-light">
            Our Wedding Gallery
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-stone-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{SITE_CONFIG.weddingDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{SITE_CONFIG.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span>200 Photos</span>
            </div>
          </div>

          <motion.button
            onClick={scrollToGallery}
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Gallery
            <ChevronDown className="w-5 h-5" />
          </motion.button>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 mx-auto my-8 text-stone-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
