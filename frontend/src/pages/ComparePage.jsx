import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GitCompare, ChevronDown, Plus, Trash2, Shield, Crown, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Components';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config.js';

export const ComparePage = () => {
  const { slug1, slug2 } = useParams();
  const navigate = useNavigate();
  const { isPro, token } = useAuth();
  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedSlugs, setSelectedSlugs] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Initialize selected slugs from path parameters
  useEffect(() => {
    const initial = [];
    if (slug1) initial.push(slug1);
    if (slug2) initial.push(slug2);
    setSelectedSlugs(initial);
  }, [slug1, slug2]);

  // Load all companies for selector dropdowns
  useEffect(() => {
    fetch(`${API_URL}/api/companies`)
      .then(r => r.json())
      .then(d => setAllCompanies(d))
      .catch(console.error);
  }, []);

  // Fetch comparison data for all selected slugs
  useEffect(() => {
    if (selectedSlugs.length < 2) {
      setComparisonData([]);
      return;
    }
    setLoading(true);
    const query = selectedSlugs.join(',');
    fetch(`${API_URL}/api/companies/compare-multi?slugs=${query}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(r => {
        if (!r.ok) throw new Error('Multi-compare request failed');
        return r.json();
      })
      .then(d => {
        setComparisonData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedSlugs, token]);

  const handleAddCompany = (slug) => {
    if (!slug) return;
    if (selectedSlugs.includes(slug)) return;

    if (!isPro && selectedSlugs.length >= 2) {
      setShowUpgradeModal(true);
      return;
    }

    if (selectedSlugs.length >= 10) {
      alert('You can compare a maximum of 10 startups simultaneously.');
      return;
    }

    setSelectedSlugs(prev => [...prev, slug]);
  };

  const handleRemoveCompany = (slug) => {
    setSelectedSlugs(prev => prev.filter(s => s !== slug));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-cyan-500 transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Explore
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Compare Startups</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isPro 
                ? 'Compare up to 10 startups side-by-side with full Pro metrics' 
                : 'Compare up to 2 startups side-by-side. Upgrade to compare up to 10.'}
            </p>
          </div>
        </div>

        {/* Upgrade Callout if not Pro */}
        {!isPro && (
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-white" /> Upgrade to Pro for 10-way comparison
          </button>
        )}
      </div>

      {/* Company Selector Grid */}
      <Card className="mb-6 p-6" noHover>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSlugs.map(slug => {
            const comp = allCompanies.find(c => c.slug === slug) || { name: slug };
            return (
              <div key={slug} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
                <span className="text-sm font-semibold text-slate-700">{comp.name}</span>
                <button onClick={() => handleRemoveCompany(slug)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
          {selectedSlugs.length === 0 && (
            <span className="text-sm text-slate-400 py-1.5">No startups selected. Select below to begin comparison.</span>
          )}
        </div>

        <div className="relative max-w-md">
          <select
            onChange={e => {
              handleAddCompany(e.target.value);
              e.target.value = '';
            }}
            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/25 focus:border-cyan-500 transition-all text-sm cursor-pointer"
          >
            <option value="">+ Add startup to compare...</option>
            {allCompanies.map(c => (
              <option key={c.slug} value={c.slug} disabled={selectedSlugs.includes(c.slug)}>
                {c.name} ({c.industry})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-24 text-slate-400 animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Generating comparative audit...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && comparisonData.length < 2 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GitCompare className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-slate-700 font-bold text-lg">Compare Startups Side-by-Side</p>
          <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto px-4">
            Add at least two startups from the list above to compare their funding, valuation, unit economics, and growth metrics.
          </p>
        </div>
      )}

      {/* Dynamic Comparison Matrix */}
      {!loading && comparisonData.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest w-64 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">Metric / Dimension</th>
                {comparisonData.map(comp => (
                  <th key={comp.slug} className="p-5 text-left border-r border-slate-200 last:border-r-0 min-w-[250px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg p-1.5 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {comp.logoUrl ? (
                          <img src={comp.logoUrl} alt={comp.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-base font-black text-cyan-600">{comp.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{comp.name}</h3>
                        <span className="inline-block text-[10px] bg-cyan-500/10 text-cyan-600 rounded px-1.5 py-0.5 font-bold mt-0.5">{comp.industry}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category: Financial Metrics */}
              <tr className="bg-slate-100/50">
                <td colSpan={comparisonData.length + 1} className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5 border-b border-slate-200 bg-slate-100/50 sticky left-0">Key Financials</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Founded</td>
                {comparisonData.map(c => <td key={c.slug} className="p-4 text-sm text-slate-800 border-r border-slate-200 last:border-r-0 font-medium">{c.stats?.founded || 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Annual Revenue</td>
                {comparisonData.map(c => <td key={c.slug} className="p-4 text-sm text-slate-800 border-r border-slate-200 last:border-r-0 font-bold text-cyan-600">{c.stats?.revenue || 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Total Funding</td>
                {comparisonData.map(c => <td key={c.slug} className="p-4 text-sm text-slate-800 border-r border-slate-200 last:border-r-0 font-medium">{c.stats?.funding || 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Scale / Active Users</td>
                {comparisonData.map(c => <td key={c.slug} className="p-4 text-sm text-slate-800 border-r border-slate-200 last:border-r-0 font-medium">{c.stats?.users || 'N/A'}</td>)}
              </tr>

              {/* Category: Strategy & SWOT */}
              <tr className="bg-slate-100/50">
                <td colSpan={comparisonData.length + 1} className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5 border-b border-slate-200 bg-slate-100/50 sticky left-0">Business Model & SWOT</td>
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Business Model</td>
                {comparisonData.map(c => <td key={c.slug} className="p-4 text-sm text-slate-600 border-r border-slate-200 last:border-r-0 leading-relaxed font-medium">{c.overview?.businessModel || 'N/A'}</td>)}
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Strengths</td>
                {comparisonData.map(c => (
                  <td key={c.slug} className="p-4 text-sm text-slate-700 border-r border-slate-200 last:border-r-0 leading-relaxed">
                    {c.swot ? (
                      <ul className="space-y-1">
                        {c.swot.strengths.slice(0, 3).map((s, i) => <li key={i} className="text-xs flex gap-1.5"><span className="text-emerald-500 font-bold">•</span>{s}</li>)}
                      </ul>
                    ) : (
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-1">🔒 Upgrade for SWOT</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Weaknesses</td>
                {comparisonData.map(c => (
                  <td key={c.slug} className="p-4 text-sm text-slate-700 border-r border-slate-200 last:border-r-0 leading-relaxed">
                    {c.swot ? (
                      <ul className="space-y-1">
                        {c.swot.weaknesses.slice(0, 3).map((w, i) => <li key={i} className="text-xs flex gap-1.5"><span className="text-rose-500 font-bold">•</span>{w}</li>)}
                      </ul>
                    ) : (
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-1">🔒 Upgrade for SWOT</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Category: Pro Analytics */}
              <tr className="bg-slate-100/50">
                <td colSpan={comparisonData.length + 1} className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-5 border-b border-slate-200 bg-slate-100/50 sticky left-0">Premium Strategic Lessons</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-500 uppercase bg-white sticky left-0 border-r border-slate-200">Founder Lessons</td>
                {comparisonData.map(c => (
                  <td key={c.slug} className="p-4 text-sm text-slate-700 border-r border-slate-200 last:border-r-0 leading-relaxed italic">
                    {c.founderInsights ? (
                      `"${c.founderInsights.lessons?.[0]}"`
                    ) : (
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-1">🔒 Pro Feature</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
            >
              {/* Premium Glow */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />

              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/20">
                <Crown className="w-7 h-7 text-slate-950" />
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">Unlock Multi-Startup Auditing</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Free plan users are restricted to side-by-side comparison of 2 startups. Upgrade to Pro to analyze up to 10 startups simultaneously.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    navigate('/pricing');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" /> Upgrade to Pro Now
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition-colors border border-white/5"
                >
                  No thanks, keep it simple
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
