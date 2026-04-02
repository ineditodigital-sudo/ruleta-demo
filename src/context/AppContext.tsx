import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Prize, Participant, BrandConfig, Messages, GameConfig, DemoConfig } from '@/types';

interface AppContextType {
  state: AppState;
  updateBrand: (brand: Partial<BrandConfig>) => void;
  addPrize: (prize: Prize) => void;
  updatePrize: (id: string, prize: Partial<Prize>) => void;
  deletePrize: (id: string) => void;
  addParticipant: (participant: Participant) => void;
  updateMessages: (messages: Partial<Messages>) => void;
  updateGameConfig: (config: Partial<GameConfig>) => void;
  updateDemoConfig: (config: Partial<DemoConfig>) => void;
  resetDailyCount: () => void;
  exportLeads: () => void;
}

const defaultState: AppState = {
  brand: {
    logoUrl: '',
    companyName: 'Ruleta de Premios',
    primaryColor: '#7c3aed',
    secondaryColor: '#1f2937',
    backgroundColor: '#f8fafc',
    isWhiteLabel: true,
    systemName: 'Ruleta de Premios',
  },
  prizes: [
    {
      id: '1',
      name: '50% de descuento',
      description: 'Descuento del 50% en tu próxima compra',
      probability: 20,
      maxWins: 10,
      currentWins: 0,
      color: '#ef4444',
      textColor: '#ffffff',
      active: true,
    },
    {
      id: '2',
      name: 'Producto gratis',
      description: 'Un producto gratis de nuestra colección',
      probability: 10,
      maxWins: 5,
      currentWins: 0,
      color: '#f59e0b',
      textColor: '#ffffff',
      active: true,
    },
    {
      id: '3',
      name: '10% de descuento',
      description: 'Descuento del 10% en tu próxima compra',
      probability: 30,
      maxWins: 20,
      currentWins: 0,
      color: '#10b981',
      textColor: '#ffffff',
      active: true,
    },
    {
      id: '4',
      name: 'Envío gratis',
      description: 'Envío gratis en tu próxima compra',
      probability: 25,
      maxWins: 15,
      currentWins: 0,
      color: '#3b82f6',
      textColor: '#ffffff',
      active: true,
    },
    {
      id: '5',
      name: 'Sigue intentando',
      description: 'Mejor suerte la próxima vez',
      probability: 15,
      maxWins: 999,
      currentWins: 0,
      color: '#6b7280',
      textColor: '#ffffff',
      active: true,
    },
  ],
  participants: [],
  messages: {
    welcome: '¡Gira la ruleta y gana premios increíbles!',
    beforeSpin: 'Presiona el botón para girar la ruleta',
    congratulations: '¡Felicidades!',
    prizeMessage: 'Un asesor se pondrá en contacto contigo pronto',
    termsText: 'Acepto los términos y condiciones y el aviso de privacidad',
  },
  gameConfig: {
    dailyLimit: 100,
    currentDailyCount: 0,
    requireRegistration: true,
    enableSounds: true,
    enableAnimations: true,
    spinDuration: 5000,
    wheelRotationSpeed: 2,
  },
  demoConfig: {
    frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/marco-totem-front.webp',
    screenTop: '5.3%',
    screenLeft: '12.6%',
    screenWidth: '76.5%',
    screenHeight: '54%',
    screenBorderRadius: '8px',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('prizeWheelState');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('prizeWheelState', JSON.stringify(state));
  }, [state]);

  const updateBrand = (brand: Partial<BrandConfig>) => {
    setState((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...brand },
    }));
  };

  const addPrize = (prize: Prize) => {
    setState((prev) => ({
      ...prev,
      prizes: [...prev.prizes, prize],
    }));
  };

  const updatePrize = (id: string, prize: Partial<Prize>) => {
    setState((prev) => ({
      ...prev,
      prizes: prev.prizes.map((p) => (p.id === id ? { ...p, ...prize } : p)),
    }));
  };

  const deletePrize = (id: string) => {
    setState((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((p) => p.id !== id),
    }));
  };

  const addParticipant = (participant: Participant) => {
    setState((prev) => ({
      ...prev,
      participants: [...prev.participants, participant],
      gameConfig: {
        ...prev.gameConfig,
        currentDailyCount: prev.gameConfig.currentDailyCount + 1,
      },
    }));
  };

  const updateMessages = (messages: Partial<Messages>) => {
    setState((prev) => ({
      ...prev,
      messages: { ...prev.messages, ...messages },
    }));
  };

  const updateGameConfig = (config: Partial<GameConfig>) => {
    setState((prev) => ({
      ...prev,
      gameConfig: { ...prev.gameConfig, ...config },
    }));
  };

  const updateDemoConfig = (config: Partial<DemoConfig>) => {
    setState((prev) => ({
      ...prev,
      demoConfig: { ...prev.demoConfig, ...config },
    }));
  };

  const resetDailyCount = () => {
    setState((prev) => ({
      ...prev,
      gameConfig: { ...prev.gameConfig, currentDailyCount: 0 },
    }));
  };

  const exportLeads = () => {
    const csv = [
      ['Nombre', 'Correo', 'Teléfono', 'Premio', 'Fecha'],
      ...state.participants.map((p) => [
        p.name,
        p.email,
        p.phone,
        p.prizeWon?.name || 'N/A',
        new Date(p.timestamp).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateBrand,
        addPrize,
        updatePrize,
        deletePrize,
        addParticipant,
        updateMessages,
        updateGameConfig,
        updateDemoConfig,
        resetDailyCount,
        exportLeads,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};