import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Prize } from '@/types';
import { useApp } from '@/context/AppContext';
import { ChevronDown } from 'lucide-react';

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

    // Calculate rotation to land on selected prize
    const prizeIndex = activePrizes.findIndex((p) => p.id === selectedPrize.id);
    const segmentAngle = 360 / activePrizes.length;
    const targetAngle = prizeIndex * segmentAngle;
    const spins = 5 + Math.random() * 3;
    const finalRotation = 360 * spins - targetAngle;

    setRotation(rotation + finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(selectedPrize);
    }, spinDuration);
  };

  const segmentAngle = 360 / activePrizes.length;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-screen px-4 py-4 sm:py-6">
      {/* Main container with all visual elements */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl gap-3 sm:gap-4">
        
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
              className="h-14 sm:h-16 md:h-20 object-contain max-w-[70vw]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-black text-center"
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
            className="flex flex-col items-center"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
              style={{
                background: `linear-gradient(135deg, ${state.brand.primaryColor}, ${state.brand.secondaryColor})`,
              }}
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" strokeWidth={4} />
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
          <motion.div
            ref={wheelRef}
            animate={{ rotate: rotation }}
            transition={{
              duration: spinDuration / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative rounded-full overflow-hidden"
            style={{
              width: 'min(85vw, 65vh, 500px)',
              height: 'min(85vw, 65vh, 500px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 8px white, 0 0 0 12px ' + state.brand.primaryColor,
            }}
          >
            {/* Prize segments */}
            <svg className="w-full h-full" viewBox="0 0 200 200">
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

                const textAngle = (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180);
                const textRadius = radius * 0.65;
                const textX = 100 + Math.cos(textAngle) * textRadius;
                const textY = 100 + Math.sin(textAngle) * textRadius;
                const textRotation = index * segmentAngle + segmentAngle / 2;

                return (
                  <g key={prize.id}>
                    <path
                      d={pathData}
                      fill={prize.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    
                    <text
                      x={textX}
                      y={textY}
                      fill={prize.textColor}
                      fontSize={activePrizes.length > 6 ? "7" : "8.5"}
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation} ${textX} ${textY})`}
                      className="pointer-events-none select-none uppercase"
                      style={{ 
                        paintOrder: 'stroke fill',
                        stroke: prize.textColor === '#ffffff' || prize.textColor === '#fff' ? '#00000040' : '#ffffff60',
                        strokeWidth: '0.8px'
                      }}
                    >
                      {prize.name.length > 12 ? prize.name.substring(0, 10) + '...' : prize.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <motion.button
                whileHover={{ scale: isSpinning ? 1 : 1.08 }}
                whileTap={{ scale: isSpinning ? 1 : 0.92 }}
                onClick={spinWheel}
                disabled={isSpinning || disabled}
                className="relative rounded-full shadow-2xl flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-all"
                style={{ 
                  background: `linear-gradient(135deg, ${state.brand.primaryColor} 0%, ${state.brand.secondaryColor} 100%)`,
                  width: 'min(22vw, 16vh, 100px)',
                  height: 'min(22vw, 16vh, 100px)',
                }}
              >
                <div className="bg-white rounded-full flex items-center justify-center shadow-inner"
                     style={{
                       width: 'calc(100% - 12px)',
                       height: 'calc(100% - 12px)',
                     }}>
                  <motion.div 
                    className="text-3xl sm:text-4xl"
                    animate={isSpinning ? { rotate: 360 } : {}}
                    transition={isSpinning ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
                  >
                    {isSpinning ? '⚡' : '🎰'}
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
          className="relative rounded-2xl sm:rounded-3xl text-white shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-all w-full max-w-md font-black overflow-hidden mt-2"
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

          <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 text-xl sm:text-2xl md:text-3xl">
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

        {/* Instruction text */}
        {!isSpinning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-600 font-semibold text-sm sm:text-base mt-2"
          >
            Toca el botón para descubrir tu premio
          </motion.p>
        )}
      </div>
    </div>
  );
};