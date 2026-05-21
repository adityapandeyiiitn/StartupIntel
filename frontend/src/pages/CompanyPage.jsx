import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ArrowLeft, Target, Briefcase, Zap, PieChart, TrendingUp,
  Lightbulb, Search, BookOpen, Clock, ShieldCheck, ShieldAlert,
  Telescope, ShieldX, Users, Milestone, Send, Sparkles, MessageSquare,
  Download, Lock, CheckCircle, Calculator, Loader2, Crown, Bookmark
} from 'lucide-react';
import { Card, Badge, SectionTitle, CompanyLogo, cn } from '../components/ui/Components';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config.js';

const teaserRevenueGrowth = [
  { year: '2021', revenue: 10 },
  { year: '2022', revenue: 25 },
  { year: '2023', revenue: 50 },
  { year: '2024', revenue: 90 },
  { year: '2025', revenue: 160 },
];

const teaserMarketShare = [
  { segment: 'Segment A', share: 45 },
  { segment: 'Segment B', share: 30 },
  { segment: 'Segment C', share: 15 },
  { segment: 'Segment D', share: 10 },
];

const teaserSwot = {
  strengths: ['Market leading product', 'Strong customer retention', 'Proprietary IP'],
  weaknesses: ['Dependence on single channel', 'High operational overhead', 'Talent scaling bottlenecks'],
  opportunities: ['Expansion to APAC region', 'New enterprise product line', 'Strategic M&A'],
  threats: ['Aggressive competitor pricing', 'Regulatory policy changes', 'Rising acquisition costs']
};

const teaserTimeline = [
  { year: '2020', milestone: 'Company founded & initial concept validated' },
  { year: '2022', milestone: 'Seed round secured & MVP launched to early users' },
  { year: '2024', milestone: 'Series A funding round closed & commercial scaling accelerated' }
];

const teaserFundingRounds = [
  { round: 'Seed', amount: '₹15,000,000', date: 'Jan 2021' },
  { round: 'Series A', amount: '₹120,000,000', date: 'Jul 2023' }
];

const teaserTechStack = ['React', 'NodeJS', 'Python', 'AWS', 'PostgreSQL'];
const teaserNotableInvestors = ['Sequoia India', 'Elevation Capital', 'Matrix Partners'];
const teaserKeyCompetitors = ['Competitor Alpha', 'Competitor Beta', 'Competitor Gamma'];

const teaserFounderInsights = {
  whyItWorked: ['Aggressive focus on early user feedback', 'Iterating on the MVP within weeks'],
  mistakes: ['Scaling marketing spend too early', 'Hiring too fast without clear goals'],
  lessons: ['Focus on product-market fit before hiring a growth team']
};

const swotColors = {
  strengths: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: ShieldCheck, iconColor: 'text-emerald-600', label: 'Strengths', badge: 'bg-emerald-100 text-emerald-700' },
  weaknesses: { bg: 'bg-rose-50', border: 'border-rose-200', icon: ShieldAlert, iconColor: 'text-rose-600', label: 'Weaknesses', badge: 'bg-rose-100 text-rose-700' },
  opportunities: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Telescope, iconColor: 'text-indigo-600', label: 'Opportunities', badge: 'bg-indigo-100 text-indigo-700' },
  threats: { bg: 'bg-amber-50', border: 'border-amber-200', icon: ShieldX, iconColor: 'text-amber-600', label: 'Threats', badge: 'bg-amber-100 text-amber-700' },
};

export const CompanyPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isPro, token } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasExceededFreeLimit, setHasExceededFreeLimit] = useState(false);

  // Premium tabs & states
  const [activeProTab, setActiveProTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Projections simulator state
  const [projGrowth, setProjGrowth] = useState(25);
  const [projMargin, setProjMargin] = useState(15);
  const [projCAC, setProjCAC] = useState(1500);

  // Sync bookmark status when company loads or slug changes
  useEffect(() => {
    if (company) {
      const saved = JSON.parse(localStorage.getItem('bookmarkedCompanies') || '[]');
      setIsBookmarked(saved.includes(company.slug));
    }
  }, [company]);

  // Track and enforce free-tier case study limits
  useEffect(() => {
    if (company && !isPro) {
      const viewed = JSON.parse(localStorage.getItem('freeViewedCaseStudies') || '[]');
      if (!viewed.includes(company.slug)) {
        if (viewed.length >= 10) {
          setHasExceededFreeLimit(true);
        } else {
          const updated = [...viewed, company.slug];
          localStorage.setItem('freeViewedCaseStudies', JSON.stringify(updated));
        }
      }
    }
  }, [company, isPro]);

  const handleToggleBookmark = () => {
    if (!company) return;
    const saved = JSON.parse(localStorage.getItem('bookmarkedCompanies') || '[]');
    let updated;
    if (saved.includes(company.slug)) {
      updated = saved.filter(s => s !== company.slug);
      setIsBookmarked(false);
    } else {
      updated = [...saved, company.slug];
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarkedCompanies', JSON.stringify(updated));
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/companies/${slug}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setCompany(data);
        setLoading(false);
        setChatMessages([
          {
            sender: 'founder',
            text: `Hi! I am the simulated founder of ${data.name}. You have exclusive Pro access to ask me anything about our business model, growth engine, unit economics, or SWOT analysis. What would you like to explore?`
          }
        ]);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [slug, token]);

  const handleAskFounder = async (customQ) => {
    const queryText = customQ || chatInput;
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAsking(true);

    await new Promise(r => setTimeout(r, 1500));

    let reply = `That's a vital aspect of our trajectory. In our ${company.industry} operations, our core focus lies in refining our unit economics, expanding our distribution channels, and compounding our brand trust. `;

    const qLower = queryText.toLowerCase();
    if (qLower.includes('revenue') || qLower.includes('growth') || qLower.includes('make money')) {
      reply = `Regarding our commercial scaling: we've unlocked consistent growth (reaching ${company.stats?.revenue} in revenue). This is fueled primarily by our diversified revenue model comprising: ${company.overview?.revenueStreams?.join(', ')}. Our CAGR is driven by increasing ARPU among key consumer segments.`;
    } else if (qLower.includes('competit') || qLower.includes('rival') || qLower.includes('market share')) {
      reply = `In the competitive battlefield, we maintain a solid segment share of around ${company.metrics?.marketShare?.[0]?.share || '38'}%. While players like ${company.keyCompetitors?.join(' or ')} challenge us, our primary moats are our advanced tech infrastructure (${company.techStack?.slice(0, 3)?.join(', ')}) and localized distribution network.`;
    } else if (qLower.includes('swot') || qLower.includes('strength') || qLower.includes('weakness')) {
      reply = `Looking at our SWOT profile: our premier strength is definitely: "${company.swot?.strengths?.[0]}". Conversely, our main operational challenge is: "${company.swot?.weaknesses?.[0]}", which we are actively optimizing via automated pipelines.`;
    } else if (qLower.includes('mistake') || qLower.includes('insight') || qLower.includes('advice')) {
      reply = `As a founder, my primary takeaway is: "${company.founderInsights?.lessons?.[0] || 'Build trust before trying to hyperscale' }". One major mistake we had to course-correct was "${company.founderInsights?.mistakes?.[0]}". Learning from that shaped our sustainable margin structure today.`;
    }

    setChatMessages(prev => [...prev, { sender: 'founder', text: reply }]);
    setIsAsking(false);
  };

  const handleDownloadReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataStr = `STARTUP INTELLIGENCE PLATFORM - PREMIUM REPORT\n` +
                      `=============================================\n\n` +
                      `COMPANY: ${company.name}\n` +
                      `INDUSTRY: ${company.industry}\n` +
                      `TAGLINE: ${company.tagline}\n` +
                      `FOUNDED: ${company.stats?.founded}\n\n` +
                      `FINANCIALS:\n` +
                      `- Revenue: ${company.stats?.revenue}\n` +
                      `- Funding: ${company.stats?.funding}\n` +
                      `- Valuation/Users: ${company.stats?.users}\n\n` +
                      `BUSINESS STRATEGY:\n` +
                      `- Business Model: ${company.overview?.businessModel}\n` +
                      `- Revenue Streams: ${company.overview?.revenueStreams?.join(', ')}\n` +
                      `- Market Position: ${company.overview?.marketPosition}\n\n` +
                      `UNIT ECONOMICS:\n` +
                      `- economic profile: ${company.deepDive?.unitEconomics}\n` +
                      `- channels: ${company.deepDive?.distributionChannels?.join(', ')}\n` +
                      `---------------------------------------------\n` +
                      `Generated by StartupIntel Pro. Confidential.`;
      
      const blob = new Blob([dataStr], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${company.slug}_premium_report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!company || company.message) {
    return <div className="p-16 text-center text-slate-500 text-lg">Company not found.</div>;
  }

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
  const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Action Buttons Row */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-black text-black bg-white hover:bg-slate-50 border-2 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
          Back to Explore
        </button>

        <button
          onClick={handleToggleBookmark}
          className={`flex items-center gap-2 text-xs font-black border-2 border-black px-4 py-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
            isBookmarked 
              ? 'bg-[#48d2e1] text-black' 
              : 'bg-white hover:bg-slate-50 text-slate-750'
          }`}
        >
          <Bookmark className={`w-4 h-4 stroke-[2.5] ${isBookmarked ? 'fill-black text-black' : 'text-slate-500'}`} />
          {isBookmarked ? 'Bookmarked' : 'Bookmark Company'}
        </button>
      </div>

      {/* ── Hero ─────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        className="mb-10 flex flex-col lg:flex-row gap-8 items-start justify-between"
      >
        <div className="flex items-start gap-6">
          <CompanyLogo company={company} className="w-20 h-20 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">{company.name}</h1>
            <p className="text-slate-500 font-semibold mb-4 text-base">{company.tagline}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="indigo">{company.industry}</Badge>
              <Badge variant="default">Founded {company.stats?.founded}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-px bg-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black w-full lg:w-auto">
          {[
            { label: 'Revenue', value: company.stats?.revenue },
            { label: 'Funding', value: company.stats?.funding },
            { label: 'Users', value: company.stats?.users },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white px-6 py-4 flex-1 min-w-[120px] border-r-2 last:border-r-0 border-black">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-lg font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Overview Cards ───────────────── */}
      <motion.div initial="hidden" animate="visible" variants={{ ...stagger, hidden: {} }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
      >
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <SectionTitle title="Business Model" icon={Briefcase} />
            <p className="text-slate-600 text-sm leading-relaxed">{company.overview?.businessModel}</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <SectionTitle title="Revenue Streams" icon={Zap} />
            <ul className="space-y-2.5 mt-1">
              {company.overview?.revenueStreams?.map((s, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <SectionTitle title="Market Position" icon={Target} />
            <p className="text-slate-600 text-sm leading-relaxed">{company.overview?.marketPosition}</p>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Charts ───────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10 relative"
      >
        {company.isGated && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/30 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-350 m-1">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Lock className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Unlock Financial Charts & Metrics</h4>
            <p className="text-[11px] text-slate-500 font-bold max-w-xs mt-1 leading-relaxed">
              Upgrade to Pro to view detailed annual revenue growth graphs, segment market share breakdown, and key metrics.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
            </button>
          </div>
        )}
        <Card className={company.isGated ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''}>
          <SectionTitle title="Revenue Growth ($M)" icon={TrendingUp} />
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={company.isGated ? teaserRevenueGrowth : (company.metrics?.revenueGrowth || [])}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-8} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)' }} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className={company.isGated ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''}>
          <SectionTitle title="Market Share (%)" icon={PieChart} />
          <div className="h-60 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.isGated ? teaserMarketShare : (company.metrics?.marketShare || [])} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis type="category" dataKey="segment" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} width={90} width={90} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)' }} />
                <Bar dataKey="share" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* ── DNA & Insights ────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10 relative">
        {company.isGated && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/30 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-300 m-1">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Lock className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Unlock Funding & Tech Intel</h4>
            <p className="text-[11px] text-slate-500 font-bold max-w-xs mt-1 leading-relaxed">
              Upgrade to Pro to view funding rounds, cap table details, technical stack, and core competitors.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
            </button>
          </div>
        )}
        <Card className={cn("lg:col-span-2", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
          <SectionTitle title="Funding History" icon={Milestone} />
          {((company.isGated ? teaserFundingRounds : company.fundingRounds) && (company.isGated ? teaserFundingRounds : company.fundingRounds).length > 0) ? (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Round</th>
                    <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(company.isGated ? teaserFundingRounds : company.fundingRounds).map((r, i) => (
                    <tr key={i} className="text-sm">
                      <td className="py-3 font-semibold text-slate-900">{r.round}</td>
                      <td className="py-3 text-slate-600">{r.amount}</td>
                      <td className="py-3 text-slate-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-xs mt-4">No funding rounds documented.</p>
          )}
        </Card>
        <div className={cn("flex flex-col gap-5", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
          <Card>
            <SectionTitle title="Tech Stack" icon={Zap} />
            <div className="flex flex-wrap gap-2 mt-2">
              {(company.isGated ? teaserTechStack : company.techStack) && (company.isGated ? teaserTechStack : company.techStack).length > 0 ? (
                (company.isGated ? teaserTechStack : company.techStack).map((tech, i) => (
                  <Badge key={i} variant="indigo">{tech}</Badge>
                ))
              ) : (
                <span className="text-slate-400 text-xs">Not specified</span>
              )}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Notable Investors" icon={Users} />
            <div className="flex flex-wrap gap-2 mt-2">
              {(company.isGated ? teaserNotableInvestors : company.notableInvestors) && (company.isGated ? teaserNotableInvestors : company.notableInvestors).length > 0 ? (
                (company.isGated ? teaserNotableInvestors : company.notableInvestors).map((inv, i) => (
                  <Badge key={i} variant="default">{inv}</Badge>
                ))
              ) : (
                <span className="text-slate-400 text-xs">Not specified</span>
              )}
            </div>
          </Card>
          <Card>
            <SectionTitle title="Key Competitors" icon={Target} />
            <div className="flex flex-wrap gap-2 mt-2">
              {(company.isGated ? teaserKeyCompetitors : company.keyCompetitors) && (company.isGated ? teaserKeyCompetitors : company.keyCompetitors).length > 0 ? (
                (company.isGated ? teaserKeyCompetitors : company.keyCompetitors).map((comp, i) => (
                  <Badge key={i} variant="rose">{comp}</Badge>
                ))
              ) : (
                <span className="text-slate-400 text-xs">Not specified</span>
              )}
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ── Deep Dive + Founder Insights ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Card>
              <SectionTitle title="Deep Dive Analysis" icon={Search} />
              <div className="space-y-5 mt-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">Unit Economics</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{company.deepDive?.unitEconomics}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">Growth Strategy</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{company.deepDive?.growthStrategy}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5">Customer Segments</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.deepDive?.customerSegments?.map((seg, i) => (
                      <Badge key={i} variant="indigo">{seg}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2.5">Distribution Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.deepDive?.distributionChannels?.map((ch, i) => (
                      <Badge key={i} variant="default">{ch}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Case Study */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Card>
              <SectionTitle title="Case Study" icon={BookOpen} />
              <div className="mt-5 border-l-2 border-slate-100 pl-6 space-y-6">
                {[
                  { dot: 'bg-amber-400 border-amber-500', label: 'The Problem', labelColor: 'text-amber-700', text: company.caseStudy?.problem },
                  { dot: 'bg-emerald-400 border-emerald-500', label: 'The Solution', labelColor: 'text-emerald-700', text: company.caseStudy?.solution },
                  { dot: 'bg-indigo-400 border-indigo-500', label: 'The Outcome', labelColor: 'text-indigo-700', text: company.caseStudy?.outcome },
                  { dot: 'bg-slate-400 border-slate-500', label: 'Key Lesson', labelColor: 'text-slate-700', text: company.caseStudy?.lessons },
                ].map(({ dot, label, labelColor, text }) => text && (
                  <div key={label} className="relative">
                    <div className={`absolute -left-[33px] top-1.5 w-3.5 h-3.5 rounded-full ${dot} border-2 z-10`} />
                    <h4 className={`text-xs font-bold ${labelColor} uppercase tracking-wider mb-1.5`}>{label}</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Founder Insights */}
        <div className="flex flex-col gap-5 relative">
          {company.isGated && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-700 m-0.5">
              <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
                <Lock className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <h4 className="text-sm font-black text-white">Unlock Founder Insights</h4>
              <p className="text-[11px] text-slate-350 font-bold max-w-xs mt-1 leading-relaxed">
                Upgrade to Pro to learn the key milestones, mistakes, and growth tactics from the founder.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
              >
                <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
              </button>
            </div>
          )}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className={cn("h-full", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
            <Card className="h-full bg-gradient-to-b from-slate-900 to-[#0d1324] text-white border-0 shadow-xl">
              <SectionTitle title="Founder Insights" icon={Lightbulb}
                className="[&_h2]:text-white [&_svg]:text-amber-400 mb-5" />
              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">✓ Why It Worked</h4>
                  <ul className="space-y-2.5">
                    {(company.isGated ? teaserFounderInsights.whyItWorked : company.founderInsights?.whyItWorked)?.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">✗ Mistakes Made</h4>
                  <ul className="space-y-2.5">
                    {(company.isGated ? teaserFounderInsights.mistakes : company.founderInsights?.mistakes)?.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-relaxed flex gap-2">
                        <span className="text-rose-400 mt-0.5 flex-shrink-0">→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {(company.isGated ? teaserFounderInsights.lessons : company.founderInsights?.lessons)?.length > 0 && (
                  <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">💡 Key Lesson</h4>
                    <p className="text-xs text-white italic leading-relaxed">"{(company.isGated ? teaserFounderInsights.lessons : company.founderInsights.lessons)[0]}"</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── SWOT Analysis ────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 relative">
        {company.isGated && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/30 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-300 m-0.5">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Lock className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Unlock SWOT Analysis & Risks</h4>
            <p className="text-[11px] text-slate-500 font-bold max-w-xs mt-1 leading-relaxed">
              Upgrade to Pro to access our deep-dive SWOT analysis containing strategic strengths, vulnerabilities, opportunities, and competitive threats.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
            </button>
          </div>
        )}
        <h2 className="text-xl font-semibold text-slate-900 mb-5">SWOT Analysis</h2>
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-5", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
          {Object.entries(swotColors).map(([key, cfg]) => (
            <div key={key} className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}>
              <div className="flex items-center gap-2 mb-4">
                <cfg.icon className={`w-4 h-4 ${cfg.iconColor}`} />
                <h3 className={`font-semibold text-sm ${cfg.iconColor}`}>{cfg.label}</h3>
              </div>
              <ul className="space-y-2">
                {(company.isGated ? teaserSwot[key] : company.swot?.[key])?.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className={cfg.iconColor}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Timeline ─────────────────────── */}
      {(company.isGated || company.timeline?.length > 0) && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 relative">
          {company.isGated && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/30 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-300 m-0.5">
              <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
                <Lock className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Unlock Growth Timeline</h4>
              <p className="text-[11px] text-slate-500 font-bold max-w-xs mt-1 leading-relaxed">
                Upgrade to Pro to view the startup's full journey, key milestones, and pivot dates.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
              >
                <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
              </button>
            </div>
          )}
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Company Timeline
          </h2>
          <div className={cn("relative", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-6 pl-12">
              {(company.isGated ? teaserTimeline : company.timeline).map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="relative"
                >
                  <div className="absolute -left-[36px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                  <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{event.year}</span>
                    <p className="text-sm font-medium text-slate-900 mt-1">{event.milestone}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      {/* ── Full Case Study Article ─────── */}
      {company.caseStudy?.fullCaseStudy && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">In-Depth Case Study</h2>
              <p className="text-xs text-slate-400 mt-0.5">A narrative deep-dive into the company's pivotal journey</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Article header band */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 px-4 sm:px-8 py-4 sm:py-5">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Full Case Study</p>
              <h3 className="text-white text-2xl font-bold">{company.name}</h3>
              <p className="text-indigo-200 text-sm mt-1">{company.tagline}</p>
            </div>

            {/* Quick stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-slate-100 border-b border-slate-100">
              {[
                { label: 'Problem', text: company.caseStudy.problem },
                { label: 'Solution', text: company.caseStudy.solution },
                { label: 'Outcome', text: company.caseStudy.outcome },
                { label: 'Core Lesson', text: company.caseStudy.lessons },
              ].map(({ label, text }) => (
                <div key={label} className="px-4 sm:px-5 py-3 sm:py-4 border-b sm:border-b-0 border-r-0 sm:border-r border-slate-100 last:border-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{text}</p>
                </div>
              ))}
            </div>

            {/* Article body */}
            <div className="px-4 sm:px-8 py-6 sm:py-8 relative">
              {hasExceededFreeLimit ? (
                <>
                  {/* Blurred mock paragraphs for visual weight */}
                  <div className="space-y-4 filter blur-[6px] select-none pointer-events-none opacity-40">
                    <p className="text-slate-700 leading-8 text-[15px] text-lg font-medium text-slate-800 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                      {company.caseStudy.fullCaseStudy.split('\n\n')[0]}
                    </p>
                    <p className="text-slate-700 leading-8 text-[15px]">
                      {company.caseStudy.fullCaseStudy.split('\n\n')[1] || 'In the dynamic marketplace of modern operations, this venture represents a spectacular study of compounding strategic moats and resilient network configurations.'}
                    </p>
                    <p className="text-slate-700 leading-8 text-[15px]">
                      {company.caseStudy.fullCaseStudy.split('\n\n')[2] || 'A deep-dive investigation reveals significant contribution margins and customer lifetime value metrics that are rarely achieved in contemporary seed sectors.'}
                    </p>
                  </div>
                  {/* Gate overlay */}
                  <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-12 h-12 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 animate-bounce">
                      <Lock className="w-6 h-6 text-black stroke-[2.5]" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">Case Study Locked</h4>
                    <p className="text-xs text-slate-500 font-semibold max-w-sm mb-4 leading-relaxed font-medium">
                      You have reached your monthly limit of 10 free case studies. Upgrade to <strong className="text-black font-black">StartupIntel Pro</strong> to unlock this in-depth strategic analysis and all 600+ others!
                    </p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black px-5 py-2.5 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-950 fill-amber-950 stroke-black" /> Unlock All Case Studies
                    </button>
                  </div>
                </>
              ) : (
                company.caseStudy.fullCaseStudy.split('\n\n').map((para, i) => (
                  <p key={i} className={`text-slate-700 leading-8 mb-5 text-[15px] ${i === 0 ? 'text-lg font-medium text-slate-800 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-650 first-letter:float-left first-letter:mr-3 first-letter:leading-none' : ''}`}>
                    {para}
                  </p>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Key Insights Panel ───────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 relative">
        {company.isGated && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/30 backdrop-blur-[6px] p-6 text-center z-10 rounded-2xl border-2 border-dashed border-slate-300 m-0.5">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Lock className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Unlock Key Takeaways</h4>
            <p className="text-[11px] text-slate-500 font-bold max-w-xs mt-1 leading-relaxed">
              Upgrade to Pro to view tactical takeaways, lessons, and strategic insights for this startup.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="mt-3 bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black text-[10px] px-3.5 py-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
            >
              <Crown className="w-3 h-3 fill-amber-950 stroke-black text-amber-950" /> Go Pro
            </button>
          </div>
        )}
        <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" /> Key Takeaways for Founders
        </h2>
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-5", company.isGated && "filter blur-[4px] select-none pointer-events-none opacity-50")}>
          {(company.isGated ? teaserFounderInsights.lessons : (company.founderInsights?.lessons || []))?.map((lesson, i) => (
            <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-sm font-bold mb-3">
                {i + 1}
              </div>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">"{lesson}"</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── PRO PREMIUM FEATURES ──────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-14 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b-2 border-black pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#48d2e1] rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                StartupIntel Pro Suite <span className="text-xs font-black bg-amber-400 text-black border border-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"><Crown className="w-3 h-3 text-amber-950 fill-amber-950 stroke-black" /> PRO ONLY</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">Advanced analytic tools, AI simulations & interactive models</p>
            </div>
          </div>

          <button
            onClick={isPro ? handleDownloadReport : () => navigate('/pricing')}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all border-2 border-black ${isPro ? 'bg-[#48d2e1] hover:bg-[#35d5e5] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-black text-white hover:bg-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isPro ? 'Export PDF Report' : 'Unlock Premium Export'}
          </button>
        </div>

        {/* Outer card holding all premium features (Neo-Brutalist Card) */}
        <div className="relative bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[460px] flex flex-col">
          {/* Tab switching header */}
          <div className="flex border-b-2 border-black bg-slate-50 p-3 gap-2 flex-wrap">
            {[
              { id: 'chat', label: 'AI Founder Q&A', icon: MessageSquare },
              { id: 'battlecard', label: 'Competitor Battlecard', icon: Target },
              { id: 'projection', label: 'Projections Simulator', icon: Calculator },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => isPro ? setActiveProTab(tab.id) : navigate('/pricing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${activeProTab === tab.id ? 'bg-[#48d2e1] text-black' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT - Gated under blur overlay if not Pro */}
          <div className="flex-1 p-6 relative">
            {/* The absolute overlay forcing upgrade if not pro */}
            {!isPro && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-14 h-14 bg-amber-400 border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-5 animate-bounce">
                  <Lock className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Unlock Pro Analysis Suite</h3>
                <p className="text-sm text-slate-500 font-semibold max-w-sm mb-6 leading-relaxed">Upgrade to Pro to query the Simulated Founder, run dynamic 5-year financial simulations, and compare competitor battlecards.</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="bg-[#48d2e1] hover:bg-[#35d5e5] text-black font-black px-6 py-3 border-2 border-black rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-amber-950 fill-amber-950 stroke-black animate-pulse" /> Upgrade Now
                </button>
              </div>
            )}

            {/* TAB: AI Founder Chat */}
            {activeProTab === 'chat' && (
              <div className="flex flex-col h-[380px] justify-between gap-4">
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                        {msg.sender === 'user' ? 'U' : company.name[0]}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAsking && (
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold animate-pulse">{company.name[0]}</div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions bar */}
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none flex-wrap">
                  {[
                    `Tell me about ${company.name}'s revenue model`,
                    'What are your major SWOT strengths?',
                    'What founder mistake did you learn from?',
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskFounder(s)}
                      disabled={isAsking}
                      className="text-[11px] font-black text-slate-850 bg-[#48d2e1]/10 hover:bg-[#48d2e1]/20 border-2 border-black px-3 py-1.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskFounder()}
                    placeholder={`Ask the simulated founder of ${company.name}...`}
                    className="flex-1 bg-slate-50 border-2 border-black rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-semibold"
                    disabled={isAsking}
                  />
                  <button
                    onClick={() => handleAskFounder()}
                    disabled={isAsking || !chatInput.trim()}
                    className="bg-[#48d2e1] hover:bg-[#35d5e5] disabled:opacity-50 disabled:cursor-not-allowed text-black w-11 h-11 rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <Send className="w-4 h-4 text-black stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Competitor Battlecard */}
            {activeProTab === 'battlecard' && (
              <div className="space-y-6 overflow-x-auto">
                <div className="min-w-[480px]">
                  <div className="grid grid-cols-3 gap-3 border-b-2 border-black pb-3">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400">Metric</div>
                    <div className="text-xs font-black uppercase tracking-wider text-black bg-[#48d2e1]/20 border border-black px-2 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{company.name}</div>
                    <div className="text-xs font-black uppercase tracking-wider text-rose-950 bg-rose-100 border border-black px-2 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{company.keyCompetitors?.[0] || 'Competitor A'}</div>
                  </div>

                  <div className="space-y-3 mt-3">
                    {[
                      { label: 'Primary Moat', val1: company.swot?.strengths?.[0] || 'Brand & Distribution', val2: 'Aggressive pricing & lower margins' },
                      { label: 'Tech Stack', val1: company.techStack?.slice(0, 3)?.join(', ') || 'React, Node', val2: 'Legacy PHP, MySQL, Apache' },
                      { label: 'Revenue', val1: company.overview?.revenueStreams?.[0] || 'SaaS model', val2: 'Ad-supported & transaction fees' },
                      { label: 'Core Weakness', val1: company.swot?.weaknesses?.[0] || 'High acquisition costs', val2: 'Slower operational scaling speed' },
                      { label: 'Growth', val1: company.deepDive?.growthStrategy || 'ARPU optimization', val2: 'Unregulated organic expansion' },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 text-xs items-start">
                        <div className="font-extrabold text-slate-700">{row.label}</div>
                        <div className="text-slate-900 bg-[#48d2e1]/5 p-2.5 rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] font-semibold leading-relaxed">{row.val1}</div>
                        <div className="text-rose-950 bg-rose-50/50 p-2.5 rounded-lg border border-black leading-relaxed font-semibold">{row.val2}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Projections Simulator */}
            {activeProTab === 'projection' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Sliders */}
                <div className="md:col-span-3 space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Configure Growth Inputs</h3>
                  
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1.5">
                      <span>Annual Revenue Growth Rate</span>
                      <span className="text-black font-black bg-[#48d2e1]/20 border border-black px-2 py-0.5 rounded-full">{projGrowth}% CAGR</span>
                    </div>
                    <input
                      type="range" min="10" max="150" step="5"
                      value={projGrowth} onChange={e => setProjGrowth(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1.5">
                      <span>Projected Net Margin</span>
                      <span className="text-black font-black bg-[#48d2e1]/20 border border-black px-2 py-0.5 rounded-full">{projMargin}%</span>
                    </div>
                    <input
                      type="range" min="5" max="45" step="2"
                      value={projMargin} onChange={e => setProjMargin(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1.5">
                      <span>Target Customer Acquisition Cost (CAC)</span>
                      <span className="text-black font-black bg-[#48d2e1]/20 border border-black px-2 py-0.5 rounded-full">₹{projCAC.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="300" max="6000" step="100"
                      value={projCAC} onChange={e => setProjCAC(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 border border-black rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>

                {/* Simulated Outputs */}
                <div className="md:col-span-2 bg-slate-50 border-2 border-black rounded-xl p-5 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Calculated Forecasts</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Estimated 5-Year Revenue</p>
                      <p className="text-2xl font-black text-slate-900">
                        ${(() => {
                          const baseRevText = company.stats?.revenue || '';
                          const parsedBase = parseFloat(baseRevText.replace(/[^0-9.]/g, ''));
                          const baseRev = isNaN(parsedBase) || parsedBase <= 0 ? 100 : parsedBase;
                          return Math.round(baseRev * Math.pow(1 + projGrowth/100, 5));
                        })()}M
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Based on current base of {company.stats?.revenue || 'Undisclosed'}</p>
                    </div>

                    <div className="border-t-2 border-black pt-3">
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">LTV to CAC Ratio</p>
                      <p className="text-lg font-black text-emerald-600">
                        {((projCAC < 1000 ? 5.5 : projCAC < 3000 ? 3.8 : 2.1) * (projMargin / 15)).toFixed(1)}x
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Recommended healthy benchmark: &gt; 3.0x</p>
                    </div>
                  </div>

                  <div className="bg-[#48d2e1]/20 border-2 border-black rounded-lg p-3 text-center text-xs font-black text-black mt-4 flex items-center gap-1.5 justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Healthy Unit Economics
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
