import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { label: 'Company Profiles', free: true, pro: true, detail: 'Full company data & case studies' },
  { label: 'Search & Filter', free: true, pro: true, detail: 'Find companies by name or industry' },
  { label: 'Basic Compare (2 companies)', free: true, pro: true, detail: 'Side-by-side company comparison' },
  { label: 'Revenue Charts', free: true, pro: true, detail: 'Interactive revenue growth charts' },
  { label: 'Case Studies', free: '3/month', pro: true, detail: 'Full 1000-word founder case studies' },
  { label: 'Advanced Compare (5 companies)', free: false, pro: true, detail: 'Multi-company comparison matrix' },
  { label: 'AI Founder Q&A', free: false, pro: true, detail: 'Ask questions, get AI-powered insights' },
  { label: 'Investor Intelligence', free: false, pro: true, detail: 'VC portfolio & investment patterns' },
  { label: 'AI VC Matchmaker', free: false, pro: true, detail: 'Simulate investor fits based on operating data' },
  { label: 'Export Reports (PDF)', free: false, pro: true, detail: 'Download full company reports as PDF' },
  { label: 'Competitor Battlecards', free: false, pro: true, detail: 'Deep competitor analysis matrices' },
  { label: 'Financial Modelling', free: false, pro: true, detail: 'P&L projections & scenario modelling' },
  { label: 'Sector Reports', free: false, pro: true, detail: 'Monthly industry trend reports' },
  { label: 'Early Access Companies', free: false, pro: true, detail: 'New companies added 2 weeks early' },
  { label: 'Priority Support', free: false, pro: true, detail: 'Dedicated Slack & email support' },
];

const FeatureCell = ({ value }) => {
  if (value === true) return <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" /></div></div>;
  if (value === false) return <div className="flex justify-center"><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><X className="w-3.5 h-3.5 text-slate-300 stroke-[2.5]" /></div></div>;
  return <div className="flex justify-center"><span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{value}</span></div>;
};

export const PricingPage = () => {
  const navigate = useNavigate();
  const { user, isPro } = useAuth();
  const [billing, setBilling] = useState('annual'); // monthly | annual

  const monthlyPrice = billing === 'annual' ? 499 : 699;
  const annualPrice = billing === 'annual' ? 499 * 12 : null;
  const savings = billing === 'annual' ? Math.round(((699 - 499) / 699) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-[#48d2e1]/20 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full mb-4 border-2 border-black">
          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" /> Upgrade to Pro
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-slate-500 max-w-xl mx-auto font-semibold">Get the unfair advantage. Access AI insights, financial models, and deep-dive analytics used by India's top founders and analysts.</p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-slate-100 rounded-xl p-1.5 mt-6 gap-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {['monthly', 'annual'].map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-lg text-sm font-black transition-all border ${billing === b ? 'bg-black text-white border-black shadow-sm' : 'text-slate-600 hover:text-slate-900 border-transparent'}`}
            >
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && <span className="ml-1.5 text-xs text-amber-950 font-black bg-amber-400 border border-black px-1.5 py-0.5 rounded-full">-{savings}%</span>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Free */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border-2 border-black p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-black text-slate-900">Free</h2>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-5">Everything you need to get started</p>
            <div className="mb-5">
              <span className="text-4xl font-black text-slate-900">₹0</span>
              <span className="text-slate-500 text-sm ml-2 font-bold">forever</span>
            </div>
          </div>
          <button
            onClick={() => !user ? navigate('/login') : null}
            className={`w-full py-3 rounded-xl font-black text-sm border-2 border-black transition-all ${user ? 'bg-slate-100 text-slate-500 border-black/10 cursor-default' : 'bg-[#48d2e1] hover:bg-[#35d5e5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            {user ? 'Current Plan' : 'Get Started Free'}
          </button>
        </motion.div>

        {/* Pro */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#48d2e1] rounded-2xl border-2 border-black p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-black flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-450 stroke-black" />
                <h2 className="text-lg font-black text-black">Pro</h2>
              </div>
              <span className="text-xs font-black bg-amber-400 text-black border border-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Star className="w-3 h-3 fill-black stroke-black" /> Most Popular
              </span>
            </div>
            <p className="text-slate-950 font-bold text-sm mb-5">For serious founders and analysts</p>
            <div className="mb-5">
              <span className="text-4xl font-black text-black">₹{monthlyPrice}</span>
              <span className="text-slate-950 text-sm ml-2 font-bold">/month</span>
              {billing === 'annual' && <p className="text-slate-900 text-xs font-black mt-1">Billed ₹{annualPrice?.toLocaleString('en-IN')} annually</p>}
            </div>
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="w-full py-3 rounded-xl font-black text-sm bg-white text-black border-2 border-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            {isPro ? 'You\'re Pro 🎉' : <><span>Upgrade to Pro</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </motion.div>
      </div>

      {/* Feature comparison table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-12">
        <div className="grid grid-cols-3 bg-slate-50 border-b-2 border-black px-6 py-4">
          <div className="text-sm font-black text-slate-900">Feature</div>
          <div className="text-sm font-black text-slate-600 text-center">Free</div>
          <div className="text-sm font-black text-black text-center flex items-center justify-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 stroke-black" /> Pro
          </div>
        </div>
        {features.map((f, i) => (
          <div key={i} className={`grid grid-cols-3 px-6 py-3.5 items-center ${i % 2 === 0 ? '' : 'bg-slate-50/50'} border-b border-black/10 last:border-0`}>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-tight">{f.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-semibold">{f.detail}</p>
            </div>
            <FeatureCell value={f.free} />
            <FeatureCell value={f.pro} />
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-10">
        <button
          onClick={() => navigate('/payment')}
          className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black px-8 py-3.5 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-2 transition-all"
        >
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400 stroke-black" /> Upgrade to Pro Now <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
