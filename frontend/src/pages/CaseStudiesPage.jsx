import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronDown, ChevronUp, ArrowRight, Star, Sparkles, HelpCircle, Bookmark, Crown } from 'lucide-react';
import { Card, Badge, SectionTitle, CompanyLogo } from '../components/ui/Components';
import { useAuth } from '../context/AuthContext';

export const CaseStudiesPage = () => {
  const navigate = useNavigate();
  const { isPro } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const withCaseStudies = data.filter(c => c && c.caseStudy && c.caseStudy.fullCaseStudy);
          setCompanies(withCaseStudies);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching list:', err);
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseStudy.problem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (slug) => {
    if (expandedId === slug) {
      setExpandedId(null);
      return;
    }

    if (!isPro) {
      const viewed = JSON.parse(localStorage.getItem('freeViewedCaseStudies') || '[]');
      if (!viewed.includes(slug)) {
        if (viewed.length >= 10) {
          setShowUpgradeModal(true);
          return;
        }
        const updated = [...viewed, slug];
        localStorage.setItem('freeViewedCaseStudies', JSON.stringify(updated));
      }
    }

    setExpandedId(slug);
  };

  const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Page Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#48d2e1]/10 border-2 border-black rounded-full mb-4 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <BookOpen className="w-4 h-4 text-black" />
          <span className="text-[10px] font-black uppercase tracking-wider text-black">Deep-Dive Analytics</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">1,000+ Word Startup Case Studies</h1>
        <p className="text-slate-500 font-semibold text-sm max-w-xl mx-auto">
          Read highly detailed, operational breakdown analyses of legendary Indian startups. Learn their problem statements, solutions, pivots, and ultimate lessons.
        </p>
      </motion.div>

      {/* Search Bar (Neo-brutalist styling) */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8 max-w-xl mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search case studies by company name, industry, or strategy..."
          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold focus:outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-slate-400"
        />
      </motion.div>

      {/* Loader */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border-2 border-black rounded-2xl p-6 h-40 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/4 bg-slate-100 rounded" />
                  <div className="h-6 w-1/2 bg-slate-200 rounded" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => {
              const isExpanded = expandedId === company.slug;
              return (
                <motion.div
                  key={company.slug}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden flex flex-col"
                >
                  {/* Horizontal Card Header Layout */}
                  <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b-2 border-transparent last:border-b-0">
                    <div className="flex items-start md:items-center gap-5 flex-1">
                      <CompanyLogo 
                        company={company} 
                        className="w-16 h-16 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-transform" 
                        onClick={() => navigate(`/company/${company.slug}`)} 
                      />

                      {/* Header details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <h2 
                            onClick={() => navigate(`/company/${company.slug}`)}
                            className="text-lg font-black text-slate-900 cursor-pointer hover:text-indigo-650 transition-colors truncate"
                          >
                            {company.name}
                          </h2>
                          <Badge variant="indigo">{company.industry}</Badge>
                        </div>
                        <p className="text-slate-655 text-xs font-semibold leading-relaxed line-clamp-2 md:line-clamp-1 mb-1">
                          <strong className="text-black font-extrabold">Problem: </strong> {company.caseStudy.problem}
                        </p>
                        <p className="text-slate-655 text-xs font-semibold leading-relaxed line-clamp-2 md:line-clamp-1">
                          <strong className="text-emerald-700 font-extrabold">Solution: </strong> {company.caseStudy.solution}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-black/5 pt-4 md:pt-0">
                      <button
                        onClick={() => navigate(`/company/${company.slug}`)}
                        className="flex items-center gap-1.5 text-xs font-black text-black hover:text-indigo-650 border border-black/10 hover:border-black bg-slate-50 px-3.5 py-2 rounded-lg transition-all"
                      >
                        Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleExpand(company.slug)}
                        className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                          isExpanded 
                            ? 'bg-black text-white' 
                            : 'bg-[#48d2e1] text-black hover:bg-[#35d5e5]'
                        }`}
                      >
                        {isExpanded ? (
                          <>Collapse <ChevronUp className="w-4 h-4 stroke-[2.5]" /></>
                        ) : (
                          <>Read Study <ChevronDown className="w-4 h-4 stroke-[2.5]" /></>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable 1,000-Word Case Study Container */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50/50 border-t-2 border-black"
                      >
                        <div className="p-8 max-w-3xl mx-auto space-y-6">
                          {/* Case Study Meta Badges */}
                          <div className="grid grid-cols-2 gap-4 border-2 border-black rounded-xl p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6 text-center">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Key Outcome</p>
                              <p className="text-xs font-black text-slate-900 leading-snug">{company.caseStudy.outcome}</p>
                            </div>
                            <div className="border-l-2 border-black">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Core Learning</p>
                              <p className="text-xs font-black text-slate-900 leading-snug">{company.caseStudy.lessons}</p>
                            </div>
                          </div>

                          {/* 1000-Word Article Narrative */}
                          <div className="prose prose-slate max-w-none">
                            <h3 className="text-base font-black text-slate-900 mb-4 border-b-2 border-black pb-1.5 inline-block">
                              Full Strategic Analysis
                            </h3>
                            <div className="space-y-5 text-sm text-slate-700 leading-relaxed font-medium">
                              {company.caseStudy.fullCaseStudy.split('\n\n').map((paragraph, pIdx) => {
                                if (paragraph.startsWith('First,') || paragraph.startsWith('Second,') || paragraph.startsWith('Third,')) {
                                  return (
                                    <div key={pIdx} className="bg-white border-2 border-black rounded-lg p-4 my-3 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                                      <div className="w-5 h-5 rounded bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                        {pIdx}
                                      </div>
                                      <p className="text-slate-800 text-xs font-bold leading-normal m-0">
                                        {paragraph}
                                      </p>
                                    </div>
                                  );
                                }
                                return (
                                  <p key={pIdx} className="first-letter:text-2xl first-letter:font-black first-letter:text-indigo-650 first-letter:mr-1">
                                    {paragraph}
                                  </p>
                                );
                              })}
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="border-t border-black/10 pt-5 flex justify-end gap-3">
                            <button
                              onClick={() => toggleExpand(company.slug)}
                              className="text-xs font-black text-slate-650 hover:text-black transition-colors"
                            >
                              Close Case Study
                            </button>
                            <button
                              onClick={() => navigate(`/company/${company.slug}`)}
                              className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                            >
                              Unlock Ai Founder Q&A <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center bg-white border-2 border-black rounded-2xl p-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <BookOpen className="w-12 h-12 text-slate-350 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-900 mb-1">No case studies found</h3>
              <p className="text-slate-400 font-bold text-xs">Try searching for other terms like 'fintech' or 'logistics'.</p>
            </div>
          )}
        </div>
      )}

      {/* Modern, gorgeous Neo-Brutalist Premium Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-black rounded-3xl p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-black font-black text-lg"
              >
                ✕
              </button>
              <div className="w-16 h-16 bg-amber-400 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                <Crown className="w-8 h-8 text-black fill-amber-950 stroke-black" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Monthly Free Limit Reached!</h3>
              <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-6 font-medium">
                You've unlocked your 10 free case study reads for this month. Upgrade to <strong className="text-black font-black">StartupIntel Pro</strong> to get unlimited access to all 600+ deep-dives, simulations, and financial models!
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setShowUpgradeModal(false); navigate('/pricing'); }}
                  className="w-full bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black py-3 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Crown className="w-4 h-4 text-amber-950 fill-amber-950 stroke-black" /> Upgrade to Pro
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-black py-2.5 border-2 border-black rounded-xl text-xs transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
