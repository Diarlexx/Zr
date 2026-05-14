import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { RoomStage } from './components/RoomStage';
import { Reception } from './components/Reception';
import { ElevatorOverlay } from './components/ElevatorOverlay';
import { Auth } from './components/Auth';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { ReservationModal } from './components/ReservationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { ROOMS } from './constants';
import { RoomType, RoomState } from './types';
import { useAudio } from './hooks/useAudio';
import { Fingerprint, ArrowBigUp } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { cn } from './lib/utils';

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<RoomType>('landing');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState('user');
  
  // UI Panels
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  // Elevator State
  const [elevator, setElevator] = useState({
    isVisible: false,
    floorName: '',
    isMoving: false,
    isOpen: false
  });

  // Security Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'granted'>('scanning');

  // Multi-room state management
  const [roomStates, setRoomStates] = useState<Record<string, RoomState>>(() => {
    const initial: Record<string, RoomState> = {};
    ROOMS.forEach(r => {
      initial[r.id] = {
        lights: true,
        tv: false,
        ac: true,
        security: true,
        temp: 22
      };
    });
    return initial;
  });

  const [is360, setIs360] = useState(false);
  const [panoramaRotation, setPanoramaRotation] = useState(0);

  const { playBg, pauseBg, playGym, stopGym, playSfx } = useAudio();

  useEffect(() => {
    let unsubscribeUser: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser?.email, "UID:", currentUser?.uid);
      setUser(currentUser);
      
      if (currentUser) {
        // Listen to user document for role changes in real-time
        unsubscribeUser = onSnapshot(doc(db, 'users', currentUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            const role = snapshot.data().role || 'user';
            console.log("Real-time role update:", role);
            setUserRole(role);
          } else {
            console.warn("User profile not found in DB");
            setUserRole('user');
          }
        }, (err) => {
          console.error("Error listening to user doc:", err);
        });
      } else {
        setUserRole('user');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      pauseBg();
    } else {
      playBg();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateTo = (id: RoomType) => {
    playSfx('click');
    if (id === 'hotel-gym') playGym();
    else if (currentRoom === 'hotel-gym') stopGym();
    
    setCurrentRoom(id);
    setIs360(false);
    setPanoramaRotation(0);
    window.scrollTo(0, 0);
  };

  const startElevator = (targetId: RoomType, name: string) => {
    playSfx('elevator');
    setElevator({ isVisible: true, floorName: 'SUBIENDO...', isMoving: false, isOpen: false });
    
    setTimeout(() => {
      setElevator(prev => ({ ...prev, isMoving: true, floorName: 'EN TRÁNSITO' }));
    }, 500);

    setTimeout(() => {
      navigateTo(targetId);
      setElevator(prev => ({ ...prev, isMoving: false, floorName: name, isOpen: true }));
    }, 3500);

    setTimeout(() => {
      setElevator(prev => ({ ...prev, isOpen: false }));
      setTimeout(() => setElevator(prev => ({ ...prev, isVisible: false })), 2000);
    }, 5500);
  };

  const handleSecurity = () => {
    playSfx('scan');
    setIsScanning(true);
    setScanStatus('scanning');
    
    setTimeout(() => {
      setScanStatus('granted');
      playSfx('success');
      setTimeout(() => {
        setIsScanning(false);
      }, 3000);
    }, 2500);
  };

  const toggleRoomFeature = (roomId: string, feature: keyof RoomState) => {
    setRoomStates(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [feature]: !prev[roomId][feature]
      }
    }));
    playSfx('click');
  };

  const activeRoomData = ROOMS.find(r => r.id === currentRoom);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[#d4af37]/30">
      <Header 
        isPlaying={isMusicPlaying} 
        onToggleMusic={toggleMusic}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        user={user}
        userRole={userRole}
        onOpenAuth={() => setShowAuth(true)}
        onOpenAdmin={() => {
          if (userRole === 'admin') setShowAdmin(true);
          else setShowAdminAuth(true);
        }}
      />

      <AnimatePresence mode="wait">
        {currentRoom === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Landing onNavigate={navigateTo} />
          </motion.div>
        )}

        {currentRoom === 'reception' && (
          <motion.div key="reception" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Reception onNavigate={navigateTo} onGoToFloor={startElevator} />
          </motion.div>
        )}

        {activeRoomData && currentRoom !== 'reception' && (
          <motion.div key={currentRoom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoomStage 
              room={activeRoomData}
              state={roomStates[currentRoom]}
              is360={is360}
              rotation={panoramaRotation}
              onNavigate={navigateTo}
              onToggle360={() => setIs360(!is360)}
              onRotate={(dir) => setPanoramaRotation(prev => prev + dir)}
              onToggleFeature={(f) => toggleRoomFeature(currentRoom, f)}
              onSecurity={handleSecurity}
              onOpenReservation={() => {
                if (!user) setShowAuth(true);
                else setShowReservation(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ElevatorOverlay {...elevator} />

      <Footer />
      <FloatingWhatsApp />

      <AnimatePresence>
        {showAuth && (
          <Auth 
            onClose={() => setShowAuth(false)} 
            onSuccess={() => {
              setShowAuth(false);
              playSfx('success');
            }} 
          />
        )}

        {showAdmin && userRole === 'admin' && (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        )}

        {showAdminAuth && (
          <AdminLogin 
            onClose={() => setShowAdminAuth(false)}
            onSuccess={() => {
              setShowAdminAuth(false);
              playSfx('success');
            }}
          />
        )}

        {showReservation && activeRoomData && (
          <ReservationModal 
            room={activeRoomData} 
            onClose={() => setShowReservation(false)}
            onSuccess={() => setShowReservation(false)}
          />
        )}

        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center font-['Orbitron']"
          >
            <div className="relative w-48 h-48 border-2 border-cyan-500/30 rounded-full flex items-center justify-center">
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.8)] z-10"
              />
              <div className={cn(
                "w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-500",
                scanStatus === 'granted' 
                  ? "bg-green-500/20 border-green-500 text-green-500 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.4)]" 
                  : "bg-cyan-500/10 border-cyan-500 text-cyan-400"
              )}>
                <Fingerprint className="w-12 h-12" />
              </div>
            </div>
            
            <div className={cn(
              "mt-12 text-xl tracking-[4px] font-bold uppercase",
              scanStatus === 'granted' ? "text-green-500" : "text-cyan-400 animate-pulse"
            )}>
              {scanStatus === 'granted' ? 'ACCESO CONCEDIDO' : 'ESCANEANDO PULSERA...'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="toast-root" />
    </div>
  );
}
