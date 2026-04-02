import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { PrizeWheel } from '@/app/components/PrizeWheel';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Participant, Prize } from '@/types';
import { Sparkles, CheckCircle, Mail, Phone, User } from 'lucide-react';

type Step = 'splash' | 'registration' | 'wheel' | 'result';

interface TotemViewProps {
  isDemoMode?: boolean;
}

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

  // Auto-transition from splash to registration
  React.useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('registration');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
      ...formData,
      prizeWon: prize,
      timestamp: new Date().toISOString(),
    };

    addParticipant(participant);
    updatePrize(prize.id, { currentWins: prize.currentWins + 1 });
    setWonPrize(prize);
    setStep('result');
  };

  const handleReset = () => {
    setTimeout(() => {
      setStep('splash');
      setFormData({ name: '', email: '', phone: '', acceptedTerms: false });
      setWonPrize(null);
      setErrors({});
    }, 5000);
  };

  React.useEffect(() => {
    if (step === 'result') {
      handleReset();
    }
  }, [step]);

  const bgGradient = `linear-gradient(135deg, ${state.brand.backgroundColor} 0%, ${state.brand.primaryColor} 100%)`;

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden relative w-full h-full"
      style={{
        minHeight: '100dvh', // Dynamic viewport height for mobile
        backgroundColor: state.brand.backgroundColor,
      }}
    >
      {/* Clean background - no animated gradients */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: state.brand.backgroundColor }} />

      <AnimatePresence mode="wait">
        {/* Splash Screen */}
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{ background: bgGradient }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center gap-6 px-4"
            >
              {state.brand.logoUrl && state.brand.logoUrl.trim() !== '' ? (
                <motion.img
                  src={state.brand.logoUrl}
                  alt="Logo"
                  className="h-24 sm:h-32 md:h-40 object-contain max-w-[90vw]"
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <motion.div
                  className="text-center px-4"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2">
                    {state.brand.companyName}
                  </h1>
                </motion.div>
              )}
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="flex flex-col items-center gap-4"
              >
                {/* Mini ruleta animada */}
                <motion.svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  {/* Segmentos de colores de la ruleta */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];
                    const angle = 45;
                    const startAngle = (i * angle - 90) * (Math.PI / 180);
                    const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
                    const radius = 40;
                    
                    const x1 = 40;
                    const y1 = 40;
                    const x2 = 40 + Math.cos(startAngle) * radius;
                    const y2 = 40 + Math.sin(startAngle) * radius;
                    const x3 = 40 + Math.cos(endAngle) * radius;
                    const y3 = 40 + Math.sin(endAngle) * radius;
                    
                    return (
                      <path
                        key={i}
                        d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} Z`}
                        fill={colors[i]}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                  {/* Borde exterior decorativo */}
                  <circle cx="40" cy="40" r="40" fill="none" stroke="white" strokeWidth="3" opacity="0.3" />
                  {/* Centro de la ruleta */}
                  <circle cx="40" cy="40" r="12" fill="white" stroke={state.brand.primaryColor} strokeWidth="3" />
                  <circle cx="40" cy="40" r="7" fill={state.brand.primaryColor} />
                </motion.svg>
                
                {/* Texto de carga */}
                <motion.p 
                  className="text-white text-lg sm:text-xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Cargando...
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {step === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full h-full flex items-center justify-center overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8"
          >
            {/* Card with better contrast */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-gray-200 w-full max-w-md sm:max-w-lg md:max-w-2xl my-auto">
              {/* Logo */}
              <div className="flex justify-center mb-4 sm:mb-6">
                {state.brand.logoUrl && state.brand.logoUrl.trim() !== '' ? (
                  <img 
                    src={state.brand.logoUrl} 
                    alt="Logo" 
                    className="h-16 sm:h-20 md:h-24 object-contain max-w-[80%]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ color: state.brand.secondaryColor }}>
                    {state.brand.companyName}
                  </h1>
                )}
              </div>

              {/* Welcome Message */}
              <div className="text-center mb-4 sm:mb-6">
                <div 
                  className="inline-flex items-center gap-2 text-base sm:text-lg md:text-xl font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full text-white shadow-lg"
                  style={{ backgroundColor: state.brand.primaryColor }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0" />
                  <span className="line-clamp-2">{state.messages.welcome}</span>
                </div>
              </div>

              {/* Form with better spacing for touch */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 block flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: state.brand.primaryColor }} />
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 sm:h-14 md:h-16 text-base sm:text-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 rounded-lg sm:rounded-xl font-medium px-3 sm:px-4 md:px-5"
                    placeholder="Tu nombre"
                  />
                  {errors.name && <p className="text-red-600 mt-1 sm:mt-2 text-sm sm:text-base font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: state.brand.primaryColor }} />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 sm:h-14 md:h-16 text-base sm:text-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 rounded-lg sm:rounded-xl font-medium px-3 sm:px-4 md:px-5"
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-600 mt-1 sm:mt-2 text-sm sm:text-base font-semibold">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: state.brand.primaryColor }} />
                    Teléfono / WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 sm:h-14 md:h-16 text-base sm:text-lg bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 rounded-lg sm:rounded-xl font-medium px-3 sm:px-4 md:px-5"
                    placeholder="+52 123 456 7890"
                  />
                  {errors.phone && <p className="text-red-600 mt-1 sm:mt-2 text-sm sm:text-base font-semibold">{errors.phone}</p>}
                </div>

                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl border-2 border-purple-200">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, acceptedTerms: checked as boolean })
                    }
                    className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border-2 border-purple-400 shrink-0"
                  />
                  <Label htmlFor="terms" className="text-gray-800 text-xs sm:text-sm md:text-base font-medium leading-relaxed cursor-pointer">
                    {state.messages.termsText}
                  </Label>
                </div>
                {errors.terms && <p className="text-red-600 text-sm sm:text-base font-semibold">{errors.terms}</p>}

                <motion.button
                  onClick={handleRegister}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-14 sm:h-16 md:h-20 text-lg sm:text-xl md:text-2xl font-bold rounded-lg sm:rounded-xl text-white shadow-2xl hover:shadow-purple-500/50 transition-all mt-2 sm:mt-4"
                  style={{ background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)` }}
                >
                  Participar y girar ruleta
                </motion.button>
              </div>

              {/* Participation Count with better contrast */}
              <div className="mt-4 sm:mt-6 text-center text-gray-600 text-sm sm:text-base font-semibold">
                🎯 {state.gameConfig.currentDailyCount} participaciones hoy
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
            {/* PrizeWheel handles all its own UI including logo, banner, arrow */}
            <PrizeWheel
              prizes={state.prizes}
              onSpinComplete={handleSpinComplete}
              spinDuration={state.gameConfig.spinDuration}
              isDemoMode={isDemoMode}
            />
          </motion.div>
        )}

        {step === 'result' && wonPrize && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-full max-w-sm sm:max-w-md text-center px-4 py-4 sm:py-6 md:py-8"
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

            {/* Result Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 border-gray-200 relative z-10">
              {/* Logo at top */}
              <div className="flex justify-center mb-4 sm:mb-6">
                {state.brand.logoUrl ? (
                  <img src={state.brand.logoUrl} alt="Logo" className="h-12 sm:h-14 md:h-16 object-contain max-w-[80%]" />
                ) : (
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ color: state.brand.secondaryColor }}>
                    {state.brand.companyName}
                  </h1>
                )}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-green-500 mx-auto mb-4 sm:mb-6" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6" style={{ color: state.brand.secondaryColor }}>
                {state.messages.congratulations}
              </h2>

              <div className="my-4 sm:my-6 md:my-8 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 sm:border-4 shadow-lg" 
                   style={{ 
                     backgroundColor: '#fef3c7',
                     borderColor: state.brand.primaryColor 
                   }}>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Has ganado:</p>
                <p
                  className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 sm:mb-3 md:mb-4"
                  style={{ color: state.brand.secondaryColor }}
                >
                  {wonPrize.name}
                </p>
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">{wonPrize.description}</p>
              </div>

              <p className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">{state.messages.prizeMessage}</p>

              <p className="text-sm sm:text-base font-semibold text-gray-600">Redirigiendo en 5 segundos...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};