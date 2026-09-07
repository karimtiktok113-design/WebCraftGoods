export interface Product {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: string;
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

export interface FooterContent {
  brandDescription: string;
  contactEmail: string;
  copyrightText: string;
  socialLinks: {
    twitter: string;
    github: string;
    dribbble: string;
    linkedin: string;
  };
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  footer: FooterContent;
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
