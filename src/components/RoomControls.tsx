import React from 'react';
import { Lightbulb, Tv, Wind, Fingerprint, Dumbbell, Waves, GlassWater, Thermometer, Volume2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { RoomState } from '../types';

interface RoomControlsProps {
  state: RoomState;
  features: string[];
  onToggle: (key: keyof RoomState) => void;
  onSecurity: () => void;
}

export function RoomControls({ state, features, onToggle, onSecurity }: RoomControlsProps) {
  const getIcon = (key: string) => {
    switch (key) {
      case 'lights': return Lightbulb;
      case 'tv': return Tv;
      case 'ac': return Wind;
      case 'security': return Fingerprint;
      case 'gym-music': return Dumbbell;
      case 'pool-temp': return Thermometer;
      case 'ambiance': return Sparkles;
      case 'sound': return Volume2;
      default: return Sparkles;
    }
  };

  const getLabel = (key: string) => {
    switch (key) {
      case 'lights': return 'Iluminación';
      case 'tv': return 'Smart TV';
      case 'ac': return 'Clima';
      case 'security': return 'Seguridad';
      case 'gym-music': return 'Workout';
      case 'pool-temp': return 'Agua';
      case 'ambiance': return 'Escena VIP';
      case 'sound': return 'Audio Hi-Fi';
      default: return key;
    }
  };

  return (
    <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[90vw] md:w-auto overflow-x-auto md:overflow-visible custom-scrollbar scroll-smooth flex gap-3 md:gap-6 px-6 md:px-10 py-4 md:py-6 rounded-[30px] md:rounded-[50px] bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,1)] z-50 no-scrollbar">
      {features.map((feature) => {
        const Icon = getIcon(feature);
        const isActive = (state as any)[feature];
        
        return (
          <button
            key={feature}
            onClick={() => feature === 'security' ? onSecurity() : onToggle(feature as keyof RoomState)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 md:gap-3.5 px-4 md:px-6 py-2 md:py-3 rounded-[20px] md:rounded-[30px] min-w-[90px] md:min-w-[120px] transition-all duration-700 group relative overflow-hidden flex-shrink-0",
              isActive ? "text-[#d4af37] bg-[#d4af37]/5" : "text-white/30 hover:text-white"
            )}
          >
            <div className={cn(
              "absolute top-0 w-6 md:w-8 h-[2px] rounded-full transition-all duration-700 mt-1 md:mt-2",
              isActive ? "bg-[#d4af37] shadow-[0_2px_10px_#d4af37]" : "bg-white/5"
            )} />
            
            <div className="flex items-center justify-center h-6 md:h-8 w-6 md:w-8 relative">
              <Icon className={cn(
                "w-full h-full transition-all duration-500 group-hover:scale-125",
                isActive ? "drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]" : "opacity-60 group-hover:opacity-100"
              )} />
            </div>
            
            <span className={cn(
              "text-[8px] md:text-[9px] font-black uppercase tracking-[2px] md:tracking-[3px] text-center whitespace-nowrap transition-colors duration-500",
              isActive ? "text-[#d4af37]" : "text-white/20 group-hover:text-white"
            )}>
              {getLabel(feature)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
