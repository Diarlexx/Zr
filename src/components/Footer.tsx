import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <footer className="w-full mt-auto py-12 px-8 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        
        {/* Social Media Banner */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-[10px] uppercase font-bold tracking-[6px] text-[#d4af37]/60">Sigue la Experiencia</p>
          <div className="flex items-center gap-8">
            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
          </div>
        </div>

        {/* Intelligence / Context Bar */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col items-center gap-6 mt-8">
          <p className="text-[8px] text-white/20 tracking-[4px] uppercase">
            © {time.getFullYear()} ZYRA SMART HOTEL. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-black tracking-[6px] text-[#d4af37] bg-[#d4af37]/5 px-6 py-2 rounded-full border border-[#d4af37]/10">
            <span className="text-[8px] text-[#d4af37]/40">HORA LOCAL:</span>
            {formatTime(time)}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8, scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="w-14 h-14 rounded-[22px] flex items-center justify-center border border-white/5 text-white/30 hover:border-[#d4af37]/50 hover:text-[#d4af37] bg-white/[0.02] hover:bg-[#d4af37]/5 transition-all duration-500 shadow-xl group"
    >
      <div className="relative">
        <div className="absolute inset-0 blur-lg bg-[#d4af37] opacity-0 group-hover:opacity-20 transition-opacity" />
        {icon}
      </div>
    </motion.a>
  );
}
