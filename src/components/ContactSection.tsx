import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ContactSection: React.FC = () => {
  const { submitContactMessage, websiteContent } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-800/80 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold mb-4">
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Communication</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-3 sm:mb-4">
                Let's Build Something Exceptional
              </h2>

              <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 sm:mb-8">
                Inquire about custom digital product licenses, enterprise team tiers, or collaboration opportunities.
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">Email Inquiry</div>
                    <a
                      href={`mailto:${websiteContent.footer.contactEmail || 'support@webcraftgoods.com'}`}
                      className="text-sm font-semibold text-white hover:text-amber-400 transition-colors truncate block"
                    >
                      {websiteContent.footer.contactEmail || 'support@webcraftgoods.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Average Response Time</div>
                    <div className="text-sm font-semibold text-white">&lt; 2 hours during business days</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-xs text-slate-300">
              <span className="font-semibold text-amber-300 block mb-1">Looking for product custom tweaks?</span>
              Send us your Figma file or Notion workspace structure and our engineering team can provide tailor-made adjustments.
            </div>
          </div>

          {/* Right Column: Interactive Form Saved to Firestore */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl backdrop-blur-md">
              <h3 className="text-xl font-bold text-white font-heading mb-2">Send a Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                All submissions are securely written to our Firestore admin inbox in real-time.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <div className="font-bold">Message sent successfully!</div>
                    <div className="text-slate-400">Our team has received your note in Firestore and will reply shortly.</div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Commercial Licensing Inquiry"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're building or what questions you have..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  id="submit-contact-form-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    'Sending Message...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
