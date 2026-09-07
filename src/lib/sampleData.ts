import { Product, Feature, FAQ, WebsiteContent } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_FEATURES: Feature[] = [
  {
    id: 'feat-instant-access',
    icon: 'Zap',
    heading: 'Instant Digital Access',
    description: 'Download your files immediately upon checkout with permanent access and automated cloud sync.',
    order: 1,
  },
  {
    id: 'feat-commercial-license',
    icon: 'ShieldCheck',
    heading: 'Commercial License Included',
    description: 'Use all templates, components, and tools for your internal projects and unlimited client deliverables.',
    order: 2,
  },
  {
    id: 'feat-lifetime-updates',
    icon: 'RefreshCw',
    heading: 'Free Lifetime Updates',
    description: 'Every product receives free ongoing version updates, bug fixes, and continuous improvements.',
    order: 3,
  },
  {
    id: 'feat-clean-design',
    icon: 'Sparkles',
    heading: 'Pixel-Perfect Craftsmanship',
    description: 'Engineered with strict design standards, balanced typography, and responsive auto-layout geometry.',
    order: 4,
  },
  {
    id: 'feat-multi-format',
    icon: 'Layers',
    heading: 'Multi-Format Flexibility',
    description: 'Supplied in Notion, Figma, Google Sheets, and TypeScript code packages for zero vendor lock-in.',
    order: 5,
  },
  {
    id: 'feat-priority-support',
    icon: 'Headphones',
    heading: 'Direct Creator Support',
    description: 'Need assistance or have customization questions? Get rapid answers directly from our product architects.',
    order: 6,
  },
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I receive my digital products after purchase?',
    answer: 'Immediately after completing your checkout via our secure payment partners (such as Gumroad or Stripe), you will receive instant on-screen access to duplicate or download your files, alongside an automated confirmation email with your persistent license key and access link.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'Can I use these products for commercial or client projects?',
    answer: 'Yes! Every WebCraft Goods product includes our standard commercial license. You are fully permitted to use our templates, dashboards, and UI kits to deliver client solutions or build commercial products. The only restriction is reselling our raw files as standalone templates.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Do you offer updates when new software versions launch?',
    answer: 'Absolutely. We update our products regularly to support the latest Notion features, Figma variable updates, and modern web frameworks. As an existing customer, all future iterations of your purchased product are completely free.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Do I need paid subscriptions to use these templates?',
    answer: 'All our Notion templates work 100% on the Free Notion plan. Similarly, our Figma kits work seamlessly on free Figma starter plans, and our financial sheets are fully compatible with free Google Sheets.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What is your refund and satisfaction policy?',
    answer: 'We stand firmly behind the caliber of our digital goods. If you encounter any technical defect or find that a product does not match its description, contact our support team within 14 days and we will resolve it or provide a prompt refund.',
    order: 5,
  },
];

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    heading: 'Premium Digital Products Crafted for Productivity & Growth',
    subtitle: 'Discover powerful planners, dashboards, templates, and digital tools designed to simplify your workflow.',
    badgeText: 'Curated Software & Digital Marketplace',
    primaryButtonText: 'Explore Products',
    primaryButtonLink: '#products',
    secondaryButtonText: 'Learn More',
    secondaryButtonLink: '#features',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  },
  about: {
    heading: 'About WebCraft Goods',
    description: 'WebCraft Goods was founded on a simple philosophy: digital tools should feel as refined, durable, and delightful as handcrafted physical instruments. We engineer elite templates, financial systems, and developer toolkits that eliminate friction so you can focus on building what matters.',
    mission: 'To empower creators, founders, and modern teams with world-class digital assets that accelerate execution by 10x.',
    vision: 'To build the most trusted, aesthetically pristine marketplace for productivity architecture and digital craftsmanship.',
    brandImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    stats: [
      { label: 'Active Creators', value: '45,000+' },
      { label: 'Customer Rating', value: '4.9 / 5.0' },
      { label: 'Time Saved / User', value: '120+ hrs' },
      { label: 'Instant Downloads', value: '180,000+' },
    ],
  },
  footer: {
    brandDescription: 'WebCraft Goods engineers elite digital templates, Notion systems, and developer boilerplates for modern professionals and teams.',
    contactEmail: 'support@webcraftgoods.com',
    copyrightText: '© 2026 WebCraft Goods Inc. All rights reserved.',
    socialLinks: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      dribbble: 'https://dribbble.com',
      linkedin: 'https://linkedin.com',
    },
  },
};
