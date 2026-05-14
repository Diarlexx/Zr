import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Shield, Lock, Mail, User, Loader2, X, ChevronRight, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (adminCode.trim() !== 'ZYRA_ADMIN_2026') {
      setError('CÓDIGO DE AUTORIZACIÓN INVÁLIDO');
      setLoading(false);
      return;
    }

    try {
      // Transformar simple a email si es necesario
      const finalEmail = username.includes('@') ? username : `${username}@zyra.com`;
      // Firebase requiere mínimo 6 caracteres para la contraseña
      const finalPassword = password.length < 6 ? password.padEnd(6, '0') : password;

      // Si el usuario ya está logueado con Google, solo verificamos el código para subir de rango
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const now = serverTimestamp();
        
        if (userDoc.exists()) {
          // Si ya existe, solo enviamos lo que el reglamento permite cambiar
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            role: 'admin',
            updatedAt: now
          }, { merge: true });
        } else {
          // Si es un perfil nuevo, enviamos todo el esquema requerido por isValidUser
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Admin Google',
            role: 'admin',
            createdAt: now
          });
        }
        onSuccess();
        return;
      }

      // De lo contrario, intentamos el login tradicional
      try {
        await signInWithEmailAndPassword(auth, finalEmail, finalPassword);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          // Intentamos crear si no existe
          const { user } = await createUserWithEmailAndPassword(auth, finalEmail, finalPassword);
          await updateProfile(user, { displayName: 'Staff Zyra' });
          
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: 'Staff Zyra',
            role: 'admin',
            createdAt: serverTimestamp()
          });
        } else {
          throw err;
        }
      }
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('EL MÉTODO "EMAIL/PASSWORD" ESTÁ DESACTIVADO. 1. Entra a Firebase Console > Auth > Sign-in method. 2. Activa Email/Password. Ó 3. Entra como usuario normal con Google y luego usa este panel.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(err.message || 'Error de autenticación');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg p-10 rounded-[40px] bg-[#050505] border-2 border-[#d4af37]/20 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/20 hover:text-[#d4af37] transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center mb-6 border border-[#d4af37]/30">
            <Shield className="w-10 h-10 text-[#d4af37]" />
          </div>
          <h2 className="font-['Cinzel'] text-3xl text-[#d4af37] tracking-[10px] uppercase text-center">
            Staff Login
          </h2>
          <p className="text-[10px] uppercase tracking-[4px] text-white/40 mt-2 font-bold">
            {auth.currentUser ? `VINCULANDO CUENTA: ${auth.currentUser.email}` : 'Acceso Restringido para Personal'}
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} className="flex flex-col gap-6">
          {!auth.currentUser && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/40" />
                <input
                  type="text"
                  placeholder="NOMBRE DE USUARIO"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-all text-white font-mono text-sm tracking-wider"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/40" />
                <input
                  type="password"
                  placeholder="CONTRASEÑA"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-all text-white font-mono text-sm tracking-wider"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/40" />
            <input
              type="password"
              placeholder="CÓDIGO MAESTRO DE SEGURIDAD"
              required
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-red-500/5 border border-red-500/20 focus:border-red-500 focus:outline-none transition-all text-red-500 font-mono text-sm tracking-wider placeholder:text-red-900/40"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-3 py-6 rounded-2xl bg-[#d4af37] text-black font-black uppercase tracking-[4px] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>VERIFICAR CREDENCIALES</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] text-white/20 uppercase tracking-[2px] leading-relaxed">
            Cualquier intento de acceso no autorizado<br />quedará registrado en los servidores de ZYRA.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
