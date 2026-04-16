import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { AppState, Prize, Participant, BrandConfig, Messages, GameConfig, DemoConfig, CarouselConfig } from '@/types';

// ── API URL ────────────────────────────────────────────────────────────────────
// In production (cPanel) this resolves to /api.php on the same domain.
// In local dev it will 404 and fall back to localStorage — that's expected.
const API_URL = './api.php';

// Disable server sync in local dev (Vite dev server can't run PHP)
const IS_DEV = import.meta.env.DEV;

interface AppContextType {
  state: AppState;
  isSyncing: boolean;
  updateBrand: (brand: Partial<BrandConfig>) => void;
  addPrize: (prize: Prize) => void;
  updatePrize: (id: string, prize: Partial<Prize>) => void;
  deletePrize: (id: string) => void;
  addParticipant: (participant: Participant) => void;
  updateMessages: (messages: Partial<Messages>) => void;
  updateGameConfig: (config: Partial<GameConfig>) => void;
  updateDemoConfig: (config: Partial<DemoConfig>) => void;
  updateCarouselConfig: (config: Partial<CarouselConfig>) => void;
  updateQR: (id: string, qr: Partial<QRItem>) => void;
  addQR: (qr: QRItem) => void;
  deleteQR: (id: string) => void;
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
    centerLogoUrl: '',
    centerBgColor: '#ffffff',
    centerBgSecondaryColor: '#f3f4f6',
    wheelBorderColor: '#1f2937',
    cardBackgroundColor: 'rgba(0, 0, 0, 0.7)',
    backgroundVideoUrl: '',
    textColor: '#ffffff',
    menuWheelColor: '#7c3aed',
    menuRecruitmentColor: '#10b981',
    menuSocialColor: '#f59e0b',
    menuProvidersColor: '#6366f1',
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
    menuWelcome: 'Bienvenido a la Experiencia',
    menuSocialTitle: 'REDES SOCIALES',
    menuSocialTagline: 'Conéctate con nosotros',
  },
  gameConfig: {
    dailyLimit: 100,
    currentDailyCount: 0,
    requireRegistration: true,
    enableSounds: true,
    enableAnimations: true,
    spinDuration: 5000,
    wheelRotationSpeed: 2,
    showPrizes: true,
    adminPassword: 'Aumovio1314',
    redirectUrl: '',
    redirectDelay: 5,
  },
  demoConfig: {
    frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/marco-totem-front.webp',
    screenTop: '5.3%',
    screenLeft: '12.6%',
    screenWidth: '76.5%',
    screenHeight: '54%',
    screenBorderRadius: '8px',
  },
  carouselConfig: {
    items: [],
    backgroundColor: 'transparent',
    speed: 20,
    grayscale: false,
    active: true,
  },
  qrs: [
    { id: 'qr-recruitment', label: 'RECLUTAMIENTO', imageUrl: '/qr/QR-RECLUTAMIENTO-AUMOVO-HD@2x.png', type: 'recruitment', location: 'main', active: true },
    { id: 'qr-providers', label: 'PROVEEDORES', imageUrl: '/qr/qr-proveedores.png', type: 'providers', location: 'main', active: true },
    { id: 'qr-facebook', label: 'FACEBOOK', imageUrl: '/qr/QR-FACEBOOK-AUMOVIO.png', type: 'facebook', location: 'social', active: true },
    { id: 'qr-instagram', label: 'INSTAGRAM', imageUrl: '/qr/QR-INSTAGRAM-AUMOVIO.png', type: 'instagram', location: 'social', active: true },
    { id: 'qr-linkedin', label: 'LINKEDIN', imageUrl: '/qr/QR-LINKEDIN-AUMOVIO.png', type: 'linkedin', location: 'social', active: true },
  ],
};

// ── Migration helper ───────────────────────────────────────────────────────────
function applyMigrations(parsed: AppState): AppState {
  if (!parsed.carouselConfig) parsed.carouselConfig = defaultState.carouselConfig;
  if (parsed.gameConfig && parsed.gameConfig.showPrizes === undefined)
    parsed.gameConfig.showPrizes = defaultState.gameConfig.showPrizes;
  if (parsed.gameConfig && (!parsed.gameConfig.adminPassword || parsed.gameConfig.adminPassword === 'admin123'))
    parsed.gameConfig.adminPassword = defaultState.gameConfig.adminPassword;
  if (parsed.brand && parsed.brand.wheelBorderColor === undefined)
    parsed.brand.wheelBorderColor = defaultState.brand.wheelBorderColor;
  if (parsed.brand && parsed.brand.cardBackgroundColor === undefined)
    parsed.brand.cardBackgroundColor = defaultState.brand.cardBackgroundColor;
  if (parsed.brand && parsed.brand.backgroundVideoUrl === undefined)
    parsed.brand.backgroundVideoUrl = defaultState.brand.backgroundVideoUrl;
  if (parsed.brand && parsed.brand.textColor === undefined)
    parsed.brand.textColor = defaultState.brand.textColor;
  if (parsed.gameConfig && parsed.gameConfig.redirectUrl === undefined)
    parsed.gameConfig.redirectUrl = defaultState.gameConfig.redirectUrl;
  if (parsed.gameConfig && parsed.gameConfig.redirectDelay === undefined)
    parsed.gameConfig.redirectDelay = defaultState.gameConfig.redirectDelay;
  
  // Menu customization migrations
  if (parsed.brand && parsed.brand.menuWheelColor === undefined)
    parsed.brand.menuWheelColor = defaultState.brand.menuWheelColor;
  if (parsed.brand && parsed.brand.menuRecruitmentColor === undefined)
    parsed.brand.menuRecruitmentColor = defaultState.brand.menuRecruitmentColor;
  if (parsed.brand && parsed.brand.menuSocialColor === undefined)
    parsed.brand.menuSocialColor = defaultState.brand.menuSocialColor;
  if (parsed.brand && parsed.brand.menuProvidersColor === undefined)
    parsed.brand.menuProvidersColor = defaultState.brand.menuProvidersColor;
  
  if (parsed.messages && parsed.messages.menuWelcome === undefined)
    parsed.messages.menuWelcome = defaultState.messages.menuWelcome;
  if (parsed.messages && parsed.messages.menuSocialTitle === undefined)
    parsed.messages.menuSocialTitle = defaultState.messages.menuSocialTitle;
  if (parsed.messages && parsed.messages.menuSocialTagline === undefined)
    parsed.messages.menuSocialTagline = defaultState.messages.menuSocialTagline;
  
  if (!parsed.qrs) {
    parsed.qrs = defaultState.qrs;
  } else {
    parsed.qrs = parsed.qrs.map(qr => ({
      ...qr,
      location: qr.location || (['recruitment', 'providers'].includes(qr.type) ? 'main' : 'social')
    }));
  }

  return parsed;
}

// ── Server helpers ─────────────────────────────────────────────────────────────
async function fetchRemoteState(): Promise<AppState | null> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;
    return applyMigrations(data as AppState);
  } catch {
    return null;
  }
}

async function pushRemoteState(state: AppState): Promise<void> {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  } catch {
    // If push fails, the localStorage copy is still the latest
    console.warn('[Ruleta] No se pudo sincronizar con el servidor. Los cambios están guardados localmente.');
  }
}

// ── Context ────────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    // Initial render: use localStorage as instant cache while we fetch from server
    const saved = localStorage.getItem('prizeWheelState');
    if (!saved) return defaultState;
    try {
      return applyMigrations(JSON.parse(saved) as AppState);
    } catch {
      return defaultState;
    }
  });

  const [isSyncing, setIsSyncing] = useState(!IS_DEV);
  const isFirstLoad = useRef(true);

  // ── On mount: load authoritative config from server ─────────────────────────
  useEffect(() => {
    if (IS_DEV) return; // Skip in local dev — PHP not available
    fetchRemoteState().then((remote) => {
      if (remote) {
        setState(remote);
        localStorage.setItem('prizeWheelState', JSON.stringify(remote));
      }
      setIsSyncing(false);
    });
  }, []);

  // ── On state change: persist to localStorage AND server ─────────────────────
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; // Don't push on initial load (would overwrite server with stale cache)
    }
    localStorage.setItem('prizeWheelState', JSON.stringify(state));
    if (!IS_DEV) {
      pushRemoteState(state);
    }
  }, [state]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const updateBrand = (brand: Partial<BrandConfig>) =>
    setState((prev) => ({ ...prev, brand: { ...prev.brand, ...brand } }));

  const addPrize = (prize: Prize) =>
    setState((prev) => ({ ...prev, prizes: [...prev.prizes, prize] }));

  const updatePrize = (id: string, prize: Partial<Prize>) =>
    setState((prev) => ({
      ...prev,
      prizes: prev.prizes.map((p) => (p.id === id ? { ...p, ...prize } : p)),
    }));

  const deletePrize = (id: string) =>
    setState((prev) => ({ ...prev, prizes: prev.prizes.filter((p) => p.id !== id) }));

  const addParticipant = (participant: Participant) =>
    setState((prev) => ({
      ...prev,
      participants: [...prev.participants, participant],
      gameConfig: { ...prev.gameConfig, currentDailyCount: prev.gameConfig.currentDailyCount + 1 },
    }));

  const updateMessages = (messages: Partial<Messages>) =>
    setState((prev) => ({ ...prev, messages: { ...prev.messages, ...messages } }));

  const updateGameConfig = (config: Partial<GameConfig>) =>
    setState((prev) => ({ ...prev, gameConfig: { ...prev.gameConfig, ...config } }));

  const updateDemoConfig = (config: Partial<DemoConfig>) =>
    setState((prev) => ({ ...prev, demoConfig: { ...prev.demoConfig, ...config } }));

  const updateCarouselConfig = (config: Partial<CarouselConfig>) =>
    setState((prev) => ({ ...prev, carouselConfig: { ...prev.carouselConfig, ...config } }));

  const updateQR = (id: string, qr: Partial<QRItem>) =>
    setState((prev) => ({
      ...prev,
      qrs: prev.qrs.map((item) => (item.id === id ? { ...item, ...qr } : item)),
    }));

  const addQR = (qr: QRItem) =>
    setState((prev) => ({ ...prev, qrs: [...prev.qrs, qr] }));

  const deleteQR = (id: string) =>
    setState((prev) => ({ ...prev, qrs: prev.qrs.filter((item) => item.id !== id) }));

  const resetDailyCount = () =>
    setState((prev) => ({ ...prev, gameConfig: { ...prev.gameConfig, currentDailyCount: 0 } }));

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
        isSyncing,
        updateBrand,
        addPrize,
        updatePrize,
        deletePrize,
        addParticipant,
        updateMessages,
        updateGameConfig,
        updateDemoConfig,
        updateCarouselConfig,
        updateQR,
        addQR,
        deleteQR,
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
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};