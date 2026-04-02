import React, { useRef, useEffect, useState } from 'react';
import { TotemView } from '@/app/views/TotemView';
import { useApp } from '@/context/AppContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DemoView: React.FC = () => {
  const { state } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (screenRef.current) {
        const rect = screenRef.current.getBoundingClientRect();
        // El TotemView usa 1080x1920, así que necesitamos escalar basado en el área disponible
        const scaleX = rect.width / 1080;
        const scaleY = rect.height / 1920;
        // Usamos el menor para que todo quepa sin recortar
        setScale(Math.min(scaleX, scaleY));
      }
    };

    // Esperar a que la imagen se cargue
    const img = new Image();
    img.src = state.demoConfig.frameImageUrl;
    img.onload = () => {
      setTimeout(updateScale, 100);
    };

    // Actualizar cuando cambie la configuración del demo
    updateScale();

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [state.demoConfig.frameImageUrl, state.demoConfig.screenTop, state.demoConfig.screenLeft, state.demoConfig.screenWidth, state.demoConfig.screenHeight]);

  const handleScreenClick = () => {
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full min-h-screen flex flex-col items-center justify-center overflow-auto py-8 px-4 relative"
        style={{
          backgroundImage: 'url(https://imagenes.inedito.digital/INEDITO%20DIGITAL/fondo_expo.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay semi-transparente para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/10 -z-10" />
        
        {/* Texto informativo superior con fondo */}
        <div className="text-center mb-6 max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-8 py-6 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Demostración Interactiva
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Esta es una simulación de cómo se verá la experiencia en un tótem físico
          </p>
          <p className="text-purple-600 font-semibold text-base">
            Haz clic en la pantalla para ver la experiencia completa
          </p>
        </div>

        {/* Contenedor del marco del tótem */}
        <div className="relative">
          {/* Sombra en el suelo */}
          <div 
            className="absolute bottom-0 w-full h-16 bg-black blur-3xl rounded-full"
            style={{
              left: '50%',
              transform: 'translateX(-50%) translateY(50%)',
            }}
          />
          
          {/* Marco del tótem */}
          <img
            src={state.demoConfig.frameImageUrl}
            alt="Marco del Tótem"
            className="w-auto h-auto max-h-[75vh] object-contain select-none pointer-events-none relative z-10"
            draggable={false}
          />

          {/* Pantalla interactiva del tótem posicionada sobre la zona verde */}
          <div
            ref={screenRef}
            onClick={handleScreenClick}
            className="absolute overflow-hidden bg-white cursor-pointer hover:ring-4 hover:ring-purple-500 transition-all z-20"
            style={{
              top: state.demoConfig.screenTop,
              left: state.demoConfig.screenLeft,
              width: state.demoConfig.screenWidth,
              height: state.demoConfig.screenHeight,
              borderRadius: state.demoConfig.screenBorderRadius,
            }}
          >
            {/* Contenedor escalado para simular viewport de 1080x1920 */}
            <div
              style={{
                width: '1080px',
                height: '1920px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
              }}
            >
              <TotemView isDemoMode={true} />
            </div>

            {/* Overlay con indicador de clic */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all flex items-center justify-center pointer-events-none">
              <div className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg opacity-0 hover:opacity-100 transition-opacity">
                Clic para ver experiencia completa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={handleCloseLightbox}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseLightbox}
                className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 font-semibold mb-4"
              >
                <X className="w-6 h-6" />
                Cerrar
              </button>

              {/* iPhone-style Frame with 9:16 aspect ratio */}
              <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner relative" style={{ aspectRatio: '9/16' }}>
                  {/* Iframe with /totem - mobile vertical resolution (9:16) */}
                  <iframe
                    src="/totem"
                    className="w-full h-full border-0"
                    style={{
                      width: '450px',
                      height: '800px',
                      maxWidth: '90vw',
                      maxHeight: '85vh',
                    }}
                    title="Vista del Tótem"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mt-4 text-white text-sm max-w-md">
                <p className="font-semibold">Vista del tótem interactivo (450×800)</p>
                <p className="text-gray-400 mt-1">Resolución móvil vertical - experiencia real del usuario</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};