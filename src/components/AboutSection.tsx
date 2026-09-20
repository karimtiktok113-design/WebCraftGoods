import React from 'react';
import { motion } from 'motion/react';
import { Target, Compass, Award, Users, Clock, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AboutSection: React.FC = () => {
  const { websiteContent } = useData();
  const about = websiteContent.about;

  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/80 w-full">
      {/* Background soft glow */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Mission/Vision */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col items-start w-full"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-4 shadow-sm shadow-amber-500/5">
              <Award className="w-3.5 h-3.5" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-4 sm:mb-6">
              {about.heading || 'About WebCraft Goods'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-6 sm:mb-8">
              {about.description}
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full mb-6 sm:mb-8">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 shadow-sm transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white font-heading mb-1.5">Our Mission</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {about.mission}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(99, 102, 241, 0.4)' }}
                transition={{ duration: 0.2 }}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white font-heading mb-1.5">Our Vision</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {about.vision}
                </p>
              </motion.div>
            </div>

            {/* Stat Counters */}
            {about.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 w-full pt-5 sm:pt-6 border-t border-slate-800/80">
                {about.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="p-2 sm:p-0"
                  >
                    <div className="text-lg sm:text-2xl font-black text-amber-400 font-heading whitespace-nowrap tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Visual Craft Photo Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative w-full mt-4 lg:mt-0"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group hover:border-amber-500/30 transition-colors duration-300">
              <img
                src={
                  about.brandImage ||
                  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
                }
                alt="WebCraft Goods Studio"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <div className="inline-block px-2.5 py-1 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-1.5 sm:mb-2 shadow-sm">
                  Craft First
                </div>
                <h4 className="text-base sm:text-lg font-bold font-heading">Digital Tools Made for High Output</h4>
                <p className="text-xs text-slate-300 font-light mt-1">
                  Built by senior software makers with love for clean ergonomics.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
