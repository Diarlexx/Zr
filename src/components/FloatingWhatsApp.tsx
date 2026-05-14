import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function FloatingWhatsApp() {
  const phoneNumber = "573000000000"; // Reemplazar con número real
  const message = "Hola Zyra, me gustaría recibir información sobre las habitaciones.";
  
  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[90] cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-[10px] opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />
        <div className="relative bg-green-500 p-4 rounded-full shadow-2xl flex items-center justify-center text-white border border-white/20">
          <MessageCircle className="w-6 h-6 fill-current" />
        </div>
      </div>
    </motion.div>
  );
}
