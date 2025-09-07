'use client';

import { cn } from '@/lib/utils';

interface CategoryButtonProps {
  name: string;
  count?: number;
  isActive: boolean;
  isScrolled: boolean;
  onClick: () => void;
  className?: string;
}

export function CategoryButton({ 
  name, 
  count, 
  isActive, 
  isScrolled, 
  onClick, 
  className 
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2",
        isScrolled
          ? isActive
            ? "bg-stone-800 text-white"
            : "text-stone-600 hover:bg-stone-100"
          : isActive
          ? "bg-white text-stone-800"
          : "text-white/90 hover:bg-white/10",
        className
      )}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          isActive
            ? isScrolled
              ? "bg-white/20 text-white/90"
              : "bg-stone-800/20 text-stone-700"
            : isScrolled
            ? "bg-stone-200 text-stone-600"
            : "bg-white/20 text-white/80"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}