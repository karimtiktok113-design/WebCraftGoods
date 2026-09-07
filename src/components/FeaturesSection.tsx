import React from 'react';
import {
  Zap,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Headphones,
  Code2,
  Cpu,
  Palette,
  CheckCircle,
  LucideIcon,
} from 'lucide-react';
import { useData } from '../context/DataContext';

// Map icon string names to Lucide icons
export const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  Headphones,
  Code2,
  Cpu,
  Palette,
  CheckCircle,
};

export const FeaturesSection: React.FC = () => {
  const { features } = useData();

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-900/40 relative border-t border-slate-800/80 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for Caliber</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-3 sm:mb-4">
            Why Creators & Founders Rely on WebCraft Goods
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            We build digital foundations that cut through noise, boost velocity, and scale seamlessly with your ambitions.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {features.map((feature) => {
            const IconComponent = ICON_MAP[feature.icon] || Sparkles;
            return (
              <div
                key={feature.id}
                id={`feature-card-${feature.id}`}
                className="group p-5 sm:p-8 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/30 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-500/5 transform hover:-translate-y-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight mb-2 sm:mb-3">
                  {feature.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
