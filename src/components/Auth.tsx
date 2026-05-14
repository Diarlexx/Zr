import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Lock, User, LogIn, UserPlus, LogOut, Loader2, X, Shield, Chrome } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function Auth({ onClose, onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
        
        let role = 'user';
        if (showAdminCode && adminCode.trim() === 'ZYRA_ADMIN_2026') {
          role = 'admin';
        } else if (showAdminCode && adminCode.trim() !== '') {
          throw new Error('Código administrativo incorrecto. Contacte a soporte.');
        }

        const userPath = `users/${user.uid}`;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: name || user.email?.split('@')[0] || 'Usuario',
            role: role,
            createdAt: serverTimestamp()
          });
          console.log("Perfil de Firestore creado:", user.uid);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userPath);
        }
      }
      onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('El registro por Email no está habilitado en la consola de Firebase. Por favor, habilítalo o usa Google.');
      } else {
        setError(err.message || 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Check if user exists in DB
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error con Google');
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

        <h2 className="font-['Cinzel'] text-2xl text-[#d4af37] text-center mb-8 tracking-widest uppercase">
          {isLogin ? 'Iniciar Sesión' : 'Registro'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Nombre Completo"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-colors text-white"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-colors text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#d4af37] focus:outline-none transition-colors text-white"
            />
          </div>

          {!isLogin && (
            <>
              <button
                type="button"
                onClick={() => setShowAdminCode(!showAdminCode)}
                className="text-left text-[10px] text-[#d4af37]/60 hover:text-[#d4af37] transition-colors uppercase tracking-widest pl-2"
              >
                {showAdminCode ? "- Ocultar Acceso Admin" : "+ Acceso Administrativo (Opcional)"}
              </button>
              
              <AnimatePresence>
                {showAdminCode && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative overflow-hidden"
                  >
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4af37]/40" />
                    <input
                      type="password"
                      placeholder="Código de Administrador"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/20 focus:border-[#d4af37] focus:outline-none transition-colors text-[#d4af37]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {error && <p className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center leading-relaxed">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-3 py-4 rounded-xl bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />
            )}
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative flex items-center justify-center py-4">
            <div className="w-full border-t border-white/10"></div>
            <span className="absolute px-4 bg-[#0a0a0f] text-[10px] text-white/20 uppercase tracking-[2px]">O continuar con</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white font-medium"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>
        </div>

        <div className="mt-8 text-center flex flex-col gap-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-white/40 hover:text-[#d4af37] transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Registrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
