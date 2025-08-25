"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Heart, Grid, Search } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavigationProps {
  onCategoryChange?: (category: string) => void;
  onSearchToggle?: () => void;
  onDownloadAll?: () => void;
}

export function Navigation({
  onCategoryChange,
  onSearchToggle,
  onDownloadAll,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "all", name: "All Photos", icon: Grid },
    { id: "portraits", name: "Portraits", icon: Heart },
    { id: "ceremony", name: "Ceremony", icon: Heart },
    { id: "reception", name: "Reception", icon: Heart },
    { id: "details", name: "Details", icon: Heart },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Heart
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isScrolled ? "text-rose-500" : "text-white",
                  )}
                />
                <span
                  className={cn(
                    "text-xl font-serif transition-colors",
                    isScrolled ? "text-stone-800" : "text-white",
                  )}
                >
                  {SITE_CONFIG.coupleNames.combined}
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange?.(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors text-sm font-medium",
                    isScrolled
                      ? "text-stone-600 hover:bg-stone-100"
                      : "text-white/90 hover:bg-white/10",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onSearchToggle}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isScrolled
                    ? "text-stone-600 hover:bg-stone-100"
                    : "text-white hover:bg-white/10",
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onDownloadAll}
                className={cn(
                  "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  isScrolled
                    ? "bg-stone-800 text-white hover:bg-stone-700"
                    : "bg-white text-stone-800 hover:bg-stone-100",
                )}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download All</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "p-2 rounded-full transition-colors md:hidden",
                  isScrolled
                    ? "text-stone-600 hover:bg-stone-100"
                    : "text-white hover:bg-white/10",
                )}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 sm:top-20 z-30 bg-white shadow-lg md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange?.(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  {cat.name}
                </button>
              ))}

              <button
                onClick={() => {
                  onDownloadAll?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download All Photos</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
