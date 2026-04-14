import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Prize } from '@/types';
import { useApp } from '@/context/AppContext';
import { ChevronDown, Monitor } from 'lucide-react';
import { LogoCarousel } from './LogoCarousel';

interface PrizeWheelProps {
  prizes: Prize[];
  onSpinComplete: (prize: Prize) => void;
  spinDuration?: number;
  disabled?: boolean;
  isDemoMode?: boolean;
}

export const PrizeWheel: React.FC<PrizeWheelProps> = ({
  prizes,
  onSpinComplete,
  spinDuration = 5000,
  disabled = false,
  isDemoMode = false,
}) => {
  const { state } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const activePrizes = prizes.filter((p) => p.active && p.currentWins < p.maxWins);

  const spinWheel = () => {
    if (isSpinning || disabled || activePrizes.length === 0) return;

    setIsSpinning(true);

    // Calculate weighted random selection
    const totalProbability = activePrizes.reduce((sum, p) => sum + p.probability, 0);
    const random = Math.random() * totalProbability;
    let sum = 0;
    let selectedPrize = activePrizes[0];

    for (const prize of activePrizes) {
      sum += prize.probability;
      if (random <= sum) {
        selectedPrize = prize;
        break;
      }
    }

    // Calculate rotation to land EXACTLY on the middle of the selected prize
    const prizeIndex = activePrizes.findIndex((p) => p.id === selectedPrize.id);
    const segmentAngle = 360 / activePrizes.length;
    
    // The middle of the segment
    const targetAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2);
    
    // We want to land at: currentFullTurns + EXTRA_STOPS + (360 - targetAngle)
    const currentRotationMod = rotation % 360;
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360; // 5 to 8 full spins
    
    // Add a small random offset within the segment to make it look natural (not perfectly centered every time)
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);
    
    const finalRotation = extraSpins + (360 - targetAngle) - currentRotationMod + randomOffset;

    setRotation(rotation + finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedPrize);
    }, spinDuration);
  };

  const segmentAngle = 360 / activePrizes.length;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-6 py-2 md:px-10 overflow-hidden">
      {/* Main container with all visual elements */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl gap-2 sm:gap-1 md:gap-2">
        
        {/* Logo at top - always show */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center w-full"
        >
          {state.brand.logoUrl && state.brand.logoUrl.trim() !== '' ? (
            <img
              src={state.brand.logoUrl}
              alt="Logo"
              className="h-14 sm:h-10 md:h-12 object-contain max-w-[80vw]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <h1 
              className="text-2xl sm:text-3xl md:text-3xl font-black text-center"
              style={{ color: state.brand.primaryColor }}
            >
              {state.brand.companyName || 'RULETA DE PREMIOS'}
            </h1>
          )}
        </motion.div>

        {/* "Gira la ruleta" Banner - always show */}
        <motion.div
          initial={{ scale: 0, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
          className="w-full flex justify-center"
        >
          <div
            className="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)`,
            }}
          >
            {/* Shine effect */}
            <motion.div
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 2,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white relative z-10 drop-shadow-lg whitespace-nowrap">
              🎰 ¡GIRA LA RULETA! 🎰
            </h2>
          </div>
        </motion.div>

        {/* Arrow pointing to winning prize - always show */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center -mb-2 z-30"
        >
          <motion.div
            animate={isSpinning ? {
              y: [0, 8, 0],
            } : {
              y: [0, 5, 0],
            }}
            transition={{
              duration: isSpinning ? 0.3 : 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center md:scale-90 lg:scale-100"
          >
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
              style={{
                background: `linear-gradient(135deg, ${state.brand.primaryColor}, ${state.brand.secondaryColor})`,
              }}
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={4} />
            </div>
            <div
              className="w-0 h-0 -mt-1"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `16px solid ${state.brand.primaryColor}`,
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Wheel Container */}
        <div className="relative flex items-center justify-center w-full">
          {/* LED Outer Ring */}
          <div 
            className="absolute rounded-full z-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-all duration-700"
            style={{
              width: 'min(92vw, 68vh, 520px)',
              height: 'min(92vw, 68vh, 520px)',
              background: `radial-gradient(circle, ${state.brand.primaryColor}30 0%, ${state.brand.wheelBorderColor || '#000000'} 100%)`,
              boxShadow: `0 0 40px ${state.brand.primaryColor}40`,
              border: `4px solid ${state.brand.wheelBorderColor || '#000000'}50`
            }}
          >
            {/* LED Lights */}
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse-light"
                style={{
                  top: '50%',
                  left: '50%',
                  backgroundColor: i % 2 === 0 ? state.brand.primaryColor : state.brand.secondaryColor,
                  color: i % 2 === 0 ? state.brand.primaryColor : state.brand.secondaryColor,
                  transform: `rotate(${i * 15}deg) translateY(-min(45vw, 33vh, 252px))`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          <motion.div
            ref={wheelRef}
            animate={{ rotate: rotation }}
            transition={{
              duration: spinDuration / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative rounded-full z-10"
            style={{
              width: 'min(85vw, 60vh, 420px)',
              height: 'min(85vw, 60vh, 420px)',
              boxShadow: '0 20px 80px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Prize segments */}
            <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 200 200">
              <defs>
                <radialGradient id="glassGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="glossEffect" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="white" stopOpacity="0" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {activePrizes.map((prize, index) => {
                const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                const radius = 100;
                const innerRadius = 0;

                const x1 = 100 + Math.cos(startAngle) * innerRadius;
                const y1 = 100 + Math.sin(startAngle) * innerRadius;
                const x2 = 100 + Math.cos(startAngle) * radius;
                const y2 = 100 + Math.sin(startAngle) * radius;
                const x3 = 100 + Math.cos(endAngle) * radius;
                const y3 = 100 + Math.sin(endAngle) * radius;
                const x4 = 100 + Math.cos(endAngle) * innerRadius;
                const y4 = 100 + Math.sin(endAngle) * innerRadius;

                const largeArc = segmentAngle > 180 ? 1 : 0;
                const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`;

                const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
                const textRadius = radius * 0.68;
                const textX = 100 + Math.cos(textAngle) * textRadius;
                const textY = 100 + Math.sin(textAngle) * textRadius;
                const textRotation = index * segmentAngle + segmentAngle / 2;

                return (
                  <g key={prize.id}>
                    <path
                      d={pathData}
                      fill={prize.color}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="0.5"
                    />
                    {/* Inner highlight for segment */}
                    <path
                      d={pathData}
                      fill="url(#glassGradient)"
                      className="pointer-events-none"
                    />
                    
                    {state.gameConfig.showPrizes && (
                      <text
                        x={textX}
                        y={textY}
                        fill={prize.textColor || "#ffffff"}
                        fontSize={activePrizes.length > 8 ? "6.5" : "8"}
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation} ${textX} ${textY})`}
                        className="pointer-events-none select-none uppercase drop-shadow-md"
                        style={{ 
                          paintOrder: 'stroke fill',
                          stroke: 'rgba(0,0,0,0.2)',
                          strokeWidth: '1px',
                          letterSpacing: '-0.2px'
                        }}
                      >
                        {prize.name.length > 20 ? prize.name.substring(0, 17) + '...' : prize.name}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Global Gloss Overlay */}
              <circle cx="100" cy="100" r="99" fill="url(#glossEffect)" className="pointer-events-none" />
              <circle cx="100" cy="100" r="100" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
            </svg>

            {/* Center button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.button
                whileHover={{ scale: isSpinning ? 1 : 1.08 }}
                whileTap={{ scale: isSpinning ? 1 : 0.92 }}
                onClick={spinWheel}
                disabled={isSpinning || disabled}
                className="relative rounded-full shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-all border-[6px] border-white/90"
                style={{ 
                  background: state.brand.centerBgSecondaryColor 
                    ? `linear-gradient(135deg, ${state.brand.centerBgColor || '#ffffff'} 0%, ${state.brand.centerBgSecondaryColor} 100%)`
                    : (state.brand.centerBgColor || '#ffffff'),
                  width: 'min(24vw, 18vh, 110px)',
                  height: 'min(24vw, 18vh, 110px)',
                }}
              >
                {/* 3D Inner Shadow for Button */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.3)] pointer-events-none" />
                
                <div className="flex items-center justify-center w-full h-full p-2 relative z-10">
                  <motion.div 
                    className="w-full h-full flex items-center justify-center"
                    animate={isSpinning ? { rotate: 360 } : {}}
                    transition={isSpinning ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                  >
                    {isSpinning ? (
                      <span className="text-3xl sm:text-4xl text-indigo-600 drop-shadow-lg">⚡</span>
                    ) : (
                      state.brand.centerLogoUrl && state.brand.centerLogoUrl.trim() !== '' ? (
                        <img 
                          src={state.brand.centerLogoUrl} 
                          alt="Center Logo" 
                          className="w-full h-full object-contain p-1 drop-shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl drop-shadow-lg">🎰</span>
                      )
                    )}
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Big Call-to-Action Button */}
        <motion.button
          onClick={spinWheel}
          disabled={isSpinning || disabled}
          whileHover={{ scale: disabled || isSpinning ? 1 : 1.03 }}
          whileTap={{ scale: disabled || isSpinning ? 1 : 0.97 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative rounded-2xl sm:rounded-3xl text-white shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-block px-10 font-black overflow-hidden mt-8 sm:mt-10 md:mt-14 mx-auto"
          style={{ 
            background: isSpinning 
              ? `linear-gradient(135deg, ${state.brand.secondaryColor} 0%, ${state.brand.primaryColor} 100%)`
              : `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)`,
          }}
        >
          {/* Animated gradient overlay when spinning */}
          {isSpinning && (
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                backgroundSize: '200% 100%',
              }}
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl">
            {isSpinning ? (
              <>
                {/* Mini ruleta animada */}
                <motion.div
                  className="relative flex items-center justify-center"
                  style={{ width: '2.5rem', height: '2.5rem' }}
                >
                  {/* Ruleta giratoria con segmentos de colores */}
                  <motion.svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Segmentos de colores de la mini ruleta */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
                      const angle = 60;
                      const startAngle = (i * angle - 90) * (Math.PI / 180);
                      const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);
                      const radius = 20;
                      
                      const x1 = 20;
                      const y1 = 20;
                      const x2 = 20 + Math.cos(startAngle) * radius;
                      const y2 = 20 + Math.sin(startAngle) * radius;
                      const x3 = 20 + Math.cos(endAngle) * radius;
                      const y3 = 20 + Math.sin(endAngle) * radius;
                      
                      return (
                        <path
                          key={i}
                          d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} Z`}
                          fill={colors[i]}
                          stroke="white"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {/* Centro de la ruleta */}
                    <circle cx="20" cy="20" r="6" fill="white" stroke={state.brand.primaryColor} strokeWidth="2" />
                    <circle cx="20" cy="20" r="3" fill={state.brand.primaryColor} />
                  </motion.svg>
                </motion.div>
                <span>GIRANDO...</span>
              </>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl">🎁</span>
                <span>¡PRESIONA AQUÍ!</span>
              </>
            )}
          </span>
        </motion.button>

        {!isSpinning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-600 font-semibold text-sm sm:text-base mt-1"
          >
            Toca el botón para descubrir tu premio
          </motion.p>
        )}

        {/* Carousel Section */}
        {state.carouselConfig?.active && state.carouselConfig.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full mt-2 sm:mt-3"
          >
            <LogoCarousel 
              items={state.carouselConfig.items} 
              backgroundColor={state.carouselConfig.backgroundColor}
              speed={state.carouselConfig.speed}
              grayscale={state.carouselConfig.grayscale}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};