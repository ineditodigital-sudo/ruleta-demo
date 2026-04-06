import React from 'react';
import { motion } from 'motion/react';
import { CarouselItem } from '@/types';

interface LogoCarouselProps {
  items: CarouselItem[];
  backgroundColor?: string;
  speed?: number;
  grayscale?: boolean;
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({ 
  items, 
  backgroundColor = 'transparent', 
  speed = 20,
  grayscale = false
}) => {
  if (!items || items.length === 0) return null;

  // Duplicate items twice to ensure smooth infinite loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div 
      className="w-full overflow-hidden py-4 sm:py-8 lg:py-10 select-none relative"
      style={{ backgroundColor }}
    >
      {/* Premium fade effect on edges */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center gap-8 sm:gap-16 lg:gap-24"
        animate={{
          x: ["0%", "-33.333%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        style={{ width: 'max-content' }}
      >
        {displayItems.map((item, idx) => (
          <div 
            key={`${item.id}-${idx}`}
            className="flex-shrink-0 flex items-center justify-center h-full"
          >
            <img
              src={item.imageUrl}
              alt={item.altText}
              className="h-8 sm:h-12 md:h-14 w-auto object-contain transition-all hover:scale-105"
              style={{ filter: grayscale ? 'grayscale(1)' : 'none' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
