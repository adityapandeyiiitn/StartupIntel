import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Sparkles, ShieldAlert, Award, FileText, CheckCircle, ArrowRight,
  TrendingUp, DollarSign, Users, Target, Lock, Crown, BarChart3, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Badge } from '../components/ui/Components';
import { API_URL } from '../config.js';

const SECTOR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444'];

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { isPro } = useAuth();
  
  // Analytics State
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectorData, setSectorData] = useState([]);
  
  // Pitch Deck Simulator State
  const [pitchInput, setPitchInput] = useState('');
  const [pitchCategory, setPitchCategory] = useState('B2B SaaS');
  const [pitchStage, setPitchStage] = useState('Seed');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [scorecard, setScorecard] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/companies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCompanies(data);
          
          // Compute sector aggregations
          const sectors = {};
          data.forEach(c => {
            const ind = c.industry.split(' & ')[0]; // group broad industries
            if (!sectors[ind]) {
              sectors[ind] = { name: ind, count: 0, totalFunding: 0 };
            }
            sectors[ind].count += 1;
            // Parse funding string e.g. "$450M" to number
            const fundingNum = parseInt(c.stats?.funding?.replace(/[^0-9]/g, '') || '0');
            sectors[ind].totalFunding += fundingNum;
          });

          const formatted = Object.values(sectors)
            .map(s => ({
              ...s,
              avgFunding: Math.round(s.totalFunding / s.count)
            }))
            .sort((a, b) => b.totalFunding - a.totalFunding)
            .slice(0, 6);

          setSectorData(formatted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEvaluatePitch = async () => {
    if (!pitchInput.trim()) return;
    setIsEvaluating(true);
    setScorecard(null);
    
    await new Promise(r => setTimeout(r, 2200));

    // Generate dynamic mock pitch scorecard grades
    const textLength = pitchInput.length;
    const score = Math.min(Math.round(65 + (textLength % 25) + (pitchInput.includes('AI') ? 8 : 0)), 98);
    const grade = score > 90 ? 'A+' : score > 80 ? 'A' : score > 70 ? 'B+' : 'B';
    
    setScorecard({
      overallScore: score,
      grade: grade,
      metrics: [
        { label: 'Market Opportunity (TAM)', score: Math.round(score * 0.95), feedback: 'Huge addressable space, but focus on the initial niche segment.' },
        { label: 'Value Proposition Clarity', score: Math.round(score * 1.02) > 100 ? 98 : Math.round(score * 0.9), feedback: pitchInput.length > 50 ? 'Strong articulation of user benefit.' : 'A bit brief. Describe the exact customer pain point more clearly.' },
        { label: 'Moat & Defensibility', score: Math.round(score * 0.85), feedback: 'Strong tech angle. Consider highlighting network effects or switching costs.' },
        { label: 'Business Model Viability', score: Math.round(score * 0.92), feedback: 'Excellent scaling dynamics. High gross margin potential.' }
      ],
      strengths: [
        'Highly scalable product delivery engine',
        pitchInput.toLowerCase().includes('ai') ? 'Leveraging AI capabilities for automated product intelligence' : 'Solid core value proposition targeting acute inefficiencies',
        'Strong alignment with secular trends in the digital economy'
      ],
      recommendations: [
        'Formulate a precise Tier-2 expansion playbook to manage customer acquisition costs',
        'Detail your technological moats, specifically database proprietary assets',
        'Optimize early revenue models to enhance cash flow generation speed'
      ]
    });
    setIsEvaluating(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics Lab</h1>
          <p className="text-slate-500 text-sm">Interactive sector aggregates, VC allocation trends & pitch simulators</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sector Funding Bar Chart */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" /> Sector Capital Concentration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Aggregate venture funding allocated across top industries ($M)</p>
            </div>
            <Badge variant="indigo">Live Aggregates</Badge>
          </div>

          <div className="h-64 mt-4">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Loading charts...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dx={-8} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="totalFunding" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={36}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Sector Distribution Pie */}
        <Card>
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Sector Volume Share
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Proportion of startups mapped to each sector</p>
          </div>

          <div className="h-48 relative flex items-center justify-center">
            {loading ? (
              <div className="text-slate-400 text-sm animate-pulse">Loading distribution...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom Mini Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sectorData.slice(0, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold truncate">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[idx % SECTOR_COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* INTERACTIVE PITCH DECK SIMULATOR (PRO ONLY FEATURE) */}
      <Card className="relative overflow-hidden min-h-[450px]">
        {/* Subtle dynamic background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        {/* Gated lock if not Pro */}
        {!isPro && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4 animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Unlock AI Pitch Deck Scorecard</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">Upgrade to Pro to evaluate your startup pitch deck, simulate investor feedback, and get grading matrices.</p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" /> Upgrade to Pro
            </button>
          </div>
        )}

        {/* Simulator header */}
        <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI Pitch Deck Evaluator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Submit your elevator pitch to receive simulated venture capital grading metrics</p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-600" /> Premium Tool
          </span>
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">Sector / Category</label>
              <select
                value={pitchCategory}
                onChange={e => setPitchCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
              >
                {['B2B SaaS', 'Fintech', 'Edtech', 'E-commerce & D2C', 'Mobility', 'Healthtech'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">Funding Stage</label>
              <div className="grid grid-cols-3 gap-2">
                {['Pre-Seed', 'Seed', 'Series A'].map(stg => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => setPitchStage(stg)}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${pitchStage === stg ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">Elevator Pitch</label>
              <textarea
                rows={5}
                value={pitchInput}
                onChange={e => setPitchInput(e.target.value)}
                placeholder="We are building an AI-powered logistics SaaS platform that automates first-mile routing optimization for local merchants in India, reducing delivery fuel costs by 28%..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 resize-none leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1">Tip: Include details on your target market, pain point, and unique technology angle.</p>
            </div>

            <button
              onClick={handleEvaluatePitch}
              disabled={isEvaluating || !pitchInput.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 text-sm"
            >
              {isEvaluating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating Deck...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Evaluate Pitch Deck Scorecard</>
              )}
            </button>
          </div>

          {/* Results Scorecard Panel */}
          <div className="lg:col-span-3 border border-slate-100 bg-slate-50/50 rounded-2xl p-6 flex flex-col justify-center min-h-[350px]">
            <AnimatePresence mode="wait">
              {scorecard ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Header Metrics */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-black shadow-sm">
                        {scorecard.grade}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall AI Grade</p>
                        <p className="text-sm font-bold text-slate-900">Scorecard: {scorecard.overallScore}/100</p>
                      </div>
                    </div>
                    <Badge variant="indigo" className="py-1 px-3 text-xs flex items-center gap-1 font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> VC READY
                    </Badge>
                  </div>

                  {/* Criteria Sliders */}
                  <div className="space-y-3">
                    {scorecard.metrics.map((m, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-sm">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                          <span>{m.label}</span>
                          <span className="text-indigo-600 font-extrabold">{m.score}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1.5">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${m.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{m.feedback}</p>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200/60 pt-4">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2.5">✓ Strategic Strengths</h4>
                      <ul className="space-y-2">
                        {scorecard.strengths.map((str, i) => (
                          <li key={i} className="text-[10px] text-slate-600 leading-relaxed flex gap-1.5 items-start">
                            <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-2.5">💡 VC Recommendations</h4>
                      <ul className="space-y-2">
                        {scorecard.recommendations.map((rec, i) => (
                          <li key={i} className="text-[10px] text-slate-600 leading-relaxed flex gap-1.5 items-start">
                            <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Scorecard Output</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Enter your elevator pitch details and submit to trigger our simulated AI Pitch evaluation scorecard.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Loader2 = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
