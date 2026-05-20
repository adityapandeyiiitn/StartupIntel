import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, SectionTitle } from '../components/ui/Components';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <SectionTitle 
          title="Get In Touch" 
          subtitle="Have questions about startup metrics, data accuracy, or premium plan features? Drop us a line."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Email Card */}
          <div className="bg-[#48d2e1]/10 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#48d2e1] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Direct Support</h3>
              <a 
                href="mailto:support.startupintel@gmail.com" 
                className="text-xs font-bold text-slate-700 hover:text-black hover:underline break-all mt-1 block"
              >
                support.startupintel@gmail.com
              </a>
            </div>
          </div>

          {/* Quick FAQ / Info Box */}
          <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-tight">Response Times</h3>
            <p className="text-xs text-slate-600 font-bold leading-relaxed mb-4">
              Our analyst team typically responds to all inquiries within <strong>12-24 business hours</strong>.
            </p>
            <div className="flex items-start gap-2 bg-amber-50 border border-black/10 rounded-lg p-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[10px] text-amber-950 font-bold leading-tight">
                Pro members receive prioritized response handling and SLA-backed support channels.
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {submitted ? (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-100 border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-xs text-slate-500 font-bold max-w-sm">
                  Thank you for reaching out. We have received your inquiry and will follow up with you at the email address provided.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-black text-black bg-[#48d2e1] hover:bg-[#35d5e5] border-2 border-black px-5 py-2.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[-1px]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-all text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-700 mb-1.5 block">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-all text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Inquiry Type</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-slate-900 font-bold outline-none focus:bg-slate-50 transition-all text-xs appearance-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Data Correction Request">Data Correction Request</option>
                    <option value="Premium Billing & Razorpay">Premium Billing & Razorpay</option>
                    <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                    <option value="Bug Report">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-all text-xs resize-none"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-650 bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#48d2e1] hover:bg-[#35d5e5] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
