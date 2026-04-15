// Types and interfaces for the Prize Wheel system

export interface Prize {
  id: string;
  name: string;
  description: string;
  probability: number;
  maxWins: number;
  currentWins: number;
  color: string;
  textColor: string;
  active: boolean;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  prizeWon: Prize | null;
  acceptedTerms: boolean;
  timestamp: string;
}

export interface BrandConfig {
  logoUrl: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  isWhiteLabel: boolean;
  systemName: string;
  centerLogoUrl?: string;
  centerBgColor?: string;
  centerBgSecondaryColor?: string;
  logoText?: string;
  wheelBorderColor?: string;
  cardBackgroundColor?: string;
  backgroundVideoUrl?: string;
  textColor?: string;
  menuWheelColor?: string;
  menuRecruitmentColor?: string;
  menuSocialColor?: string;
  menuProvidersColor?: string;
}

export interface Messages {
  welcome: string;
  beforeSpin: string;
  congratulations: string;
  prizeMessage: string;
  termsText: string;
  menuWelcome?: string;
  menuSocialTitle?: string;
  menuSocialTagline?: string;
}

export interface GameConfig {
  dailyLimit: number;
  currentDailyCount: number;
  requireRegistration: boolean;
  enableSounds: boolean;
  enableAnimations: boolean;
  spinDuration: number;
  wheelRotationSpeed: number;
  showPrizes: boolean;
  adminPassword?: string;
  redirectUrl?: string;
  redirectDelay?: number;
}

export interface DemoConfig {
  frameImageUrl: string;
  screenTop: string;
  screenLeft: string;
  screenWidth: string;
  screenHeight: string;
  screenBorderRadius: string;
}

export interface CarouselItem {
  id: string;
  imageUrl: string;
  altText: string;
}

export interface CarouselConfig {
  items: CarouselItem[];
  backgroundColor: string;
  speed: number;
  grayscale: boolean;
  active: boolean;
}

export interface AppState {
  brand: BrandConfig;
  prizes: Prize[];
  participants: Participant[];
  messages: Messages;
  gameConfig: GameConfig;
  demoConfig: DemoConfig;
  carouselConfig: CarouselConfig;
}