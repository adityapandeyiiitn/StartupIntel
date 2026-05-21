import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, ArrowRight, Trash2, ShieldCheck, Zap, Heart } from 'lucide-react';
import { Card, Badge, SectionTitle, CompanyLogo } from '../components/ui/Components';
import { API_URL } from '../config';

export const SavedPage = () => {
  const navigate = useNavigate();
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync bookmarks from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedCompanies') || '[]');
    setBookmarkedSlugs(saved);

    setLoading(true);
    fetch(`${API_URL}/api/companies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCompanies(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching companies:', err);
        setLoading(false);
      });
  }, []);

  const handleRemoveBookmark = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = bookmarkedSlugs.filter(s => s !== slug);
    setBookmarkedSlugs(updated);
    localStorage.setItem('bookmarkedCompanies', JSON.stringify(updated));
  };

  // Filter companies that match bookmarks
  const savedCompanies = companies.filter(c => bookmarkedSlugs.includes(c.slug));

  const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Page Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#48d2e1]/10 border-2 border-black rounded-full mb-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <Bookmark className="w-4 h-4 text-black fill-black" />
          <span className="text-[10px] font-black uppercase tracking-wider text-black">Personal Watchlist</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Your Saved Startups</h1>
        <p className="text-slate-500 font-semibold text-sm max-w-xl mx-auto">
          Deep-dive analysis quick-access drawer. Track metrics, simulate outcomes, and compare battlecards of your curated list.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border-2 border-black rounded-2xl p-6 h-48 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          ))}
        </div>
      ) : (
        <div>
          {savedCompanies.length > 0 ? (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {savedCompanies.map(company => (
                <motion.div
                  key={company.slug}
                  variants={fadeUp}
                  className="bg-white border-2 border-black rounded-2xl shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <Link to={`/company/${company.slug}`} className="block p-5 flex-1 no-underline text-inherit">
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <CompanyLogo company={company} className="w-12 h-12 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform" />
                      <button
                        onClick={(e) => handleRemoveBookmark(e, company.slug)}
                        title="Remove from saved"
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-black/10 hover:border-rose-300 rounded-lg text-slate-450 hover:text-rose-600 transition-colors shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-650 transition-colors mb-1 truncate">{company.name}</h3>
                      <Badge variant="indigo" className="mb-3 inline-block">{company.industry}</Badge>
                      <p className="text-slate-500 font-semibold text-xs leading-relaxed line-clamp-2">{company.tagline}</p>
                    </div>

                    {/* Compact stats row */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-black/5 text-center bg-slate-50/50 rounded-lg p-2">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Revenue</span>
                        <span className="text-xs font-black text-slate-900">{company.stats?.revenue || 'N/A'}</span>
                      </div>
                      <div className="border-l border-black/10">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Funding</span>
                        <span className="text-xs font-black text-slate-900">{company.stats?.funding || 'N/A'}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Neo-brutalist action link */}
                  <Link 
                    to={`/company/${company.slug}`} 
                    className="block bg-[#48d2e1]/10 group-hover:bg-[#48d2e1]/20 border-t-2 border-black py-2.5 text-center text-xs font-black text-black transition-colors"
                  >
                    Deep-Dive Analysis ↗
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeUp} 
              className="text-center bg-white border-2 border-black rounded-2xl p-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-lg mx-auto"
            >
              <div className="w-14 h-14 bg-indigo-50 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Bookmark className="w-6 h-6 text-indigo-500 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No bookmarked startups</h3>
              <p className="text-slate-450 font-bold text-xs max-w-sm mx-auto leading-relaxed mb-8">
                Bookmark interesting companies during your exploration to build a curated research list and run dynamic pro-suite calculators.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black border-2 border-black px-6 py-3 rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 mx-auto"
              >
                Start Exploring <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
