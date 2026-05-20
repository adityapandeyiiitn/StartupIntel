import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Search, Compass, GitCompare, BookOpen, Bookmark, Crown, LogOut, User, CreditCard, ChevronDown, BarChart3, HelpCircle } from 'lucide-react';
import { cn } from '../components/ui/Components';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout, isPro } = useAuth();
  const [topSearch, setTopSearch] = useState('');
  const [companiesCount, setCompaniesCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCompaniesCount(data.length); })
      .catch(() => {});
  }, []);

  const navItems = [
    { name: 'Explore', icon: Compass, path: '/' },
    { name: 'Compare', icon: GitCompare, path: '/compare' },
    { name: 'Analytics Lab', icon: BarChart3, path: '/analytics' },
    { name: 'Case Studies', icon: BookOpen, path: '/case-studies' },
    { name: 'Saved', icon: Bookmark, path: '/saved' },
  ];

  const handleTopSearch = (e) => {
    if (e.key === 'Enter' && topSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(topSearch.trim())}`);
      setTopSearch('');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar (Bold border-r-2 border-black) */}
      <aside className="w-60 border-r-2 border-black bg-white flex flex-col fixed h-full z-20">
        {/* Logo matching the upload exactly as a scaled down Neo-brutalist card */}
        <div className="p-3.5 border-b border-black flex-shrink-0 bg-white">
          <div 
            className="bg-[#48d2e1] rounded-xl py-3 px-3 flex flex-col items-center justify-center cursor-pointer border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all select-none"
            onClick={() => navigate('/')}
          >
            <div 
              className="flex items-center justify-center font-black leading-none text-[12px] tracking-normal"
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
              <span className="text-white ml-[1px]">I</span>
              <span className="text-white">N</span>
              <span className="text-white">T</span>

              {/* E (White stenciled bars SVG) */}
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
            
            <div className="flex items-center gap-1 w-full mt-2 justify-center">
              <div className="h-[1px] bg-black flex-1 opacity-90" />
              <span className="text-[5.5px] font-black text-black tracking-[0.22em] whitespace-nowrap uppercase" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                KNOW WHAT WORKS BEFORE YOU BUILD.
              </span>
              <div className="h-[1px] bg-black flex-1 opacity-90" />
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 py-3 px-3 flex flex-col gap-0.5 overflow-y-auto">
          <p className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[15px] font-bold border',
                  isActive 
                    ? 'bg-[#48d2e1]/20 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-black/10'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-black' : 'text-slate-500')} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                </>
              )}
            </NavLink>
          ))}

          {/* Pro section */}
          <div className="mt-2.5 pt-2.5 border-t border-black/10">
            <p className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pro Features</p>
            {[
              { name: 'Pricing', icon: CreditCard, path: '/pricing' },
            ].map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[15px] font-bold border',
                    isActive 
                      ? 'bg-[#48d2e1]/20 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-black/10'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-black' : 'text-slate-500')} />
                    {item.name}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Support section */}
          <div className="mt-2.5 pt-2.5 border-t border-black/10">
            <p className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Support</p>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[15px] font-bold border',
                  isActive 
                    ? 'bg-[#48d2e1]/20 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-black/10'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <HelpCircle className={cn('w-[18px] h-[18px]', isActive ? 'text-black' : 'text-slate-500')} />
                  Contact Us
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                </>
              )}
            </NavLink>
          </div>

          {/* Upgrade CTA if not pro (Neo-brutalist stylized card) */}
          {!isPro && (
            <div className="mt-3.5 mx-1 bg-[#48d2e1] border-2 border-black rounded-xl p-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300 stroke-black mb-1" />
              <p className="text-xs font-black mb-0.5">Go Pro</p>
              <p className="text-[10px] text-slate-950 font-bold mb-2">Unlock AI insights & financial models</p>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full bg-white hover:bg-slate-50 border-2 border-black text-black text-[11px] font-black py-1.5 rounded-lg shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Upgrade ↗
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="p-3 border-t border-black/10 flex-shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-slate-50 cursor-pointer transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#48d2e1] border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <User className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[13px] font-black text-slate-900 truncate">{(user.email || user.phone || 'User').split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500 font-bold truncate flex items-center gap-1">
                    {isPro ? <><Crown className="w-2.5 h-2.5 text-amber-600" /> Pro Plan</> : 'Free Plan'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {profileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
                  {!isPro && (
                    <button onClick={() => { navigate('/pricing'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-black text-[#48d2e1] hover:bg-slate-50 border-b border-black/10 transition-colors">
                      <Crown className="w-3.5 h-3.5 text-amber-600" /> Upgrade to Pro
                    </button>
                  )}
                  <button onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:border-black hover:bg-slate-50 cursor-pointer transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-transparent group-hover:bg-[#48d2e1] group-hover:border-black flex items-center justify-center flex-shrink-0 transition-all">
                <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-black transition-colors" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-black text-slate-700 group-hover:text-black transition-colors">Sign In</p>
                <p className="text-[10px] text-slate-400 font-semibold">Login to your account</p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Topbar (With black bottom border) */}
        <header className="h-16 bg-white border-b-2 border-black sticky top-0 z-10 flex items-center justify-between px-8 gap-6">
          <div className="relative w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={topSearch}
              onChange={e => setTopSearch(e.target.value)}
              onKeyDown={handleTopSearch}
              placeholder="Search companies... (Enter)"
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-black rounded-lg text-sm font-semibold focus:outline-none focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Brief explanatory platform description */}
          <div className="hidden xl:flex items-center gap-2 text-[10px] font-black text-slate-800 bg-[#48d2e1]/15 border-2 border-black px-3.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tight shrink-0 select-none" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
            <span className="text-indigo-850">💡 Platform:</span>
            <span>Deep-dive unit economics, founder simulations & VC matchmaking.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-black hidden sm:block bg-slate-100 border border-black/10 px-2 py-1 rounded">{companiesCount} companies</span>
            {user && isPro && (
              <span className="flex items-center gap-1 text-xs font-black text-amber-950 bg-amber-100 border border-black px-2.5 py-1 rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Crown className="w-3 h-3 text-amber-500" /> Pro
              </span>
            )}
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-black text-black bg-white hover:bg-slate-50 border-2 border-black px-4 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Login
              </button>
            ) : null}
            {!isPro && (
              <button
                onClick={() => navigate('/pricing')}
                className="text-xs font-black text-black bg-[#48d2e1] hover:bg-[#35d5e5] border-2 border-black px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Crown className="w-3.5 h-3.5" /> Upgrade
              </button>
            )}
          </div>
        </header>

        {/* Content Outer Container (Injects solid brand background into sub pages where needed) */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
