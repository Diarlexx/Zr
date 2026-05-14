import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Calendar, Clock, DollarSign, User, MapPin, 
  CheckCircle, XCircle, ChevronLeft, ScrollText, 
  Hotel, Activity, Trash2 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Reservation {
  id: string;
  userId: string;
  userName?: string;
  roomName: string;
  price: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

interface Log {
  id: string;
  action: string;
  details: string;
  userId: string;
  userEmail: string;
  createdAt: any;
}

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reservations' | 'logs'>('reservations');

  useEffect(() => {
    const qRes = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const qLogs = query(collection(db, 'logs'), orderBy('createdAt', 'desc'));

    const unsubRes = onSnapshot(qRes, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setReservations(data);
      setLoading(false);
    });

    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
      setLogs(data);
    });

    return () => {
      unsubRes();
      unsubLogs();
    };
  }, []);

  const recordLog = async (action: string, details: string) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'logs'), {
        action,
        details,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error creating log:", err);
    }
  };

  const updateStatus = async (res: Reservation, status: 'confirmed' | 'cancelled') => {
    const resPath = `reservations/${res.id}`;
    try {
      await updateDoc(doc(db, 'reservations', res.id), { status });
      await recordLog(
        'ACTUALIZACIÓN', 
        `Reservación ${res.id} (${res.roomName}) cambiada a ${status.toUpperCase()} para ${res.userName}`
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, resPath);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020205] flex flex-col pt-24 px-4 md:px-8 pb-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-4">
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors uppercase tracking-[3px] font-black text-[10px]"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> REGRESAR AL RECEPTOR
            </button>
            <h1 className="font-['Cinzel'] text-4xl text-[#d4af37] tracking-[10px]">OPERACIONES</h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('reservations')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest",
                activeTab === 'reservations' ? "bg-[#d4af37] text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              <Hotel className="w-4 h-4" /> Reservas ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest",
                activeTab === 'logs' ? "bg-[#d4af37] text-black shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              <Activity className="w-4 h-4" /> Bitácora ({logs.length})
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
              <p className="text-[10px] text-[#d4af37] uppercase tracking-[4px]">Sincronizando con Servidores...</p>
            </div>
          ) : activeTab === 'reservations' ? (
            reservations.length === 0 ? (
              <div className="text-center py-20 text-white/20 uppercase tracking-[4px] text-xs">Sin registros históricos</div>
            ) : (
              reservations.map((res) => (
                <motion.div
                  layout
                  key={res.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-white/2 border border-white/5 hover:border-[#d4af37]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 flex-1">
                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-[#d4af37]/60 font-bold">Huésped</p>
                      <p className="font-bold text-sm text-white flex items-center gap-2">
                        <User className="w-3 h-3 text-[#d4af37]" /> {res.userName || 'Usuario'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/20">Alojamiento</p>
                      <p className="font-bold text-sm text-white/80">{res.roomName}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/20">Cronograma</p>
                      <p className="font-bold text-sm text-[#d4af37]">
                        {new Date(res.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} — {res.time}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/20">Tarifa</p>
                      <p className="font-bold text-sm text-white">{res.price}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[9px] uppercase tracking-widest text-white/20">Estado Actual</p>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 font-bold text-[10px] uppercase",
                        res.status === 'confirmed' ? "text-green-500" : res.status === 'cancelled' ? "text-red-500" : "text-yellow-500"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", 
                          res.status === 'confirmed' ? "bg-green-500" : res.status === 'cancelled' ? "bg-red-500" : "bg-yellow-500"
                        )} />
                        {res.status === 'pending' ? 'Pendiente' : res.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Corrección */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateStatus(res, 'confirmed')}
                      disabled={res.status === 'confirmed'}
                      className={cn(
                        "flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2",
                        res.status === 'confirmed' ? "bg-green-500/10 text-green-500/40 cursor-not-allowed" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black"
                      )}
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmar
                    </button>
                    <button 
                      onClick={() => updateStatus(res, 'cancelled')}
                      disabled={res.status === 'cancelled'}
                      className={cn(
                        "flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2",
                        res.status === 'cancelled' ? "bg-red-500/10 text-red-500/40 cursor-not-allowed" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black"
                      )}
                    >
                      <XCircle className="w-4 h-4" /> Cancelar
                    </button>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            logs.length === 0 ? (
              <div className="text-center py-20 text-white/20 uppercase tracking-[4px] text-xs">Bitácora vacía</div>
            ) : (
              <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/40 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-bold">Evento</th>
                      <th className="px-6 py-4 font-bold">Detalles</th>
                      <th className="px-6 py-4 font-bold">Autor</th>
                      <th className="px-6 py-4 font-bold text-right">Fecha/Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className="bg-[#d4af37]/10 text-[#d4af37] px-2 py-1 rounded text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/80 italic">"{log.details}"</td>
                        <td className="px-6 py-4 text-white/60">{log.userEmail}</td>
                        <td className="px-6 py-4 text-right text-white/40 font-mono">
                          {log.createdAt?.toDate().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
          <p className="text-[9px] text-white/20 uppercase tracking-[2px]">Administración Ejecutiva v2.0</p>
          <p className="text-[9px] text-[#d4af37]/40 uppercase tracking-[2px]">Conexión Encriptada Activa</p>
        </div>
      </div>
    </div>
  );
}
