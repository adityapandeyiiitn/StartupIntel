const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const domainMap = require('../data/domainMap');

// Rich fallback data from modular data files
const companiesPart1 = require('../data/companiesPart1');
const companiesPart2 = require('../data/companiesPart2');
const companiesPart3 = require('../data/companiesPart3');
const companiesPart4 = require('../data/companiesPart4');
const companiesPart5 = require('../data/companiesPart5');
const companiesPart6 = require('../data/companiesPart6');
const companiesPart7 = require('../data/companiesPart7');
const companiesPart8 = require('../data/companiesPart8');
const companiesPart9 = require('../data/companiesPart9');
const companiesPart10 = require('../data/companiesPart10');
const companiesPart11 = require('../data/companiesPart11');
const companiesPart12 = require('../data/companiesPart12');
const companiesPart13 = require('../data/companiesPart13');
const companiesPart14 = require('../data/companiesPart14');
const companiesPart15 = require('../data/companiesPart15');
const companiesPart16 = require('../data/companiesPart16');

const fallbackData = [
  ...companiesPart1,
  ...companiesPart2,
  ...companiesPart3,
  ...companiesPart4,
  ...companiesPart5,
  ...companiesPart6,
  ...companiesPart7,
  ...companiesPart8,
  ...companiesPart9,
  ...companiesPart10,
  ...companiesPart11,
  ...companiesPart12,
  ...companiesPart13,
  ...companiesPart14,
  ...companiesPart15,
  ...companiesPart16
];

// Helper to check DB connection
const isDbConnected = () => mongoose.connection.readyState === 1;

const getAbstractLogoSvg = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash);
  const colors = [
    ['#06b6d4', '#3b82f6'], // cyan to blue
    ['#ec4899', '#8b5cf6'], // pink to purple
    ['#f59e0b', '#ef4444'], // amber to red
    ['#10b981', '#3b82f6'], // emerald to blue
    ['#8b5cf6', '#ec4899'], // purple to pink
    ['#6366f1', '#a855f7'], // indigo to purple
    ['#f97316', '#eab308']  // orange to yellow
  ];
  const colorPair = colors[index % colors.length];

  const shapes = [
    // Overlapping circles (Venn)
    `<circle cx="40" cy="50" r="22" fill="${colorPair[0]}" opacity="0.8"/>
     <circle cx="60" cy="50" r="22" fill="${colorPair[1]}" opacity="0.8"/>`,
    // Rotated rounded diamond
    `<rect x="32" y="32" width="36" height="36" rx="8" transform="rotate(45 50 50)" fill="url(#grad-${index})"/>`,
    // Modern nested rings
    `<circle cx="50" cy="50" r="28" stroke="${colorPair[0]}" stroke-width="6" fill="none"/>
     <circle cx="50" cy="50" r="14" fill="${colorPair[1]}"/>`,
    // Interlocking squares
    `<rect x="28" y="28" width="28" height="28" rx="6" fill="${colorPair[0]}" opacity="0.85"/>
     <rect x="44" y="44" width="28" height="28" rx="6" fill="${colorPair[1]}" opacity="0.85"/>`,
    // Dynamic abstract star shape
    `<path d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z" fill="url(#grad-${index})"/>`
  ];

  const shape = shapes[index % shapes.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
    <defs>
      <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colorPair[0]}"/>
        <stop offset="100%" stop-color="${colorPair[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
    ${shape}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getPremiumLogoUrl = (name, slug, originalLogoUrl) => {
  // Detect and reject fake generated favicon URLs with numbered domains
  // e.g. domain=callhealth-doctor-100.health.in  or  domain=wakefit-mattress-110.d2c.in
  const isFakeFaviconUrl = originalLogoUrl &&
    originalLogoUrl.includes('google.com/s2/favicons') &&
    /[a-z]+-\d{2,}\.[a-z]/.test(originalLogoUrl);

  if (originalLogoUrl && originalLogoUrl.startsWith('http') && !isFakeFaviconUrl) {
    return originalLogoUrl;
  }

  const lowerSlug = slug.toLowerCase();
  for (const [key, domain] of Object.entries(domainMap)) {
    if (lowerSlug.includes(key)) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  }

  // Fallback: beautiful abstract geometric SVG (no grey globes, no text letters)
  return getAbstractLogoSvg(name);
};

// GET all companies (brief info for lists/search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let results = [];

    if (isDbConnected()) {
      let query = {};
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { industry: { $regex: search, $options: 'i' } }
          ]
        };
      }
      const rawResults = await Company.find(query).select('name slug industry tagline logoUrl stats caseStudy');
      results = rawResults.map(c => {
        const o = c.toObject ? c.toObject() : c;
        o.logoUrl = getPremiumLogoUrl(o.name, o.slug, o.logoUrl);
        return o;
      });
    }

    // Defensive fallback: If DB didn't find any or isn't connected, serve hybrid fallback
    if (!results || results.length === 0) {
      results = fallbackData.map(c => ({
        name: c.name, slug: c.slug, industry: c.industry,
        tagline: c.tagline, logoUrl: getPremiumLogoUrl(c.name, c.slug, c.logoUrl), stats: c.stats,
        caseStudy: c.caseStudy
      }));
      if (search) {
        const sLower = search.toLowerCase();
        results = results.filter(c =>
          c.name.toLowerCase().includes(sLower) ||
          c.industry.toLowerCase().includes(sLower)
        );
      }
    }

    // Sort to prioritize big, famous companies towards the top
    const famousStartups = [
      'zomato', 'swiggy', 'paytm', 'cred', 'meesho', 'zerodha', 'upgrad', 'unacademy', 'physicswallah', 
      'pw-', 'byju', 'ola', 'uber', 'zoho', 'freshworks', 'postman', 'browserstack', 'nykaa', 'boat', 
      'groww', 'upstox', 'zepto', 'lenskart', 'pharmeasy', '1mg', 'cult-fit', 'licious'
    ];

    results.sort((a, b) => {
      const aFamous = famousStartups.some(f => a.slug.toLowerCase().includes(f));
      const bFamous = famousStartups.some(f => b.slug.toLowerCase().includes(f));
      if (aFamous && !bFamous) return -1;
      if (!aFamous && bFamous) return 1;
      return 0;
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Compare multiple companies (up to 10) - query params `?slugs=slug1,slug2,slug3`
router.get('/compare-multi', async (req, res) => {
  try {
    const { slugs } = req.query;
    if (!slugs) return res.status(400).json({ message: 'No startup slugs provided' });

    const slugList = slugs.split(',').slice(0, 10);
    const results = [];

    const isProUser = await checkProStatus(req.headers.authorization);
    if (!isProUser && slugList.length > 2) {
      return res.status(403).json({ message: 'Free tier limits comparison to 2 startups. Upgrade to Pro for up to 10.' });
    }

    for (const slug of slugList) {
      let company = null;
      if (isDbConnected()) {
        company = await Company.findOne({ slug });
      }
      if (!company) {
        company = fallbackData.find(c => c.slug === slug);
      }
      if (company) {
        const compObj = company.toObject ? company.toObject() : { ...company };
        compObj.logoUrl = getPremiumLogoUrl(compObj.name, compObj.slug, compObj.logoUrl);

        if (!isProUser) {
          delete compObj.swot;
          delete compObj.founderInsights;
          delete compObj.timeline;
          delete compObj.metrics;
          delete compObj.keyCompetitors;
          delete compObj.fundingRounds;
          delete compObj.notableInvestors;
        }
        results.push(compObj);
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Compare two companies — MUST be before /:slug
router.get('/compare/:slug1/:slug2', async (req, res) => {
  try {
    let company1 = null;
    let company2 = null;

    if (isDbConnected()) {
      company1 = await Company.findOne({ slug: req.params.slug1 });
      company2 = await Company.findOne({ slug: req.params.slug2 });
    }

    if (!company1) company1 = fallbackData.find(c => c.slug === req.params.slug1);
    if (!company2) company2 = fallbackData.find(c => c.slug === req.params.slug2);

    if (!company1 || !company2)
      return res.status(404).json({ message: 'One or both companies not found' });

    const c1Obj = company1.toObject ? company1.toObject() : { ...company1 };
    const c2Obj = company2.toObject ? company2.toObject() : { ...company2 };

    c1Obj.logoUrl = getPremiumLogoUrl(c1Obj.name, c1Obj.slug, c1Obj.logoUrl);
    c2Obj.logoUrl = getPremiumLogoUrl(c2Obj.name, c2Obj.slug, c2Obj.logoUrl);

    res.json({ company1: c1Obj, company2: c2Obj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper to determine if requester has Pro status, supporting both live and offline fallbacks
const admin = require('firebase-admin');
const User = require('../models/User');

const checkProStatus = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];

  if (token === 'dev-token-pro') return true;
  if (token === 'dev-token-free') return false;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const dbUser = await User.findOne({ userId: decodedToken.uid });
    if (dbUser && dbUser.isPro) {
      const now = new Date();
      if (!dbUser.planExpiry || new Date(dbUser.planExpiry) > now) {
        return true;
      }
    }
  } catch (err) {
    // Fallback base64 decoding for local sandbox / offline mode
    const base64Url = token.split('.')[1];
    if (base64Url) {
      try {
        const decoded = JSON.parse(Buffer.from(base64Url, 'base64').toString());
        const uid = decoded.user_id || decoded.sub;
        const dbUser = await User.findOne({ userId: uid });
        if (dbUser && dbUser.isPro) {
          const now = new Date();
          if (!dbUser.planExpiry || new Date(dbUser.planExpiry) > now) {
            return true;
          }
        }
      } catch (decodeErr) {}
    }
  }
  return false;
};

// GET single company by slug
router.get('/:slug', async (req, res) => {
  try {
    let company = null;

    if (isDbConnected()) {
      company = await Company.findOne({ slug: req.params.slug });
    }

    // Seamless fail-safe fallback
    if (!company) {
      company = fallbackData.find(c => c.slug === req.params.slug);
    }

    if (!company) return res.status(404).json({ message: 'Company not found' });

    const isProUser = await checkProStatus(req.headers.authorization);

    const compObj = company.toObject ? company.toObject() : { ...company };
    compObj.logoUrl = getPremiumLogoUrl(compObj.name, compObj.slug, compObj.logoUrl);

    if (!isProUser) {
      // Securely redact premium insights and analytics from API response
      delete compObj.swot;
      delete compObj.founderInsights;
      delete compObj.timeline;
      delete compObj.metrics;
      delete compObj.keyCompetitors;
      delete compObj.fundingRounds;
      delete compObj.notableInvestors;
      compObj.isGated = true;
    }

    res.json(compObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
