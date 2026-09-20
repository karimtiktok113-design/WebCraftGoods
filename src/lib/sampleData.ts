import { Product, Feature, FAQ, WebsiteContent } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '3iQSzR00sBORClvyN3Om',
    title: 'The Ultimate Notion Workspace OS',
    shortDescription: 'All-in-one productivity architecture for founders, freelancers, and modern knowledge workers.',
    description: `Transform your chaotic daily schedule into a serene, high-yield operating system. The Ultimate Notion Workspace OS incorporates second-brain principles, dynamic project management, automated recurring tasks, and an executive dashboard tailored for founders and busy knowledge workers.

### Core System Architecture
- **Executive Command Center:** Consolidate your daily focus, top 3 priorities, ongoing projects, and quick capture in one unified viewport.
- **Project & Task Engine:** Kanban boards, timeline Gantt charts, and automated priority matrix tagging.
- **Resource Knowledge Base:** Bookmark web clippings, code snippets, book notes, and meeting summaries effortlessly.
- **Financial Health Tracker:** Keep tabs on recurring subscriptions, runway, and personal budgets.

### What is Included
1. Complete 1-Click Notion Template Duplicate Link
2. 45-Minute In-depth Video Walkthrough & Setup Guide
3. Lifetime Free Access to Future Workspace Schema Updates
4. Commercial License for Internal Team Deployment`,
    price: '$29',
    originalPrice: '$49',
    discountPercentage: 40,
    isDiscounted: true,
    category: 'Planners & OS',
    badge: 'Best Seller',
    images: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    ],
    purchaseLink: 'https://gumroad.com',
    features: [
      'Full Notion 2.0+ Compatible',
      'Lifetime Updates Included',
      'Automated Priority Matrix',
      'Commercial License',
    ],
    status: 'active',
    createdAt: '2026-03-24',
  },
  {
    id: 'reIB7pWuVqIaVhyg4xR2',
    title: 'Financial Freedom & Wealth Tracker',
    shortDescription: 'Institutional-grade financial forecasting and cash flow management for Google Sheets & Excel.',
    description: `Take ruthless control of your financial destiny. Built from the ground up for individuals and bootstrapped entrepreneurs, the Financial Freedom & Wealth Tracker empowers you with institutional-grade forecasting, net worth trajectory simulation, and expense leak diagnostics.

### Key Financial Modules
- **Automated Cashflow Ledger:** Log income streams and categorize expenses with smart auto-tagging.
- **Fire Calculator & Runway Simulator:** Project your exact financial independence date based on savings rate.
- **Multi-Currency & Asset Allocation:** Track stocks, crypto, real estate equity, and cash reserves in real time.
- **Interactive Visual Analytics:** Executive financial graphs, month-over-month burn rate comparisons, and annual summaries.

### What is Included
1. Google Sheets Template (1-Click Google Drive Copy)
2. Microsoft Excel (.xlsx) Formatted Workbook
3. Formula Audit & Customization Video Documentation
4. Unlimited Lifetime Currency Updates & Revisions`,
    price: '$39',
    originalPrice: '$69',
    discountPercentage: 43,
    isDiscounted: true,
    category: 'Sheets & Finance',
    badge: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    ],
    purchaseLink: 'https://gumroad.com',
    features: [
      'Google Sheets & Excel Ready',
      'Interactive Financial Visuals',
      'Automated Fire Calculator',
      'Zero Formula Knowledge Required',
    ],
    status: 'active',
    createdAt: '2026-03-24',
  },
];

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
    brandName: 'WebCraft',
    brandAccent: 'Goods',
    brandDescription: 'WebCraft Goods engineers elite digital templates, Notion systems, and developer boilerplates for modern professionals and teams.',
    contactEmail: 'support@webcraftgoods.com',
    showContactEmail: true,
    copyrightText: '© {year} WebCraft Goods Inc. All rights reserved.',
    badgeText: 'Curated Digital Assets',
    showNewsletter: true,
    newsletterTitle: 'Get 20% Off Your First Digital Good',
    newsletterSubtitle: 'Join 45,000+ creators receiving our weekly releases, templates, and creator perks.',
    newsletterButtonText: 'Subscribe',
    newsletterPlaceholder: 'Enter your work email...',
    showColumn1: true,
    column1Title: 'Marketplace',
    column1Links: [
      { id: 'col1-1', label: 'All Products', href: '#products' },
      { id: 'col1-2', label: 'Notion Planners', href: '#products' },
      { id: 'col1-3', label: 'UI Kits & Design', href: '#products' },
      { id: 'col1-4', label: 'Financial Models', href: '#products' },
    ],
    showColumn2: true,
    column2Title: 'Company',
    column2Links: [
      { id: 'col2-1', label: 'About Us', href: '#about' },
      { id: 'col2-2', label: 'Key Features', href: '#features' },
      { id: 'col2-3', label: 'FAQ & Licensing', href: '#faq' },
      { id: 'col2-4', label: 'Direct Support', href: '#contact' },
    ],
    showColumn3: true,
    column3Title: 'Admin & Governance',
    column3Text: 'Protected by Firebase Authentication with real-time Firestore database synchronization.',
    column3ButtonText: 'Open Admin CMS Portal',
    column3ButtonHref: '#admin',
    column3ActionType: 'admin',
    showSocialLinks: true,
    socialLinks: {
      twitter: 'https://twitter.com',
      github: 'https://github.com',
      dribbble: 'https://dribbble.com',
      linkedin: 'https://linkedin.com',
      discord: 'https://discord.com',
      youtube: 'https://youtube.com',
      instagram: 'https://instagram.com',
    },
    showTrustBadges: true,
    trustBadges: [
      { id: 'tb-1', label: 'Instant Download', sublabel: 'Direct file access', icon: 'Download' },
      { id: 'tb-2', label: 'Commercial License', sublabel: 'Client & personal use', icon: 'ShieldCheck' },
      { id: 'tb-3', label: 'Free Updates', sublabel: 'Lifetime revisions', icon: 'RefreshCw' },
      { id: 'tb-4', label: 'Verified Code', sublabel: 'Zero bloat', icon: 'Sparkles' },
    ],
    showPaymentMethods: true,
    showThemeIndicator: true,
    showModeToggle: true,
    showBackToTop: true,
    legalLinks: [
      { id: 'll-1', label: 'Privacy Policy', href: '#privacy' },
      { id: 'll-2', label: 'Terms of Service', href: '#terms' },
      { id: 'll-3', label: 'License Terms', href: '#license' },
      { id: 'll-4', label: 'Security', href: '#security' },
    ],
  },
  theme: {
    activeThemeId: 'amber-gold',
    defaultMode: 'dark',
    allowUserModeToggle: true,
  },
};
