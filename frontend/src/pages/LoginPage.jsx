import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, ArrowRight, ArrowLeft, CheckCircle, Loader2, Shield } from 'lucide-react';
import { auth } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithFirebase } = useAuth();
  const [step, setStep] = useState(1); // 1=identifier, 2=otp/password, 3=success
  const [mode, setMode] = useState('phone'); // phone | email
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v.replace(/\s/g, ''));
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Setup invisible recaptcha verifier for phone OTP
  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) return;
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha resolved.');
        }
      });
    } catch (e) {
      console.error('Recaptcha error:', e);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    if (mode === 'phone') {
      if (!isValidPhone(identifier)) {
        setError('Enter a valid 10-digit Indian mobile number'); 
        return;
      }
      setLoading(true);
      try {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const formattedPhone = `+91${identifier}`;
        
        // Trigger real phone OTP via Firebase
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        
        setStep(2);
        setCountdown(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } catch (err) {
        console.error('Phone OTP error:', err);
        setError('Failed to send OTP: ' + (err.message.includes('reCAPTCHA') ? 'Please check your connection.' : err.message));
      } finally {
        setLoading(false);
      }
    } else {
      if (!isValidEmail(identifier)) {
        setError('Enter a valid email address');
        return;
      }
      // For email, proceed to enter password (frictionless password signup/login)
      setStep(2);
    }
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError('');
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyOtpOrPassword = async () => {
    setError('');
    setLoading(true);
    
    if (mode === 'phone') {
      const enteredOtp = otp.join('');
      if (enteredOtp.length < 6) { 
        setError('Enter the complete 6-digit OTP'); 
        setLoading(false);
        return; 
      }
      
      try {
        if (confirmationResult) {
          const result = await confirmationResult.confirm(enteredOtp);
          const fbUser = result.user;
          const token = await fbUser.getIdToken();
          
          const stored = localStorage.getItem('sip_user');
          const cached = stored ? JSON.parse(stored) : {};

          loginWithFirebase({
            uid: fbUser.uid,
            phone: fbUser.phoneNumber,
            plan: cached.plan || 'free'
          }, token);

          setStep(3);
          setTimeout(() => navigate('/'), 1500);
        } else {
          setError('No confirmation active. Please request OTP again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Invalid OTP code. Please verify and try again.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      try {
        // Frictionless email auth: Try login, if account not found, signup automatically!
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, identifier, password);
        } catch (loginErr) {
          if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
            // Auto signup
            userCredential = await createUserWithEmailAndPassword(auth, identifier, password);
          } else {
            throw loginErr;
          }
        }
        
        const fbUser = userCredential.user;
        const token = await fbUser.getIdToken();

        const stored = localStorage.getItem('sip_user');
        const cached = stored ? JSON.parse(stored) : {};

        loginWithFirebase({
          uid: fbUser.uid,
          email: fbUser.email,
          plan: cached.plan || 'free'
        }, token);

        setStep(3);
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        console.error('Email authentication error:', err);
        setError(err.message.replace('Firebase:', ''));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    await handleSendOtp();
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();

      const stored = localStorage.getItem('sip_user');
      const cached = stored ? JSON.parse(stored) : {};

      loginWithFirebase({
        uid: fbUser.uid,
        email: fbUser.email,
        plan: cached.plan || 'free'
      }, token);

      setStep(3);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain "${window.location.hostname}" is not authorized. Please add it to "Authorized domains" in Firebase Console -> Authentication -> Settings.`);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase:', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#48d2e1] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Invisible recaptcha container */}
      <div id="recaptcha-container"></div>

      <div className="relative w-full max-w-md">
        {/* Logo matching the homepage exactly */}
        <div className="text-center mb-8 flex flex-col items-center select-none">
          {/* Main Logo Text with exact fonts & colors per letter */}
          <div 
            className="flex items-center justify-center tracking-normal leading-none font-black text-5xl mb-2"
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
            <span className="text-white ml-[2px]">I</span>
            <span className="text-white">N</span>
            <span className="text-white">T</span>

            {/* E (White stenciled bars) */}
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
          <div className="flex items-center gap-3 w-full max-w-xs justify-center mt-2">
            {/* Left bracket line */}
            <div className="flex items-center flex-1">
              <div className="w-[1.5px] h-[8px] bg-black flex-shrink-0" />
              <div className="h-[1.5px] bg-black flex-1" />
            </div>
            <span 
              className="text-[8px] font-bold text-black tracking-[0.22em] whitespace-nowrap uppercase"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              KNOW WHAT WORKS BEFORE YOU BUILD.
            </span>
            {/* Right bracket line */}
            <div className="flex items-center flex-1">
              <div className="h-[1.5px] bg-black flex-1" />
              <div className="w-[1.5px] h-[8px] bg-black flex-shrink-0" />
            </div>
          </div>
          <p className="text-black/75 text-xs font-black mt-4">India's most comprehensive startup intelligence platform</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: Enter identifier */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-xl font-black text-slate-900 mb-1">Welcome Back</h1>
                <p className="text-slate-500 text-xs font-bold mb-6">Sign in to access your startup intelligence dashboard</p>

                {/* Mode toggle */}
                <div className="flex bg-slate-100 border border-black/10 rounded-xl p-1 mb-5 gap-1">
                  {[{ id: 'phone', icon: Phone, label: 'Phone OTP' }, { id: 'email', icon: Mail, label: 'Email Access' }].map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setMode(m.id); setIdentifier(''); setError(''); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${mode === m.id ? 'bg-[#48d2e1] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <m.icon className="w-3.5 h-3.5" />
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="mb-5">
                  <label className="text-xs font-black text-slate-700 mb-1.5 block">
                    {mode === 'phone' ? 'Mobile Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {mode === 'phone' && (
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 text-sm font-bold border-r-2 border-black pr-3">+91</span>
                    )}
                    <input
                      type={mode === 'phone' ? 'tel' : 'email'}
                      value={identifier}
                      onChange={e => { setIdentifier(e.target.value); setError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      placeholder={mode === 'phone' ? '9876543210' : 'you@example.com'}
                      className={`w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-all text-sm ${mode === 'phone' ? 'pl-16' : ''}`}
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-650 text-xs font-bold mt-1.5">{error}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading || !identifier}
                  className="w-full bg-[#48d2e1] hover:bg-[#35d5e5] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <>{mode === 'phone' ? 'Send OTP' : 'Continue'} <ArrowRight className="w-4 h-4" /></>}
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-[2px] bg-black/10"></div>
                  <span className="px-3 text-xs font-bold text-slate-400 uppercase">Or</span>
                  <div className="flex-1 h-[2px] bg-black/10"></div>
                </div>

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </motion.div>
            )}

            {/* STEP 2: Verify OTP or enter Password */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold mb-5">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                {mode === 'phone' ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-slate-900" />
                      <h1 className="text-lg font-black text-slate-900">Verify OTP</h1>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold mb-6 leading-relaxed">
                      We sent a 6-digit OTP code to <span className="text-slate-900 font-bold">+91 {identifier}</span>
                    </p>

                    <div className="flex gap-2 mb-4 justify-between">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => inputRefs.current[idx] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(e.target.value, idx)}
                          onKeyDown={e => handleOtpKeyDown(e, idx)}
                          className={`w-12 h-14 text-center text-xl font-bold bg-white border-2 border-black rounded-xl text-slate-900 outline-none focus:bg-slate-50 transition-all ${digit ? 'border-[#48d2e1]' : 'border-black'}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-slate-900" />
                      <h1 className="text-lg font-black text-slate-900">Enter Password</h1>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold mb-6">
                      Password secures your account on <span className="text-slate-900 font-bold">{identifier}</span>.
                    </p>

                    <div className="mb-4">
                      <input
                        type="password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="••••••"
                        className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-slate-900 font-bold placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-all text-sm"
                        autoFocus
                      />
                    </div>
                  </>
                )}

                {error && <p className="text-red-650 text-xs font-bold mb-3">{error}</p>}

                <button
                  onClick={handleVerifyOtpOrPassword}
                  disabled={loading || (mode === 'phone' && otp.join('').length < 6) || (mode === 'email' && !password)}
                  className="w-full bg-[#48d2e1] hover:bg-[#35d5e5] disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] mb-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <>Verify & Continue <ArrowRight className="w-4 h-4" /></>}
                </button>

                {mode === 'phone' && (
                  <p className="text-center text-slate-500 text-xs font-bold">
                    {countdown > 0
                      ? <span>Resend OTP in <span className="text-slate-900 font-bold">{countdown}s</span></span>
                      : <button onClick={handleResend} className="text-slate-900 font-black hover:underline">Resend OTP</button>
                    }
                  </p>
                )}
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 bg-emerald-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <h2 className="text-xl font-black text-slate-900 mb-2">You're in!</h2>
                <p className="text-slate-500 text-xs font-semibold">Redirecting to your dashboard…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-wider mt-6">
          StartupIntel © 2026 · Built for founders & analysts
        </p>
      </div>
    </div>
  );
};
