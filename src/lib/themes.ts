import { PremiumThemeId, StoreThemeSettings, ThemeMode } from '../types';

export interface PremiumThemeConfig {
  id: PremiumThemeId;
  name: string;
  tagline: string;
  category: 'Signature Luxury' | 'Developer & SaaS' | 'Enterprise Tech' | 'Creative Studio' | 'Creator & Editorial' | 'Futuristic Web3' | 'Architectural';
  badge: string;
  description: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryRgb: string;
    accent: string;
    gradient: string;
    glow: string;
    swatches: [string, string, string, string]; // [primary, accent, light, darkSurface]
  };
}

export const DEFAULT_THEME_SETTINGS: StoreThemeSettings = {
  activeThemeId: 'amber-gold',
  defaultMode: 'dark',
  allowUserModeToggle: true,
};

export const PREMIUM_THEMES: PremiumThemeConfig[] = [
  {
    id: 'amber-gold',
    name: 'Amber Gold',
    tagline: 'Signature Obsidian & Radiant 24K Gold',
    category: 'Signature Luxury',
    badge: 'Flagship Edition',
    description: 'The iconic WebCraft aesthetic featuring obsidian slate backgrounds, radiant gold accents, and warm artisan illumination.',
    colors: {
      primary: '#f59e0b',
      primaryHover: '#d97706',
      primaryLight: '#fef3c7',
      primaryRgb: '245, 158, 11',
      accent: '#f97316',
      gradient: 'from-amber-500 via-amber-400 to-amber-600',
      glow: 'rgba(245, 158, 11, 0.25)',
      swatches: ['#f59e0b', '#f97316', '#fef3c7', '#0f172a'],
    },
  },
  {
    id: 'emerald-royale',
    name: 'Emerald Royale',
    tagline: 'Cyber Jade & Mint Matrix Glass',
    category: 'Developer & SaaS',
    badge: 'High Growth',
    description: 'Crisp emerald and vivid mint glow engineered for modern developer tools, fintech dashboards, and clean code boilerplates.',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#d1fae5',
      primaryRgb: '16, 185, 129',
      accent: '#14b8a6',
      gradient: 'from-emerald-500 via-teal-400 to-emerald-600',
      glow: 'rgba(16, 185, 129, 0.25)',
      swatches: ['#10b981', '#14b8a6', '#d1fae5', '#064e3b'],
    },
  },
  {
    id: 'sapphire-midnight',
    name: 'Sapphire Midnight',
    tagline: 'Electric Cobalt & Indigo Cyberpunk',
    category: 'Enterprise Tech',
    badge: 'Enterprise Pro',
    description: 'Ultra-modern Silicon Valley tech aesthetic with high-energy sapphire blue and deep ocean midnight gradients.',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryLight: '#dbeafe',
      primaryRgb: '59, 130, 246',
      accent: '#6366f1',
      gradient: 'from-blue-500 via-indigo-500 to-blue-600',
      glow: 'rgba(59, 130, 246, 0.25)',
      swatches: ['#3b82f6', '#6366f1', '#dbeafe', '#1e1b4b'],
    },
  },
  {
    id: 'amethyst-velvet',
    name: 'Amethyst Velvet',
    tagline: 'Royal Purple & Cosmic Lavender Glow',
    category: 'Creative Studio',
    badge: 'Artisan Edition',
    description: 'Enchanting purple and cosmic violet hues created for top-tier design systems, Figma UI kits, and creative agencies.',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      primaryLight: '#ede9fe',
      primaryRgb: '139, 92, 246',
      accent: '#ec4899',
      gradient: 'from-purple-500 via-violet-400 to-fuchsia-600',
      glow: 'rgba(139, 92, 246, 0.25)',
      swatches: ['#8b5cf6', '#ec4899', '#ede9fe', '#2e1065'],
    },
  },
  {
    id: 'crimson-luxe',
    name: 'Crimson Luxe',
    tagline: 'Ruby Quartz & Rose Gold Elegance',
    category: 'Creator & Editorial',
    badge: 'Creator Drop',
    description: 'Sensational crimson ruby and soft rose gold tones designed for premium creator drops, luxury assets, and high-converting stores.',
    colors: {
      primary: '#f43f5e',
      primaryHover: '#e11d48',
      primaryLight: '#ffe4e6',
      primaryRgb: '244, 63, 94',
      accent: '#fb7185',
      gradient: 'from-rose-500 via-rose-400 to-pink-600',
      glow: 'rgba(244, 63, 94, 0.25)',
      swatches: ['#f43f5e', '#fb7185', '#ffe4e6', '#4c0519'],
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    tagline: 'Hyper Cyan & Acid Lime Futuristic',
    category: 'Futuristic Web3',
    badge: 'Future Tech',
    description: 'High-voltage electric cyan and vivid matrix accents built for futuristic digital products, Web3 platforms, and next-gen tools.',
    colors: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      primaryLight: '#cffafe',
      primaryRgb: '6, 182, 212',
      accent: '#10b981',
      gradient: 'from-cyan-400 via-teal-400 to-blue-500',
      glow: 'rgba(6, 182, 212, 0.3)',
      swatches: ['#06b6d4', '#10b981', '#cffafe', '#083344'],
    },
  },
  {
    id: 'titanium-mono',
    name: 'Titanium Minimalist',
    tagline: 'Swiss Architectural Slate & Platinum',
    category: 'Architectural',
    badge: 'Pure Minimalist',
    description: 'Ultra-pure Swiss architectural aesthetic with crisp monochrome contrasts, titanium edges, and focus on pure craftsmanship.',
    colors: {
      primary: '#94a3b8',
      primaryHover: '#64748b',
      primaryLight: '#f1f5f9',
      primaryRgb: '148, 163, 184',
      accent: '#cbd5e1',
      gradient: 'from-slate-300 via-slate-100 to-slate-400',
      glow: 'rgba(148, 163, 184, 0.2)',
      swatches: ['#94a3b8', '#e2e8f0', '#f8fafc', '#0f172a'],
    },
  },
];

export function getThemeConfig(themeId: PremiumThemeId): PremiumThemeConfig {
  return (
    PREMIUM_THEMES.find((t) => t.id === themeId) ||
    PREMIUM_THEMES[0] // fallback to Amber Gold
  );
}
