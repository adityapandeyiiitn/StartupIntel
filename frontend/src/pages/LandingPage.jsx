import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, TrendingUp, Search, X, Sparkles, ShieldCheck,
  Zap, Target, HelpCircle, Award, CheckCircle, BarChart3, Lock, Crown
} from 'lucide-react';
import { Card, Badge, CompanyLogo } from '../components/ui/Components';
import { useAuth } from '../context/AuthContext';

const industryColors = {
  'Food Delivery & Dining': 'emerald',
  'Food Delivery & Quick Commerce': 'emerald',
  'Quick Commerce': 'amber',
  'Fintech & Lifestyle': 'cyan',
  'Fintech & Payments Infrastructure': 'cyan',
  'Social Commerce & E-commerce': 'amber',
  'Fintech & Digital Payments': 'cyan',
  'Mobility & Transportation': 'amber',
  'E-commerce & Retail Tech': 'amber',
};

export const LandingPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isPro } = useAuth();

  // VC Matchmaker State (Pro Feature)
  const [founderARR, setFounderARR] = useState(50); // in Lakhs
  const [founderTeam, setFounderTeam] = useState(5);
  const [founderCAGR, setFounderCAGR] = useState(40); // %
  const [matchResults, setMatchResults] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  // Sync with URL param from topbar search
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => { setCompanies(data); setLoading(false); })
      .catch(err => { console.error('Error fetching companies:', err); setLoading(false); });
  }, []);

  const filteredCompanies = companies.filter(company =>
    !searchQuery ||
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.tagline && company.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const handleMatchmake = async () => {
    setIsMatching(true);
    setMatchResults(null);
    await new Promise(r => setTimeout(r, 1600));

    // Calculate simulated fit index scores
    const accelScore = Math.min(Math.round(45 + (founderCAGR * 0.8) + (founderARR * 0.2)), 98);
    const sequoiaScore = Math.min(Math.round(30 + (founderCAGR * 1.1) + (founderTeam * 1.5)), 99);
    const tigerScore = Math.min(Math.round(20 + (founderARR * 0.9) + (founderCAGR * 0.4)), 97);

    setMatchResults([
      { name: 'Accel Partners', score: accelScore, tier: 'Tier-1 Early Stage', focus: 'B2B & Fintech SaaS' },
      { name: 'Peak XV (Sequoia)', score: sequoiaScore, tier: 'Tier-1 Multi-stage', focus: 'Consumer & Deeptech' },
      { name: 'Tiger Global', score: tigerScore, tier: 'Growth Equity', focus: 'Hyperscale E-Commerce' }
    ]);
    setIsMatching(false);
  };

  return (
    <div className="w-full bg-[#48d2e1] min-h-screen border-l-2 border-black flex flex-col">
      <div className="w-full max-w-5xl mx-auto px-8 py-12 flex-1">
        
        {/* ── LOGO BRANDING HERO BANNER (Matches Uploaded Image 100% exactly) ── */}
        <div className="relative flex flex-col items-center justify-center w-full text-center select-none mb-14 mt-4">
          {/* Main Logo Text with exact fonts & colors per letter */}
          <div 
            className="flex items-center justify-center tracking-normal leading-none font-black text-5xl sm:text-6xl md:text-8xl mb-2 sm:mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {/* S T A R T (White) */}
            <span className="text-white">S</span>
            <span className="text-white">T</span>
            <span className="text-white">A</span>
            <span className="text-white">R</span>
            <span className="text-white">T</span>

            {/* U P (Black) */}
            <span className="text-black">U</span>
            <span className="text-black">P</span>

            {/* I N T (White) */}
            <span className="text-white ml-[2px] sm:ml-[4px]">I</span>
            <span className="text-white">N</span>
            <span className="text-white">T</span>

            {/* E (White stenciled bars - Custom vector stenciled to match height exactly) */}
            <svg 
              className="h-[0.72em] w-[0.58em] mx-[0.04em] flex-shrink-0 self-center" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="2.5" width="24" height="3" rx="0.5" fill="white" />
              <rect y="10.5" width="24" height="3" rx="0.5" fill="white" />
              <rect y="18.5" width="24" height="3" rx="0.5" fill="white" />
            </svg>

            {/* L (White) */}
            <span className="text-white">L</span>
          </div>
          
          {/* Tagline matching image 100% in spacing, font & thin line design */}
          <div className="flex items-center gap-4 w-full max-w-[280px] sm:max-w-lg md:max-w-xl justify-center mt-2">
            {/* Left bracket line */}
            <div className="flex items-center flex-1">
              <div className="w-[2px] h-[10px] bg-black flex-shrink-0" />
              <div className="h-[2px] bg-black flex-1" />
            </div>
            <span 
              className="text-[9px] sm:text-[11px] md:text-sm font-bold text-black tracking-[0.25em] whitespace-nowrap uppercase"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              KNOW WHAT WORKS BEFORE YOU BUILD.
            </span>
            {/* Right bracket line */}
            <div className="flex items-center flex-1">
              <div className="h-[2px] bg-black flex-1" />
              <div className="w-[2px] h-[10px] bg-black flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* ── SEARCH PANEL (With Neo-brutalist bold black borders & solid shadow) ── */}
        <div className="relative max-w-2xl mx-auto mb-14">
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Search className="w-5 h-5 text-slate-500 ml-4 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchParams(e.target.value ? { search: e.target.value } : {}); }}
              placeholder="Search 100+ companies by name, industry, tech stack or founders..."
              className="flex-1 bg-transparent px-4 py-4 text-slate-950 placeholder:text-slate-500 outline-none text-sm font-semibold"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="mr-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <button className="bg-black hover:bg-slate-900 transition-colors text-white px-6 py-4 text-sm font-black border-l-2 border-black">
              Search Intel
            </button>
          </div>
        </div>

        {/* ── HOW IT WORKS / APP BRIEF ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
          {[
            { icon: ShieldCheck, title: 'SWOT Battlecards', text: 'Detailed breakdown of structural strengths, internal bottlenecks & external market hazards.', color: 'text-black' },
            { icon: Zap, title: 'Projections Simulator', titleAdd: 'PRO', text: 'Modify CAGR growth, net margins and target CAC via slider widgets to model valuations.', color: 'text-amber-600' },
            { icon: Target, title: 'AI Founder Chat', titleAdd: 'PRO', text: 'Interrogate simulated company founders regarding unit economics, pricing and failures.', color: 'text-black' },
            { icon: Award, title: 'Real-world Logos', text: 'High-res dynamic favicons showing verified visual indicators for immediate brand recall.', color: 'text-emerald-700' },
          ].map((item, i) => (
            <Card key={i} className="p-5 border-2 border-black bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <h3 className="font-black text-slate-950 text-xs flex items-center gap-1.5">
                  {item.title}
                  {item.titleAdd && <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded font-black border border-amber-300"><Crown className="w-2 h-2 inline" /></span>}
                </h3>
              </div>
              <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>

        {/* ── STARTUPS GRID ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-black" />
              <h2 className="text-base font-black text-slate-950">
                {searchQuery
                  ? `${filteredCompanies.length} result${filteredCompanies.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : 'Trending Startup Audits'}
              </h2>
            </div>
            {!searchQuery && (
              <span className="text-xs text-slate-950 font-bold bg-white/40 px-2 py-0.5 rounded border border-black/10">{companies.length} startups aggregate</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 bg-slate-100 border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Search className="w-7 h-7 text-slate-900" />
              </div>
              <p className="text-slate-950 font-black mb-1">No companies found</p>
              <p className="text-slate-500 text-sm">Try searching for "PhonePe", "Zoho", or "CRED"</p>
              <button onClick={clearSearch} className="mt-4 text-sm text-black font-black hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, idx) => (
                <motion.div
                  key={company.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link to={`/company/${company.slug}`} className="block h-full no-underline">
                    <Card
                      className="group flex flex-col h-full cursor-pointer border-2 border-black bg-white rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-300"
                    >
                      {/* Logo + Name */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={company} className="w-11 h-11" />
                          <div>
                            <h3 className="font-extrabold text-slate-950 text-sm group-hover:text-black transition-colors leading-tight">
                              {company.name}
                            </h3>
                            <p className="text-[9px] text-slate-500 mt-0.5 font-black uppercase tracking-wider">{company.industry}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>

                      <p className="text-slate-600 text-xs font-semibold leading-relaxed mb-5 flex-1 line-clamp-2">
                        {company.tagline}
                      </p>

                      {/* Stats Footer */}
                      <div className="flex items-center gap-3 pt-4 border-t border-black/10">
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Revenue</p>
                          <p className="text-xs font-black text-slate-950">{company.stats?.revenue}</p>
                        </div>
                        <div className="w-px h-8 bg-black/10" />
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5">Funding</p>
                          <p className="text-xs font-black text-slate-950">{company.stats?.funding}</p>
                        </div>
                        <div className="w-px h-8 bg-black/10" />
                        <Badge variant="outline" className="text-[9px] font-black border border-black bg-[#48d2e1] text-black">
                          {company.stats?.founded}
                        </Badge>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── PRO FEATURE: VC MATCHMAKING INDEX ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="relative overflow-hidden min-h-[380px] border-2 border-black bg-white rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Pro Lock overlay if not pro */}
            {!isPro && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-amber-400 text-black border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 animate-bounce">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 mb-1">Unlock AI VC-Matchmaker</h3>
                <p className="text-xs text-slate-600 max-w-sm mb-5 font-semibold leading-relaxed">Pro exclusive. Input your startup operating metrics to run historical matchmaking simulations with tier-1 venture funds.</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black px-5 py-2.5 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs flex items-center gap-1.5 transition-all"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600" /> Upgrade to Pro
                </button>
              </div>
            )}

            {/* Header */}
            <div className="border-b border-black/10 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black animate-pulse" /> VC Matchmaking Simulator
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Determine fit likelihood with top venture capital funds based on core operational ratios</p>
              </div>
              <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-2.5 h-2.5 text-amber-600" /> PRO ONLY
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Metrics inputs */}
              <div className="lg:col-span-2 space-y-4">
                {/* ARR */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Current ARR</span>
                    <span className="text-black font-black bg-[#48d2e1]/30 border border-black/10 px-2 py-0.5 rounded">₹{founderARR} Lakhs</span>
                  </div>
                  <input
                    type="range" min="10" max="400" step="10"
                    value={founderARR} onChange={e => setFounderARR(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* Team Size */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Core Team Size</span>
                    <span className="text-black font-black bg-[#48d2e1]/30 border border-black/10 px-2 py-0.5 rounded">{founderTeam} Full-time</span>
                  </div>
                  <input
                    type="range" min="2" max="60" step="1"
                    value={founderTeam} onChange={e => setFounderTeam(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                {/* CAGR */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Target Year-on-Year Growth</span>
                    <span className="text-black font-black bg-[#48d2e1]/30 border border-black/10 px-2 py-0.5 rounded">{founderCAGR}% YoY</span>
                  </div>
                  <input
                    type="range" min="15" max="200" step="5"
                    value={founderCAGR} onChange={e => setFounderCAGR(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>

                <button
                  onClick={handleMatchmake}
                  disabled={isMatching}
                  className="w-full bg-[#48d2e1] hover:bg-[#35d5e5] disabled:opacity-50 text-black font-black py-2.5 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  {isMatching ? 'Calculating Fit Index...' : 'Simulate Venture Match'}
                </button>
              </div>

              {/* Results */}
              <div className="lg:col-span-3 border-2 border-black bg-slate-50 rounded-2xl p-5 flex flex-col justify-center min-h-[220px]">
                <AnimatePresence mode="wait">
                  {matchResults ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="space-y-4"
                    >
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-500">Matchmaking Index Scores</h4>
                      <div className="space-y-3">
                        {matchResults.map((vc, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-black text-slate-950">{vc.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold mt-0.5">{vc.tier} • Focus: {vc.focus}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-black px-2.5 py-1 border-2 border-black rounded-full ${vc.score > 80 ? 'bg-emerald-100 text-emerald-950' : vc.score > 50 ? 'bg-[#48d2e1]/20 text-cyan-950' : 'bg-slate-100 text-slate-850'}`}>
                                {vc.score}% Fit
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs font-extrabold text-slate-800 mb-0.5">Venture Match scorecard</p>
                      <p className="text-[10px] text-slate-500 font-bold max-w-xs mx-auto leading-relaxed">Adjust your operating parameters on the left and submit to view estimated venture interest probability metrics.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};
