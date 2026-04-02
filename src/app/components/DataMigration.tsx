import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export const DataMigration: React.FC = () => {
  const [showMigration, setShowMigration] = useState(false);

  useEffect(() => {
    // Check if localStorage has old data with "Inédito Digital" or old color scheme
    const savedData = localStorage.getItem('prizeWheelState');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Add demoConfig if it doesn't exist
        if (!parsed.demoConfig) {
          parsed.demoConfig = {
            frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/marco-totem-front.webp',
            screenTop: '5.3%',
            screenLeft: '12.6%',
            screenWidth: '76.5%',
            screenHeight: '54%',
            screenBorderRadius: '8px',
          };
          localStorage.setItem('prizeWheelState', JSON.stringify(parsed));
        }
        
        // Check if has old branding (Inédito) or old dark color scheme
        const hasOldBrand = 
          parsed.brand?.companyName?.toLowerCase().includes('inédito') ||
          parsed.brand?.companyName === 'Inédito Digital' ||
          parsed.brand?.companyName === 'Tu Empresa';
        
        const hasOldColors = 
          parsed.brand?.backgroundColor === '#0f172a' || // old dark background
          parsed.brand?.primaryColor === '#6366f1'; // old indigo color
        
        if (hasOldBrand || hasOldColors) {
          setShowMigration(true);
        }
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
  }, []);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowMigration(false);
  };

  return (
    <AnimatePresence>
      {showMigration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Datos Antiguos Detectados
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Se detectaron datos antiguos en tu navegador. Este es un sistema{' '}
                  <strong>white-label</strong> sin marca específica.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Recomendado:</strong> Resetea el sistema para usar los valores
                predeterminados genéricos ("Tu Empresa").
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Resetear Ahora
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Más Tarde
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              También puedes visitar{' '}
              <a href="/reset.html" className="text-indigo-600 hover:underline">
                /reset.html
              </a>{' '}
              para resetear manualmente
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};