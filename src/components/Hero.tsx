import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download, Star, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Hero: React.FC = () => {
  const { websiteContent } = useData();
  const hero = websiteContent.hero;

  return (
    <section
      id="hero"
      className="relative min-h-0 sm:min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-slate-950 w-full"
    >
      {/* Dynamic Background Glows and Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      {/* Subtle Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide mb-4 sm:mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="line-clamp-1">{hero.badgeText || 'Curated Software & Digital Marketplace'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.18] sm:leading-[1.1] mb-4 sm:mb-6">
              {hero.heading}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg lg:text-xl text-slate-300 sm:text-slate-400 leading-relaxed max-w-2xl mb-6 sm:mb-8 font-light">
              {hero.subtitle}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <a
                id="hero-primary-cta"
                href={hero.primaryButtonLink || '#products'}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all text-center w-full sm:w-auto active:scale-[0.98] whitespace-nowrap"
              >
                <span>{hero.primaryButtonText || 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                id="hero-secondary-cta"
                href={hero.secondaryButtonLink || '#features'}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 font-semibold text-xs sm:text-sm transition-all hover:border-slate-600 text-center w-full sm:w-auto active:scale-[0.98] whitespace-nowrap"
              >
                <span>{hero.secondaryButtonText || 'Learn More'}</span>
              </a>
            </div>

            {/* Trust badges row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-6 pt-5 sm:pt-6 border-t border-slate-800/80 w-full max-w-lg">
              <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
                <Download className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant Digital Access</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Commercial License</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lifetime Updates</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Mockup Graphic & Floating Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center w-full mt-4 lg:mt-0">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 rounded-3xl blur-2xl transform rotate-3 scale-95 pointer-events-none" />

            {/* Main Showcase Card Container */}
            <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-2xl p-3.5 sm:p-4 backdrop-blur-xl group hover:border-slate-700 transition-all duration-300">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 tracking-wide bg-slate-950/60 px-2.5 py-0.5 rounded-md border border-slate-800">
                  webcraft-goods-v2.6
                </div>
              </div>

              {/* 1:1 Aspect Ratio Product Mockup Window */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={
                    hero.heroImage ||
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'
                  }
                  alt="WebCraft Goods Digital Showcase"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />

                {/* Overlay card info */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-white gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block whitespace-nowrap">
                      Signature Release
                    </span>
                    <h4 className="text-xs sm:text-base font-bold font-heading truncate">Executive Command OS</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block whitespace-nowrap">Starting at</span>
                    <span className="text-base sm:text-lg font-black text-amber-400 font-heading whitespace-nowrap tabular-nums">$49</span>
                  </div>
                </div>
              </div>

              {/* Floating Metric Card 1 (Top Right - Desktop) */}
              <div className="absolute -top-5 -right-5 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3 animate-bounce-slow">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Customer Growth</div>
                  <div className="text-xs font-bold text-white font-heading whitespace-nowrap tabular-nums">+184% Speed</div>
                </div>
              </div>

              {/* Floating Metric Card 2 (Bottom Left - Desktop) */}
              <div className="absolute -bottom-5 -left-5 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Verified Reviews</div>
                  <div className="text-xs font-bold text-amber-400 font-heading whitespace-nowrap tabular-nums">4.9 / 5.0 Rating</div>
                </div>
              </div>
            </div>

            {/* Mobile Metric Cards (Displayed cleanly below mockup on mobile) */}
            <div className="sm:hidden grid grid-cols-2 gap-2.5 mt-4 w-full max-w-md">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-medium whitespace-nowrap">Execution</div>
                  <div className="text-[11px] font-bold text-white font-heading whitespace-nowrap tabular-nums">+184% Speed</div>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-medium whitespace-nowrap">Rating</div>
                  <div className="text-[11px] font-bold text-amber-400 font-heading whitespace-nowrap tabular-nums">4.9 / 5.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
