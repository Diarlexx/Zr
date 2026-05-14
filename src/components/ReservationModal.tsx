import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Calendar, Clock, DollarSign, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { RoomData } from '../types';

interface ReservationModalProps {
  room: RoomData;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReservationModal({ room, onClose, onSuccess }: ReservationModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    const displayName = auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Invitado';
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        userId: auth.currentUser.uid,
        userName: displayName,
        roomName: room.name,
        price: room.price,
        date,
        time,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Record system log
      await addDoc(collection(db, 'logs'), {
        action: 'RESERVACIÓN',
        details: `${displayName} solicitó ${room.name} para ${date} a las ${time}`,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp()
      });

      setDone(true);
      setTimeout(onSuccess, 2000);
    } catch (err) {
      console.error("Error al crear reservación:", err);
      handleFirestoreError(err, OperationType.WRITE, 'reservations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md p-8 rounded-3xl bg-[#0a0a0f] border border-[#d4af37]/30 shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {done ? (
          <div className="py-12 flex flex-col items-center gap-6 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 animate-[bounce_1s_infinite]" />
            <h3 className="text-2xl font-['Cinzel'] text-[#d4af37]">¡SOLICITUD ENVIADA!</h3>
            <p className="text-white/60 text-sm">Nuestro equipo se pondrá en contacto pronto para confirmar su estancia.</p>
          </div>
        ) : (
          <>
            <h2 className="font-['Cinzel'] text-2xl text-[#d4af37] text-center mb-2 tracking-widest uppercase">
              Reservar Estancia
            </h2>
            <p className="text-white/40 text-[10px] uppercase text-center mb-8 tracking-widest">{room.name}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Fecha de llegada</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Hora Estimada</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-[10px] uppercase tracking-widest text-white/60">Total</span>
                </div>
                <span className="text-xl font-['Cinzel'] text-[#d4af37] font-bold">{room.price}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 py-4 rounded-xl bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
