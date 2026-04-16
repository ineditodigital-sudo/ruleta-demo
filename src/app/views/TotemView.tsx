import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { PrizeWheel } from '@/app/components/PrizeWheel';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Participant, Prize } from '@/types';
import { Sparkles, CheckCircle, Mail, Phone, User, ArrowLeft, ArrowRight, Target, Facebook, Instagram, Linkedin } from 'lucide-react';

type Step = 'splash' | 'registration' | 'menu' | 'socialMenu' | 'qrView' | 'wheel' | 'result';

interface TotemViewProps {
  isDemoMode?: boolean;
}

const MenuButton: React.FC<{ 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string; 
  color: string;
  disabled?: boolean;
  textColor?: string;
}> = ({ onClick, icon, label, color, disabled, textColor = '#ffffff' }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.02, y: -4 }}
    whileTap={disabled ? {} : { scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`
      relative w-full overflow-hidden rounded-[2rem] p-4 sm:p-6 flex items-center gap-6 
      transition-all duration-500 group
      ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
      backdrop-blur-xl border border-white/10
    `}
    style={{ 
      background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
    }}
  >
    <div 
      className="p-3 sm:p-5 rounded-2xl relative z-10 shadow-2xl transition-transform group-hover:scale-110 duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        boxShadow: `0 10px 30px -5px ${color}66`
      }}
    >
      <div className="text-white w-5 h-5 sm:w-8 sm:h-8">
        {icon}
      </div>
    </div>
    
    <div className="flex flex-col items-start gap-1">
      <span 
        className="font-black text-xs sm:text-lg uppercase tracking-tight leading-none"
        style={{ color: textColor }}
      >
        {label}
      </span>
      <span 
        className="text-[8px] sm:text-xs font-black uppercase tracking-[0.2em]"
        style={{ color: textColor + '66' }}
      >
        {disabled ? 'No disponible' : 'Click para abrir'}
      </span>
    </div>

    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: textColor }} />
    </div>
  </motion.button>
);

const SocialButton: React.FC<{ 
  onClick: () => void; 
  icon: React.ReactNode;
  label: string; 
  color: string;
  textColor?: string;
}> = ({ onClick, icon, label, color, textColor = '#ffffff' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-5 p-4 sm:p-6 rounded-3xl border-2 border-white/10 bg-white/5 hover:bg-white/10 transition-all group overflow-hidden relative w-full"
    >
      <div 
        className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-lg relative z-10"
        style={{ background: color }}
      >
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span 
        className="font-black text-base sm:text-xl tracking-wider relative z-10 uppercase"
        style={{ color: textColor }}
      >
        {label}
      </span>
      <div className="ml-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <ArrowLeft className="w-5 h-5 rotate-180 transition-all" style={{ color: textColor }} />
      </div>
    </motion.button>
  );
};

export const TotemView: React.FC<TotemViewProps> = ({ isDemoMode = false }) => {
  const { state, addParticipant, updatePrize } = useApp();
  const [step, setStep] = useState<Step>('splash');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptedTerms: false,
  });
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeQr, setActiveQr] = useState<{ title: string; image: string; from: 'menu' | 'socialMenu' } | null>(null);

  const cardBg = state.brand.cardBackgroundColor || 'rgba(0, 0, 0, 0.7)';
  const finalCardBg = cardBg.startsWith('#') ? `${cardBg}cc` : cardBg;

  // Auto-transition from splash to next step
  React.useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        if (state.gameConfig.requireRegistration) {
          setStep('registration');
        } else {
          setStep('menu');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, state.gameConfig.requireRegistration]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.acceptedTerms) newErrors.terms = 'Debes aceptar los términos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      setStep('wheel');
    }
  };

  const handleSpinComplete = (prize: Prize) => {
    const participant: Participant = {
      id: Date.now().toString(),
      name: formData.name.trim() || 'Invitado',
      email: formData.email.trim() || 'No registrado',
      phone: formData.phone.trim() || 'No registrado',
      acceptedTerms: formData.acceptedTerms,
      prizeWon: prize,
      timestamp: new Date().toISOString(),
    };

    addParticipant(participant);
    updatePrize(prize.id, { currentWins: prize.currentWins + 1 });
    setWonPrize(prize);
    setStep('result');
  };

  const handleReset = () => {
    const delay = (state.gameConfig.redirectDelay ?? 5) * 1000;
    const url = state.gameConfig.redirectUrl?.trim();
    setTimeout(() => {
      if (url) {
        window.location.href = url;
      } else {
        setStep('splash');
        setFormData({ name: '', email: '', phone: '', acceptedTerms: false });
        setWonPrize(null);
        setErrors({});
      }
    }, delay);
  };

  React.useEffect(() => {
    if (step === 'result') {
      handleReset();
    }
  }, [step]);

  return (
    <div
      className="flex flex-col items-center justify-start sm:justify-center overflow-y-auto overflow-x-hidden relative w-full h-full pb-10 sm:pb-0"
      style={{
        minHeight: '100dvh', // Dynamic viewport height for mobile
        isolation: 'isolate',
        zIndex: 0,
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: state.brand.backgroundColor }} 
        />
        {state.brand.backgroundVideoUrl && (
          <video
            src={state.brand.backgroundVideoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Splash Screen */}
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 p-6"
            style={{ backgroundColor: state.brand.backgroundColor }}
          >

            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="flex flex-col items-center gap-10 relative z-10 text-center"
            >

              {(state.brand.centerLogoUrl && state.brand.centerLogoUrl.trim() !== '') || (state.brand.logoUrl && state.brand.logoUrl.trim() !== '') ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                  className="flex flex-col items-center gap-4"
                >
                  <img
                    src={state.brand.centerLogoUrl || state.brand.logoUrl}
                    alt="Logo"
                    className="h-24 sm:h-32 md:h-40 object-contain max-w-[80vw] drop-shadow-2xl"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {state.brand.logoText && state.brand.logoText.trim() !== '' && (
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg tracking-tighter uppercase opacity-90">
                      {state.brand.logoText}
                    </h2>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="px-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-black drop-shadow-xl tracking-tighter" style={{ color: state.brand.textColor || '#ffffff' }}>
                    {state.brand.companyName}
                  </h1>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Advanced Mini Roulette Loader */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 rounded-full blur-xl opacity-40"
                    style={{ backgroundColor: state.brand.primaryColor }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative z-10"
                  >
                    {/* Decorative Ring */}
                    <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
                    
                    {/* Animated segments */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const colors = [
                        state.brand.primaryColor, 
                        '#ffffff30', 
                        state.brand.secondaryColor, 
                        '#ffffff30',
                        state.brand.primaryColor, 
                        '#ffffff30', 
                        state.brand.secondaryColor, 
                        '#ffffff30'
                      ];
                      const angle = 45;
                      const rad = (i * angle - 90) * (Math.PI / 180);
                      const endRad = ((i + 1) * angle - 90) * (Math.PI / 180);
                      
                      const x1 = 50 + Math.cos(rad) * 10;
                      const y1 = 50 + Math.sin(rad) * 10;
                      const x2 = 50 + Math.cos(rad) * 40;
                      const y2 = 50 + Math.sin(rad) * 40;
                      const x3 = 50 + Math.cos(endRad) * 40;
                      const y3 = 50 + Math.sin(endRad) * 40;
                      const x4 = 50 + Math.cos(endRad) * 10;
                      const y4 = 50 + Math.sin(endRad) * 10;
                      
                      return (
                        <path
                          key={i}
                          d={`M ${x1} ${y1} L ${x2} ${y2} A 40 40 0 0 1 ${x3} ${y3} L ${x4} ${y4} Z`}
                          fill={colors[i]}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {/* Glossy Center */}
                    <circle cx="50" cy="50" r="15" fill="white" className="drop-shadow-lg" />
                    <circle cx="50" cy="50" r="8" fill={state.brand.primaryColor} />
                  </motion.svg>
                </div>

              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Home Menu */}
        {step === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ backgroundColor: state.brand.primaryColor }}
              />
              <motion.div 
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, -90, 0]
                }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]"
                style={{ backgroundColor: state.brand.secondaryColor }}
              />
            </div>

            <div 
              className="rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-2 border-white/20 w-full max-w-3xl relative z-10 overflow-hidden backdrop-blur-[40px]"
              style={{ backgroundColor: state.brand.cardBackgroundColor || 'rgba(0, 0, 0, 0.4)' }}
            >
              <div className="flex flex-col items-center gap-10">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative p-2">
                    <div className="absolute inset-0 blur-2xl opacity-30 bg-white rounded-full" />
                    <img src={state.brand.centerLogoUrl || state.brand.logoUrl} alt="Logo" className="h-20 sm:h-28 object-contain relative z-10 drop-shadow-2xl" />
                  </div>
                  <div className="text-center">
                    <span 
                      className="font-black text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-2 block"
                      style={{ color: (state.brand.textColor || '#ffffff') + '66' }}
                    >
                      {state.messages.menuWelcome || 'Bienvenido a la Experiencia'}
                    </span>
                    <h2 
                      className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none drop-shadow-xl"
                      style={{ color: state.brand.textColor || '#ffffff' }}
                    >
                      {state.brand.companyName}
                    </h2>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                  {/* Ruleta always at the top and full width */}
                  <div className="sm:col-span-2">
                    <MenuButton 
                      onClick={() => setStep('wheel')}
                      icon={<Target />}
                      label="RULETA DE PREMIOS"
                      color={state.brand.menuWheelColor || state.brand.primaryColor}
                      textColor={state.brand.textColor}
                    />
                  </div>

                  {/* Dynamic Main Menu QRs */}
                  {state.qrs
                    .filter(qr => qr.location === 'main' && qr.active)
                    .map(qr => (
                      <MenuButton 
                        key={qr.id}
                        onClick={() => {
                          setActiveQr({ title: qr.label, image: qr.imageUrl, from: 'menu' });
                          setStep('qrView');
                        }}
                        icon={qr.type === 'recruitment' ? <User /> : <Sparkles />}
                        label={qr.label}
                        color={qr.color || (
                          qr.type === 'recruitment' ? (state.brand.menuRecruitmentColor || '#10b981') : 
                          qr.type === 'providers' ? (state.brand.menuProvidersColor || '#6366f1') : 
                          state.brand.primaryColor
                        )}
                        textColor={state.brand.textColor}
                      />
                    ))
                  }

                  {/* Social Menu always at the end */}
                  <MenuButton 
                    onClick={() => setStep('socialMenu')}
                    icon={<Sparkles />}
                    label={state.messages.menuSocialTitle || "REDES SOCIALES"}
                    color={state.brand.menuSocialColor || "#f59e0b"}
                    textColor={state.brand.textColor}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Media Menu */}
        {step === 'socialMenu' && (
          <motion.div
            key="socialMenu"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
          >
            <div 
              className="rounded-[2.5rem] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-2 border-white/20 w-full max-w-2xl relative z-10 backdrop-blur-3xl"
              style={{ backgroundColor: state.brand.cardBackgroundColor || 'rgba(0, 0, 0, 0.4)' }}
            >
              
              <div className="flex flex-col items-center gap-6">
                <header className="text-center">
                  <span 
                    className="font-black text-[10px] tracking-[0.4em] uppercase mb-1 block"
                    style={{ color: (state.brand.textColor || '#ffffff') + '66' }}
                  >
                    {state.messages.menuSocialTagline || 'Conéctate con nosotros'}
                  </span>
                  <h2 
                    className="text-2xl sm:text-4xl font-black uppercase tracking-tighter"
                    style={{ color: state.brand.textColor || '#ffffff' }}
                  >
                    {state.messages.menuSocialTitle || 'REDES SOCIALES'}
                  </h2>
                </header>
                
                <div 
                  className={`
                    grid gap-x-4 gap-y-6 w-full overflow-y-auto pr-2 custom-scrollbar
                    ${state.qrs.filter(q => q.location === 'social' && q.active).length > 2 
                      ? 'grid-cols-2 sm:grid-cols-2' 
                      : 'grid-cols-1 sm:grid-cols-2'}
                  `}
                  style={{ maxHeight: '50vh' }}
                >
                  {state.qrs.filter(q => q.location === 'social' && q.active).map(qr => (
                    <div key={qr.id} className="flex flex-col items-center gap-3">
                      <span 
                        className="font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs text-center px-1"
                        style={{ color: state.brand.textColor || '#ffffff' }}
                      >
                        {qr.label}
                      </span>
                      <div 
                        onClick={() => {
                          setActiveQr({ title: qr.label, image: qr.imageUrl, from: 'socialMenu' });
                          setStep('qrView');
                        }}
                        className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-black/5 transform transition-transform hover:scale-105 duration-300 cursor-pointer"
                      >
                        <img 
                          src={qr.imageUrl} 
                          alt={`${qr.label} QR`} 
                          className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] object-contain" 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('menu')} 
                  className="mt-6 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest px-12 py-5 rounded-[1.5rem] shadow-xl text-white w-full transition-all shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor || state.brand.primaryColor} 100%)`,
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver al Menú
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QR Viewer */}
        {step === 'qrView' && activeQr && (
          <motion.div
            key="qrView"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full flex flex-col items-center justify-center p-6 relative z-[100] bg-black/90 backdrop-blur-xl"
          >


            <div className="flex flex-col items-center gap-8 max-w-lg w-full">
              <h2 className="text-4xl sm:text-6xl font-black text-white text-center uppercase tracking-tighter drop-shadow-2xl">
                {activeQr.label || activeQr.title}
              </h2>
              
              <div className="bg-white p-8 rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.2)] relative group">
                <img 
                  src={activeQr.image} 
                  alt={activeQr.title} 
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x400/white/black?text=QR+" + activeQr.title;
                  }}
                />
              </div>
              
              <p className="text-white/60 text-lg font-bold text-center animate-pulse">
                Escanea el código con tu celular
              </p>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(activeQr.from)} 
                className="mt-8 flex items-center justify-center gap-3 font-black text-lg uppercase tracking-widest px-12 py-5 rounded-[2rem] shadow-2xl text-white w-full max-w-[320px] transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor || state.brand.primaryColor} 100%)`,
                }}
              >
                <ArrowLeft className="w-6 h-6" />
                Regresar
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex items-center justify-center overflow-y-auto px-4 sm:px-6 md:px-8 py-8"
          >
            {/* Premium Registration Card - Optimized Desktop Sizes */}
            <div 
              className="rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-8 lg:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.7)] border-2 border-white/10 w-full max-w-xl sm:max-w-2xl md:max-w-lg relative z-10 overflow-hidden my-auto"
              style={{
                background: finalCardBg,
                backdropFilter: 'blur(24px)'
              }}
            >
              {/* Corner Glows - Responsive sizes */}
              <div className="absolute -top-24 -right-24 w-48 md:w-64 h-48 md:h-64 rounded-full blur-[80px] opacity-30 animate-pulse" style={{ backgroundColor: state.brand.primaryColor }} />
              <div className="absolute -bottom-24 -left-24 w-48 md:w-64 h-48 md:h-64 rounded-full blur-[80px] opacity-30 animate-pulse" style={{ backgroundColor: state.brand.secondaryColor }} />

              <div className="flex justify-center mb-6 md:mb-8 relative z-10">
                {(state.brand.centerLogoUrl && state.brand.centerLogoUrl.trim() !== '') || (state.brand.logoUrl && state.brand.logoUrl.trim() !== '') ? (
                  <div className="flex flex-col items-center gap-2">
                    <img 
                      src={state.brand.centerLogoUrl || state.brand.logoUrl} 
                      alt="Logo" 
                      className="h-16 sm:h-20 md:h-14 lg:h-16 object-contain max-w-[80%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {state.brand.logoText && state.brand.logoText.trim() !== '' && (
                      <span className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] opacity-60">
                        {state.brand.logoText}
                      </span>
                    )}
                  </div>
                ) : (
                  <h1 className="text-2xl sm:text-4xl md:text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tighter">
                    {state.brand.companyName}
                  </h1>
                )}
              </div>

              {/* Welcome Badge - More compact on desktop */}
              <div className="text-center mb-6 md:mb-8 relative z-10">
                <div 
                  className="inline-flex items-center gap-3 text-lg sm:text-xl md:text-base lg:text-lg font-black px-6 sm:px-8 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-xl sm:rounded-2xl text-white shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/20"
                  style={{ 
                    background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)`,
                  }}
                >
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-5 shrink-0 animate-bounce" />
                  <span className="uppercase tracking-tight drop-shadow-md">{state.messages.welcome}</span>
                </div>
              </div>

              {/* Premium Form Fields - Responsive Heights */}
              <div className="space-y-4 sm:space-y-8 md:space-y-4 lg:space-y-6 relative z-10">
                <div className="relative group">
                  <Label htmlFor="name" className="text-base sm:text-lg md:text-sm lg:text-base font-black mb-1 sm:mb-2 block flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ color: state.brand.textColor || '#ffffff' }}>
                    <User className="w-5 h-5 shrink-0" style={{ color: state.brand.textColor || '#ffffff' }} />
                    NOMBRE COMPLETO
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 sm:h-16 md:h-12 lg:h-14 text-base sm:text-xl md:text-base bg-white/10 border-2 border-white/10 placeholder:text-white/30 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/5 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-6 transition-all duration-300"
                    style={{ color: state.brand.textColor || '#ffffff' }}
                    placeholder="Escribe tu nombre..."
                  />
                  {errors.name && <p className="text-red-400 mt-1 md:mt-2 text-xs sm:text-base font-black uppercase tracking-wider drop-shadow-sm">{errors.name}</p>}
                </div>

                <div className="relative group">
                  <Label htmlFor="email" className="text-base sm:text-lg md:text-sm lg:text-base font-black mb-1 sm:mb-2 block flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ color: state.brand.textColor || '#ffffff' }}>
                    <Mail className="w-5 h-5 shrink-0" style={{ color: state.brand.textColor || '#ffffff' }} />
                    CORREO ELECTRÓNICO
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 sm:h-16 md:h-12 lg:h-14 text-base sm:text-xl md:text-base bg-white/10 border-2 border-white/10 placeholder:text-white/30 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/5 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-6 transition-all duration-300"
                    style={{ color: state.brand.textColor || '#ffffff' }}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.email && <p className="text-red-400 mt-1 md:mt-2 text-xs sm:text-base font-black uppercase tracking-wider drop-shadow-sm">{errors.email}</p>}
                </div>

                <div className="relative group">
                  <Label htmlFor="phone" className="text-base sm:text-lg md:text-sm lg:text-base font-black mb-1 sm:mb-2 block flex items-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ color: state.brand.textColor || '#ffffff' }}>
                    <Phone className="w-5 h-5 shrink-0" style={{ color: state.brand.textColor || '#ffffff' }} />
                    TELÉFONO / WHATSAPP
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-14 sm:h-16 md:h-12 lg:h-14 text-base sm:text-xl md:text-base bg-white/10 border-2 border-white/10 placeholder:text-white/30 focus:border-white focus:bg-white/15 focus:ring-4 focus:ring-white/5 rounded-xl sm:rounded-2xl font-bold px-4 sm:px-6 transition-all duration-300"
                    style={{ color: state.brand.textColor || '#ffffff' }}
                    placeholder="+52 000 000 0000"
                  />
                  {errors.phone && <p className="text-red-400 mt-1 md:mt-2 text-xs sm:text-base font-black uppercase tracking-wider drop-shadow-sm">{errors.phone}</p>}
                </div>

                <div className="flex items-center gap-4 p-4 sm:p-6 md:p-3 lg:p-4 bg-white/10 rounded-xl sm:rounded-2xl border-2 border-white/5 group-hover:border-white/15 transition-all cursor-pointer">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, acceptedTerms: checked })
                    }
                    className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white/40 shrink-0 bg-transparent data-[state=checked]:bg-white data-[state=checked]:text-black rounded-lg transition-all"
                  />
                  <Label htmlFor="terms" className="text-white text-xs sm:text-base font-bold leading-tight cursor-pointer select-none drop-shadow-md">
                    {state.messages.termsText}
                  </Label>
                </div>
                {errors.terms && <p className="text-red-400 text-xs sm:text-base font-black uppercase tracking-wider drop-shadow-sm">{errors.terms}</p>}

                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 sm:h-20 md:h-14 lg:h-16 rounded-2xl sm:rounded-3xl text-white shadow-[0_15px_30px_rgba(0,0,0,0.5)] font-black text-lg sm:text-2xl md:text-base lg:text-lg tracking-tighter uppercase transition-all overflow-hidden relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    PARTICIPAR Y GIRAR RULETA
                    <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 rotate-180" />
                  </div>
                </motion.button>

                {/* Counter Badge */}
                <div className="flex justify-center pt-2 md:pt-1">
                  <div className="flex items-center gap-2 px-6 py-2 md:py-1 rounded-full bg-black/30 border border-white/10 text-white/50 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">
                    <Target className="w-4 h-4 text-white/40" />
                    {state.gameConfig.currentDailyCount} participaciones hoy
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'wheel' && (
          <motion.div
            key="wheel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center w-full h-full relative"
          >
            <PrizeWheel
              prizes={state.prizes}
              onSpinComplete={handleSpinComplete}
              spinDuration={state.gameConfig.spinDuration}
              isDemoMode={isDemoMode}
              onBack={() => setStep('menu')}
            />
          </motion.div>
        )}

        {step === 'result' && wonPrize && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-sm sm:max-w-md text-center px-4 py-4 sm:py-6 md:py-8 my-auto"
          >
            {/* Confetti Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 pointer-events-none z-0"
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1080),
                    y: -20,
                    rotate: 0,
                  }}
                  animate={{
                    y: (typeof window !== 'undefined' ? window.innerHeight : 1920) + 20,
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: 'linear',
                    delay: Math.random() * 0.5,
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
            </motion.div>

            {/* Result Card - Optimized Desktop Sizes */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-8 lg:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] border-2 border-white/20 relative z-20 overflow-hidden mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg"
              style={{
                background: finalCardBg,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Card Glow - Responsive */}
              <div className="absolute -top-32 -left-32 w-48 md:w-64 h-48 md:h-64 rounded-full blur-[80px] opacity-40 animate-pulse" style={{ backgroundColor: state.brand.primaryColor }} />
              <div className="absolute -bottom-32 -right-32 w-48 md:w-64 h-48 md:h-64 rounded-full blur-[80px] opacity-40 animate-pulse" style={{ backgroundColor: state.brand.secondaryColor }} />

              {/* Logo at top */}
              <div className="flex justify-center mb-6 relative z-10">
                {(state.brand.centerLogoUrl && state.brand.centerLogoUrl.trim() !== '') || (state.brand.logoUrl && state.brand.logoUrl.trim() !== '') ? (
                  <div className="flex flex-col items-center gap-2">
                    <img 
                      src={state.brand.centerLogoUrl || state.brand.logoUrl} 
                      alt="Logo" 
                      className="h-12 sm:h-16 md:h-14 lg:h-16 object-contain max-w-[80%] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {state.brand.logoText && state.brand.logoText.trim() !== '' && (
                      <span className="text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-60">
                        {state.brand.logoText}
                      </span>
                    )}
                  </div>
                ) : (
                  <h1 className="text-xl sm:text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {state.brand.companyName}
                  </h1>
                )}
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.7 }}
                className="relative z-10"
              >
                <CheckCircle className="w-16 h-16 sm:w-24 md:w-20 lg:w-24 text-green-400 mx-auto mb-4 md:mb-6 drop-shadow-[0_0_20px_rgba(74,222,128,0.7)]" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 relative z-10 uppercase tracking-tighter" style={{ color: state.brand.textColor || '#ffffff' }}>
                ¡{state.messages.congratulations}!
              </h2>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="my-4 sm:my-10 md:my-6 lg:my-10 p-5 sm:p-10 md:p-6 lg:p-8 rounded-3xl border shadow-2xl relative z-10 overflow-hidden" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}>
                {/* Winner Badge Overlay */}
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <Sparkles className="w-16 md:w-24 h-16 md:h-24 text-white" />
                </div>

                <p className="text-xs sm:text-base font-bold mb-3 md:mb-4 uppercase tracking-[0.3em] opacity-50" style={{ color: state.brand.textColor || '#ffffff' }}>Premio Obtenido:</p>
                <div className="flex flex-col items-center justify-center min-h-[4rem] sm:min-h-0">
                  <p
                    className="text-2xl sm:text-5xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 leading-tight w-full break-words px-2 text-center"
                    style={{ color: state.brand.textColor || '#ffffff' }}
                  >
                    {wonPrize.name}
                  </p>
                </div>
                <div className="h-1.5 w-16 md:w-24 mx-auto mb-4 md:mb-6 rounded-full" style={{ backgroundColor: state.brand.primaryColor }} />
                <p className="text-base sm:text-xl md:text-lg lg:text-xl font-medium leading-relaxed text-center max-w-[90%] mx-auto opacity-90" style={{ color: state.brand.textColor || '#ffffff' }}>{wonPrize.description}</p>
              </motion.div>

              <p className="text-base sm:text-2xl md:text-lg lg:text-xl font-bold mb-6 md:mb-8 relative z-10" style={{ color: state.brand.textColor || '#ffffff' }}>{state.messages.prizeMessage}</p>

              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: state.brand.primaryColor }}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase opacity-50" style={{ color: state.brand.textColor || '#ffffff' }}>Redirigiendo automáticamente</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};