import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Shield, CreditCard, Smartphone, CheckCircle, Loader2, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const plans = {
  monthly: { label: 'Monthly Plan', price: 699, priceDisplay: '₹699/mo', billed: 'Billed ₹699 monthly', savings: null },
  annual: { label: 'Annual Plan', price: 5988, priceDisplay: '₹499/mo', billed: 'Billed ₹5,988 annually', savings: 'Save ₹2,400/year' },
};

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, token, upgradeToPro, isPro } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const plan = plans[selectedPlan];

  const handlePayment = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    setError('');

    // Load Razorpay script dynamically
    const scriptLoaded = await new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    if (!scriptLoaded) {
      setError('Payment gateway failed to load. Please refresh and try again.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planType: selectedPlan })
      });

      if (!orderRes.ok) {
        throw new Error('Failed to initiate subscription order. Please try again.');
      }

      const orderData = await orderRes.json();

      // 2. Setup Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'StartupIntel Pro',
        description: plan.label,
        order_id: orderData.orderId,
        image: 'https://www.google.com/s2/favicons?domain=startupintel.in&sz=128',
        prefill: {
          name: user?.name || 'StartupIntel User',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#06b6d4' },
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify Payment Signature on Backend
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify-signature', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: selectedPlan
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              upgradeToPro();
              setSuccess(true);
              setTimeout(() => navigate('/'), 2500);
            } else {
              setError(verifyData.message || 'Signature verification failed.');
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setError('Verification system unreachable but payment captured. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setError('Payment failed: ' + resp.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      setError(e.message || 'Could not open payment gateway. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Pro! 🎉</h2>
          <p className="text-slate-500">Your account has been upgraded. Redirecting to dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/pricing')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Pricing
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/25">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upgrade to StartupIntel Pro</h1>
            <p className="text-slate-500 text-sm">Unlock AI insights, financial models & sector reports</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Left: Plan selection + payment */}
        <div className="lg:col-span-3 space-y-5">
          {/* Plan selector */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Choose Your Plan</h2>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedPlan === key ? 'border-cyan-500 bg-cyan-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === key ? 'border-cyan-600' : 'border-slate-300'}`}>
                      {selectedPlan === key && <div className="w-2 h-2 rounded-full bg-cyan-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                      <p className="text-xs text-slate-500">{p.billed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{p.priceDisplay}</p>
                    {p.savings && <p className="text-xs font-bold text-emerald-600">{p.savings}</p>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Payment method info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Payment via Razorpay</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: CreditCard, label: 'Cards', sub: 'Visa, Mastercard, Amex' },
                { icon: Smartphone, label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
                { icon: Shield, label: 'Net Banking', sub: 'All major banks' },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <m.icon className="w-5 h-5 text-slate-600 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-800">{m.label}</p>
                  <p className="text-[10px] text-slate-400">{m.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
          )}

          {/* Pay button */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={handlePayment}
            disabled={loading || isPro}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/20 text-base"
          >
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
              : isPro
              ? <><CheckCircle className="w-5 h-5" /> Already Pro</>
              : <><Lock className="w-4 h-4 text-amber-300" /> Pay {selectedPlan === 'annual' ? '₹5,988' : '₹699'} Securely</>
            }
          </motion.button>
          <p className="text-center text-slate-400 text-xs flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Secured by Razorpay. Cancel anytime.
          </p>
          
          {/* Quick simulator helper */}
          {!isPro && (
            <button
              onClick={() => {
                upgradeToPro();
                setSuccess(true);
                setTimeout(() => navigate('/'), 2000);
              }}
              className="w-full mt-3 bg-amber-400 hover:bg-amber-500 text-black border-2 border-black rounded-xl py-3 font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5"
            >
              <Crown className="w-4 h-4 fill-amber-950 stroke-black text-amber-950" />
              Simulate Instant Pro Upgrade (Developer Fast-Pass)
            </button>
          )}
        </div>

        {/* Right: Order summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-24">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">StartupIntel Pro ({plan.label})</span>
                <span className="font-semibold text-slate-900">{plan.priceDisplay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">GST (18%)</span>
                <span className="font-semibold text-slate-900">Included</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-cyan-600 text-lg">
                {selectedPlan === 'annual' ? '₹5,988/year' : '₹699/month'}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              {[
                'AI Founder Q&A on all companies',
                'Unlimited case study access',
                'Financial models & projections',
                'Export reports as PDF',
                'Investor intelligence reports',
                'Priority support',
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
