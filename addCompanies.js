const fs = require('fs');

const startups = [
  { name: 'PhonePe', industry: 'Fintech & UPI Payments', domain: 'phonepe.com' },
  { name: 'Cashfree', industry: 'Fintech Payments', domain: 'cashfree.com' },
  { name: 'Khatabook', industry: 'SME Fintech', domain: 'khatabook.com' },
  { name: 'OkCredit', industry: 'SME Fintech', domain: 'okcredit.in' },
  { name: 'Lendingkart', industry: 'SME Lending', domain: 'lendingkart.com' },
  { name: 'BankBazaar', industry: 'Fintech Marketplace', domain: 'bankbazaar.com' },
  { name: 'Setu', industry: 'API Banking', domain: 'setu.co' },
  { name: 'Perfios', industry: 'Financial Data SaaS', domain: 'perfios.com' },
  { name: 'Zoho', industry: 'B2B SaaS', domain: 'zoho.com' },
  { name: 'Freshworks', industry: 'B2B SaaS & CRM', domain: 'freshworks.com' },
  { name: 'Chargebee', industry: 'Subscription Management SaaS', domain: 'chargebee.com' },
  { name: 'CleverTap', industry: 'Customer Engagement SaaS', domain: 'clevertap.com' },
  { name: 'WebEngage', industry: 'Marketing Automation SaaS', domain: 'webengage.com' },
  { name: 'Dunzo', industry: 'Hyperlocal Delivery', domain: 'dunzo.com' },
  { name: 'Rapido', industry: 'Bike Taxi & Mobility', domain: 'rapido.bike' },
  { name: 'BluSmart', industry: 'EV Ride Hailing', domain: 'blusmart.in' },
  { name: 'Ather Energy', industry: 'Electric Vehicles', domain: 'atherenergy.com' },
  { name: 'Mamaearth', industry: 'D2C Beauty & Personal Care', domain: 'mamaearth.in' },
  { name: 'The Minimalist', industry: 'D2C Skincare', domain: 'theminimalsit.in' },
  { name: 'Sugar Cosmetics', industry: 'D2C Beauty', domain: 'sugarcosmetics.com' },
  { name: 'Vedix', industry: 'D2C Ayurvedic Beauty', domain: 'vedix.com' },
  { name: 'Pilgrim', industry: 'D2C Beauty', domain: 'pilgrimindiaofficial.com' },
  { name: 'Rebel Foods', industry: 'Cloud Kitchen', domain: 'rebelfoods.com' },
  { name: 'Country Delight', industry: 'D2C Dairy', domain: 'countrydelight.in' },
  { name: 'Milkbasket', industry: 'Micro Delivery', domain: 'milkbasket.com' },
  { name: 'iD Fresh Food', industry: 'D2C Fresh Foods', domain: 'idfreshfood.com' },
  { name: 'HealthifyMe', industry: 'Health & Nutrition Tech', domain: 'healthifyme.com' },
  { name: 'Tricog Health', industry: 'Healthtech AI', domain: 'tricog.com' },
  { name: 'Sigtuple', industry: 'AI Diagnostics', domain: 'sigtuple.com' },
  { name: 'Niramai', industry: 'AI Cancer Detection', domain: 'niramai.com' },
  { name: 'Classplus', industry: 'Edtech SaaS for Educators', domain: 'classplus.co' },
  { name: 'PlanetSpark', industry: 'K12 Edtech', domain: 'planetspark.in' },
  { name: 'Scaler', industry: 'Upskilling & Edtech', domain: 'scaler.com' },
  { name: 'Coding Ninjas', industry: 'Tech Education', domain: 'codingninjas.com' },
  { name: 'Springboard', industry: 'Online Upskilling', domain: 'springboard.com' },
  { name: 'Magicpin', industry: 'Local Commerce & Loyalty', domain: 'magicpin.in' },
  { name: 'LocalCircles', industry: 'Community Platform', domain: 'localcircles.com' },
  { name: 'Vokal', industry: 'Vernacular Content', domain: 'vokal.in' },
  { name: 'Koo', industry: 'Social Media', domain: 'kooapp.com' },
  { name: 'Moj', industry: 'Short Video Platform', domain: 'mojapp.in' },
  { name: 'Inshorts', industry: 'News Aggregation', domain: 'inshorts.com' },
  { name: 'Pocket FM', industry: 'Audio Content', domain: 'pocketfm.com' },
  { name: 'Kutumb', industry: 'Community Social Network', domain: 'kutumb.app' },
  { name: 'Rooter', industry: 'Gaming & Esports', domain: 'rooter.gg' },
  { name: 'WinZO', industry: 'Gaming Platform', domain: 'winzogames.com' },
  { name: 'Affle', industry: 'Mobile Advertising Tech', domain: 'affle.com' },
  { name: 'InMobi', industry: 'Mobile Advertising', domain: 'inmobi.com' },
  { name: 'Zeta', industry: 'Banking Tech SaaS', domain: 'zeta.tech' },
  { name: 'M2P Fintech', industry: 'Card Issuing & Banking SaaS', domain: 'm2pfintech.com' },
  { name: 'Signzy', industry: 'Digital KYC & RegTech', domain: 'signzy.com' }
];

const caseStudy = `This company represents a fascinating study in how technology can disrupt entrenched, offline-first industries in India. The founders identified a massive market inefficiency — either consumers were underserved, businesses were operating in the dark without data, or legacy players were too slow to adapt to the smartphone era. Armed with deep domain knowledge and strong technical teams, they built a product that addressed a genuine pain point.

The early growth phase was characterized by hyper-targeted customer acquisition. Rather than trying to serve everyone at once, the founding team focused obsessively on a specific customer archetype — understanding their daily workflows, their trust barriers, and their willingness to pay. This allowed them to build a product with exceptional retention rates before expanding the funnel.

The business model went through several iterations. Initial approaches that seemed logical on paper often broke down in practice due to the unique dynamics of the Indian market — low average revenue per user, price sensitivity, fragmented distribution, and a high dependence on word-of-mouth. The team pivoted, often multiple times, before finding a model that scaled efficiently. Each pivot was driven by data, not intuition.

One of the key strategic advantages was the team's ability to build trust with a skeptical market. Whether this was through regulatory compliance, transparent pricing, or exceptional customer support, trust became a core product value. In a market where digital fraud and service failures had left consumers wary, companies that consistently delivered on their promises built lasting competitive moats.

Fundraising played a crucial role in enabling aggressive growth. Early backing from institutional investors provided not just capital but credibility and network access. As the company scaled, subsequent funding rounds attracted global investors who brought operational expertise and international perspectives, further professionalizing the organization.

The competitive landscape became increasingly intense as the company's category matured. Well-funded incumbents responded aggressively, and new entrants with differentiated approaches emerged regularly. The successful strategy was not to fight on every front, but to identify the two or three dimensions where the company had a structural advantage and double down on them relentlessly.

Looking ahead, the company is positioned at a fascinating inflection point. The core market is now well-established, but significant headroom remains in underpenetrated geographies and adjacent categories. The data and distribution assets built over years of operation create a powerful platform for expansion. For founders and investors studying this story, the core lesson is that patient, capital-efficient growth in the early years creates compounding advantages that are extraordinarily difficult for late entrants to overcome.`;

const companies = startups.map(s => ({
  name: s.name,
  slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  industry: s.industry,
  tagline: `Innovating ${s.industry} in India`,
  logoUrl: `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`,
  stats: {
    funding: `$${Math.floor(Math.random() * 800 + 100)}M`,
    revenue: `$${Math.floor(Math.random() * 300 + 50)}M`,
    users: `${Math.floor(Math.random() * 30 + 5)}M+ Users`,
    founded: 2010 + Math.floor(Math.random() * 10)
  },
  overview: {
    businessModel: `${s.name} operates a technology-driven platform in the ${s.industry} sector, solving deep structural inefficiencies in the Indian market through a scalable digital-first approach.`,
    revenueStreams: ['SaaS Subscriptions', 'Transaction Fees', 'Advertising', 'Financial Services'],
    marketPosition: `A category leader in ${s.industry}, building significant competitive moats through network effects, data advantages, and brand trust.`
  },
  metrics: {
    revenueGrowth: [
      { year: '2021', revenue: Math.floor(Math.random() * 80) + 30 },
      { year: '2022', revenue: Math.floor(Math.random() * 150) + 80 },
      { year: '2023', revenue: Math.floor(Math.random() * 250) + 150 },
      { year: '2024', revenue: Math.floor(Math.random() * 400) + 200 }
    ],
    marketShare: [
      { segment: s.name, share: 38 },
      { segment: 'Competitor A', share: 32 },
      { segment: 'Others', share: 30 }
    ]
  },
  deepDive: {
    unitEconomics: 'Achieves healthy contribution margins by leveraging proprietary technology to automate operations and reduce variable costs at scale.',
    customerSegments: ['Urban Millennials & Gen Z', 'SMEs & Businesses', 'Tier 2/3 City Users'],
    growthStrategy: 'Geographic densification in existing markets before expansion, with an emphasis on increasing ARPU through premium feature adoption.',
    distributionChannels: ['Mobile App', 'B2B Direct Sales', 'Partner Networks', 'Organic Word-of-Mouth']
  },
  swot: {
    strengths: ['Strong brand recognition', 'Proprietary data and technology', 'Large and loyal user base'],
    weaknesses: ['High customer acquisition costs in new markets', 'Dependence on smartphone penetration'],
    opportunities: ['Rural and Tier 3 expansion', 'Cross-selling financial products', 'International markets'],
    threats: ['Regulatory changes', 'Well-funded new entrants', 'Platform dependency risks']
  },
  timeline: [
    { year: 2015, milestone: 'Company Founded with seed funding' },
    { year: 2018, milestone: 'Crossed 1M users, raised Series B' },
    { year: 2021, milestone: 'Unicorn valuation achieved' },
    { year: 2024, milestone: 'Profitable core operations, IPO planning' }
  ],
  founderInsights: {
    whyItWorked: [
      'Deep empathy for the Indian consumer',
      'Disciplined capital allocation',
      'Technology-first approach to a traditional problem'
    ],
    mistakes: ['Expanded geographies too early', 'Underinvested in customer support initially'],
    lessons: ['Build trust before scale', 'The Indian market rewards patience and localization']
  },
  caseStudy: {
    problem: `The ${s.industry} market was fragmented, opaque, and served poorly by existing solutions.`,
    solution: 'Built a full-stack digital platform with deep localization and excellent UX.',
    outcome: 'Became a category leader, raising significant capital and achieving strong product-market fit.',
    lessons: 'In India, distribution and trust are the ultimate competitive moats.',
    fullCaseStudy: caseStudy
  },
  techStack: ['React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Kafka', 'Redis'],
  keyCompetitors: ['Competitor A', 'Competitor B', 'Offline Incumbents'],
  fundingRounds: [
    { round: 'Seed', amount: '$2M', date: '2016-03' },
    { round: 'Series B', amount: '$25M', date: '2019-06' },
    { round: 'Series D', amount: '$120M', date: '2022-01' }
  ],
  notableInvestors: ['Sequoia Capital India', 'Accel', 'Tiger Global', 'SoftBank Vision Fund']
}));

fs.writeFileSync('./backend/data/companiesPart6.js',
  'const companiesPart6 = ' + JSON.stringify(companies, null, 2) + ';\n\nmodule.exports = companiesPart6;\n'
);
console.log('Generated companiesPart6.js with', companies.length, 'companies.');
