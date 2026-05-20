import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isPro, setIsPro] = useState(false);

  // Sync Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);

          // Get cached user metadata
          const stored = localStorage.getItem('sip_user');
          const cached = stored ? JSON.parse(stored) : {};

          const updatedUser = {
            uid: fbUser.uid,
            email: fbUser.email || cached.email || '',
            phone: fbUser.phoneNumber || cached.phone || '',
            plan: cached.plan || 'free'
          };

          // Fetch fresh subscription plan status from backend database
          try {
            const res = await fetch('http://localhost:5000/api/payments/status', {
              headers: {
                'Authorization': `Bearer ${idToken}`
              }
            });
            if (res.ok) {
              const statusData = await res.json();
              updatedUser.plan = statusData.isPro ? 'pro' : 'free';
            }
          } catch (statusErr) {
            console.warn('Subscription status check offline, using cached metadata.', statusErr.message);
          }

          setUser(updatedUser);
          setIsPro(updatedUser.plan === 'pro');
          localStorage.setItem('sip_user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Error syncing auth state:', err);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsPro(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithFirebase = (uData, idToken) => {
    setUser(uData);
    setToken(idToken);
    setIsPro(uData.plan === 'pro');
    localStorage.setItem('sip_user', JSON.stringify(uData));
  };

  const upgradeToPro = () => {
    if (!user) return;
    const u = { ...user, plan: 'pro' };
    setUser(u);
    setIsPro(true);
    localStorage.setItem('sip_user', JSON.stringify(u));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setToken(null);
    setIsPro(false);
    localStorage.removeItem('sip_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      isPro, 
      loading, 
      loginWithFirebase, 
      upgradeToPro, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
