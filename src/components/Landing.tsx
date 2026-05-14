import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConciergeBell, Bed, Users, Crown, Dumbbell, Waves, GlassWater } from 'lucide-react';
import { HOTEL_ANGLES, ROOMS } from '../constants';
import { RoomType } from '../types';
import { cn } from '../lib/utils';

interface LandingProps {
  onNavigate: (id: RoomType) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAngle((prev) => (prev + 1) % HOTEL_ANGLES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'reception', label: 'Recepción', icon: ConciergeBell },
    { id: 'room-simple', label: 'Habitación Simple', icon: Bed },
    { id: 'room-double', label: 'Habitación Doble', icon: Users },
    { id: 'room-suite', label: 'Suite Real', icon: Crown },
    { id: 'hotel-gym', label: 'Gym & Wellness', icon: Dumbbell },
    { id: 'hotel-pool', label: 'Piscina Infinity', icon: Waves },
    { id: 'salon', label: 'Salón VIP', icon: GlassWater },
  ];

  return (
    <div className="relative min-h-screen pt-20 flex flex-col items-center bg-[#0a0a0f] overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-20-50 from-[#00f2ff]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-at-80-80 from-[#d4af37]/5 via-transparent to-transparent pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-6 py-16 z-10"
      >
        <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#d4af37]/40 bg-black/50 shadow-[0_0_50px_rgba(212,175,55,0.3)] backdrop-blur-md">
          <div className="absolute inset-0 bg-[#d4af37] blur-[40px] opacity-20 rounded-full animate-pulse" />
          <div className="absolute inset-2 border border-[#d4af37]/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
          <Crown className="w-10 h-10 md:w-14 md:h-14 text-[#d4af37] relative z-10 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-['Cinzel'] text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#ffeba0] to-[#d4af37] tracking-[20px] md:tracking-[30px] ml-[20px] md:ml-[30px] text-5xl md:text-7xl font-light text-center drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            ZYRA
          </h1>
          <p className="font-['Cinzel'] text-[#d4af37]/60 tracking-[12px] md:tracking-[16px] ml-[12px] md:ml-[16px] text-sm md:text-lg uppercase">
            Smart Hotel
          </p>
        </div>
      </motion.div>

      <div className="relative w-full h-[65vh] overflow-hidden bg-black z-0 border-y border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentAngle}
            src={HOTEL_ANGLES[currentAngle]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover brightness-95 contrast-[1.05]"
          />
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20 px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-[#d4af37]/30">
          {HOTEL_ANGLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentAngle(i)}
              className={cn(
                "h-1.5 transition-all duration-700",
                currentAngle === i 
                  ? "w-12 bg-[#d4af37] shadow-[0_0_15px_#d4af37]" 
                  : "w-2 bg-white/10 hover:bg-white/30"
              )}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 md:px-8 mt-16 mb-24 z-10">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
              onClick={() => onNavigate(item.id as RoomType)}
              className="group flex flex-col items-center justify-center gap-4 md:gap-7 p-6 md:p-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 hover:-translate-y-4 transition-all duration-700 w-[140px] md:w-[190px] min-h-[160px] md:min-h-[200px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/0 to-transparent group-hover:via-[#d4af37]/50 transition-all duration-700" />
              
              <div className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center bg-white/5 rounded-[24px] md:rounded-[30px] group-hover:bg-[#d4af37]/20 transition-all duration-500 group-hover:rotate-6 shadow-inner">
                <item.icon className="w-6 h-6 md:w-9 md:h-9 text-[#d4af37] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
              </div>
              
              <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[3px] md:tracking-[4px] text-white/40 group-hover:text-[#d4af37] text-center leading-relaxed transition-colors duration-500">
                {item.label}
              </span>
              
              <div className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
