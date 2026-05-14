import React from 'react';
import { Music, Maximize2, Minimize2, Crown, User, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

interface HeaderProps {
  isPlaying: boolean;
  onToggleMusic: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  user: any;
  userRole: string;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export function Header({ 
  isPlaying, 
  onToggleMusic, 
  isFullscreen, 
  onToggleFullscreen,
  user,
  userRole,
  onOpenAuth,
  onOpenAdmin
}: HeaderProps) {
  const [clickCount, setClickCount] = React.useState(0);
  const clickTimeout = React.useRef<NodeJS.Timeout>(null);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    
    if (newCount === 5) {
      setClickCount(0);
      onOpenAdmin(); // This now handles role logic in App.tsx
    } else {
      clickTimeout.current = setTimeout(() => setClickCount(0), 1000);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 px-8 flex justify-between items-center z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleLogoClick}
        className="flex items-center gap-3 cursor-pointer select-none group"
      >
        <Crown className="w-6 h-6 text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-transform group-active:scale-90" />
        <span className="font-['Cinzel'] text-[#d4af37] tracking-[8px] text-lg font-bold uppercase drop-shadow-lg transition-transform group-active:scale-95">
          ZYRA
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        {userRole === 'admin' ? (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/40 text-[#d4af37] text-[10px] uppercase font-bold tracking-widest hover:bg-[#d4af37]/10 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" /> Admin
          </button>
        ) : (
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/20 text-[8px] uppercase font-bold tracking-[2px] hover:border-[#d4af37]/40 hover:text-[#d4af37]/60 transition-all"
          >
            Staff
          </button>
        )}

        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Bienvenido</span>
                <span className="text-xs font-bold text-white">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={() => auth.signOut()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
            >
              <User className="w-4 h-4" /> Entrar
            </button>
          )}
        </div>

        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <button
          onClick={onToggleMusic}
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-700",
            isPlaying 
              ? "bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse" 
              : "bg-white/5 border-white/10 text-white/40 hover:border-[#d4af37]/40 hover:text-[#d4af37]/60"
          )}
        >
          <Music className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/10 text-white/40 hover:border-[#d4af37]/40 hover:text-[#d4af37]/60 bg-white/5 transition-all duration-700"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </motion.div>
    </header>
  );
}
