export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  isDiscounted?: boolean;
  category: string;
  badge?: string;
  images: string[];
  purchaseLink: string;
  features: string[];
  status: 'active' | 'draft';
  createdAt?: string;
}

export interface Feature {
  id: string;
  icon: string;
  heading: string;
  description: string;
  order?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export interface HeroContent {
  heading: string;
  subtitle: string;
  badgeText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImage: string;
}

export interface AboutContent {
  heading: string;
  description: string;
  mission: string;
  vision: string;
  brandImage: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface TrustBadgeItem {
  id: string;
  label: string;
  icon?: string;
  sublabel?: string;
}

export interface FooterContent {
  // Brand & Identity
  brandName?: string;
  brandAccent?: string;
  brandDescription: string;
  badgeText?: string;
  contactEmail: string;
  showContactEmail?: boolean;
  brandLogoUrl?: string;

  // Newsletter Section
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  newsletterButtonText?: string;
  newsletterPlaceholder?: string;

  // Navigation Columns
  showColumn1?: boolean;
  column1Title?: string;
  column1Links?: FooterLinkItem[];

  showColumn2?: boolean;
  column2Title?: string;
  column2Links?: FooterLinkItem[];

  // Column 3 (Action / Support / Admin Portal)
  showColumn3?: boolean;
  column3Title?: string;
  column3Text?: string;
  column3ButtonText?: string;
  column3ButtonHref?: string;
  column3ActionType?: 'admin' | 'link' | 'contact' | 'none';

  // Social Links
  showSocialLinks?: boolean;
  socialLinks: {
    twitter?: string;
    github?: string;
    dribbble?: string;
    linkedin?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
    telegram?: string;
    threads?: string;
    producthunt?: string;
  };

  // Trust, Security & Payment
  showTrustBadges?: boolean;
  trustBadges?: TrustBadgeItem[];
  showPaymentMethods?: boolean;

  // Bottom Bar & Controls
  copyrightText: string;
  showThemeIndicator?: boolean;
  showModeToggle?: boolean;
  showBackToTop?: boolean;
  legalLinks?: FooterLinkItem[];
}

export type ThemeMode = 'dark' | 'light';

export type PremiumThemeId =
  | 'amber-gold'
  | 'emerald-royale'
  | 'sapphire-midnight'
  | 'amethyst-velvet'
  | 'crimson-luxe'
  | 'cyberpunk-neon'
  | 'titanium-mono';

export interface StoreThemeSettings {
  activeThemeId: PremiumThemeId;
  defaultMode: ThemeMode;
  allowUserModeToggle?: boolean;
  updatedAt?: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  footer: FooterContent;
  theme?: StoreThemeSettings;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}
