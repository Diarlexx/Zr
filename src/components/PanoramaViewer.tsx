import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PanoramaViewerProps {
  image: string;
  rotation: number;
  onRotate: (dir: number) => void;
  lightsOff?: boolean;
}

export function PanoramaViewer({ image, rotation, onRotate, lightsOff }: PanoramaViewerProps) {
  return (
    <div className="absolute inset-0 z-40 bg-black overflow-hidden flex items-center justify-center">
      <div 
        className="w-full h-full perspective-[1200px]"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{ rotateY: rotation, translateZ: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 40 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-full h-full flex items-center justify-center p-0 m-0"
        >
          {/* We simplify the cube for this demo version as real 3D cubes require 6 images or splitting one */}
          {/* However, to mimic the original logic, we create 4 faces using the same panorama split by object-position */}
          
          {[0, 90, 180, 270].map((angle, i) => (
            <div
              key={angle}
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                transform: `rotateY(${angle}deg) translateZ(-49.9vw)`, // Slight overlap to avoid cracks
                backfaceVisibility: 'hidden',
                width: '100vw',
                height: '100vh'
              }}
            >
              <img
                src={image}
                className={cn(
                  "absolute w-[200%] h-[200%] object-fill transition-all duration-1000",
                  lightsOff && "brightness-[0.2] contrast-[1.2] saturate-[0.8]"
                )}
                style={{
                  left: i % 2 === 0 ? '0' : '-100%',
                  top: Math.floor(i / 2) === 0 ? '0' : '-100%',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center pl-8 pointer-events-none">
        <button
          onClick={() => onRotate(-90)}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 border-2 border-[#d4af37] text-[#d4af37] backdrop-blur-lg pointer-events-auto hover:bg-[#d4af37] hover:text-black transition-all duration-500 shadow-2xl"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
        <button
          onClick={() => onRotate(90)}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-black/60 border-2 border-[#d4af37] text-[#d4af37] backdrop-blur-lg pointer-events-auto hover:bg-[#d4af37] hover:text-black transition-all duration-500 shadow-2xl"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
