// Part 1: Zomato & Swiggy
const companiesPart1 = [
  {
    name: 'Zomato',
    slug: 'zomato',
    industry: 'Food Delivery & Dining',
    tagline: 'Better food for more people',
    logoUrl: 'https://www.google.com/s2/favicons?domain=zomato.com&sz=128',
    stats: { funding: '$2.1B', revenue: '$1.4B', users: '17.5M+ MTU', founded: 2008 },
    overview: {
      businessModel: 'Aggregator & Hyperlocal Delivery Model. Zomato connects three sides of a marketplace: hungry customers, restaurant partners, and delivery executives. Revenue is earned through commissions on orders, advertising from restaurants, and B2B supply via Hyperpure. Blinkit (acquired 2022) has expanded this into quick commerce.',
      revenueStreams: ['Delivery Fees & Platform Commissions (18-25%)', 'Restaurant Advertising & Listing Fees', 'Hyperpure B2B Supply Chain', 'Blinkit Quick Commerce', 'Zomato Gold Subscriptions'],
      marketPosition: 'Market leader in Indian food delivery (~55% GMV share). Listed on Indian exchanges, stock has 5x\'d from IPO lows. Blinkit dominates quick commerce at ~46% share.'
    },
    metrics: {
      revenueGrowth: [{ year: '2020', revenue: 160 }, { year: '2021', revenue: 260 }, { year: '2022', revenue: 560 }, { year: '2023', revenue: 860 }, { year: '2024', revenue: 1400 }],
      marketShare: [{ segment: 'Zomato', share: 55 }, { segment: 'Swiggy', share: 45 }]
    },
    deepDive: {
      unitEconomics: 'Zomato achieved contribution margin positivity by layering platform fees (₹5-9 per order), reducing delivery subsidies, and driving ad revenue. Blinkit is EBITDA break-even. AOV (Average Order Value) has grown steadily to ₹450+, reducing delivery cost per rupee earned.',
      customerSegments: ['Urban millennials & Gen Z (core 22-35 age group)', 'Working professionals ordering 3+ times/week', 'Restaurants seeking digital discovery & orders', 'B2B food suppliers using Hyperpure', 'Quick-commerce grocery shoppers (Blinkit)'],
      growthStrategy: 'Go Deep, Not Wide: Instead of expanding to 500 cities, Zomato focused on deepening presence in the top 50 cities. This "network density" strategy increases delivery efficiency, reduces ETA, and improves restaurant partner ROI. Parallel vertical expansion into grocery (Blinkit) created a second high-frequency flywheel.',
      distributionChannels: ['iOS & Android App (primary)', 'Restaurant tie-ups and exclusives', 'Zomato Gold loyalty program', 'Digital advertising & performance marketing', 'Hyperpure direct sales force']
    },
    swot: {
      strengths: ['#1 brand recall in Indian food delivery', 'Blinkit acquisition created a quick commerce moat', 'High-margin advertising platform growing 60% YoY', 'Transparent investor communication builds trust', 'Strong supply-side (restaurant) relationships'],
      weaknesses: ['High dependency on gig delivery workers — regulatory risk', 'Thin margins in core food delivery (2-4% EBITDA)', 'Blinkit requires continuous dark store capex', 'Weather and logistics disruptions affect reliability'],
      opportunities: ['Zomato Live (events & ticketing) — new high-margin vertical', 'Hyperpure scaling to non-restaurant clients', 'International markets in SEA and Middle East', 'Financial services for restaurant partners'],
      threats: ['ONDC (Open Network for Digital Commerce) disrupting aggregator model', 'Regulatory crackdowns on gig worker classification', 'Swiggy price wars and discount battles', 'Rising fuel costs increasing delivery opex']
    },
    timeline: [
      { year: 2008, milestone: 'Deepinder Goyal & Pankaj Chaddah launch Foodiebay as a restaurant menu aggregator' },
      { year: 2010, milestone: 'Rebranded to Zomato. Raised first round from Info Edge India' },
      { year: 2012, milestone: 'International expansion begins — UAE, UK, Philippines' },
      { year: 2015, milestone: 'Launched Zomato Order (food delivery product)' },
      { year: 2018, milestone: 'Acquired Runnr delivery startup; launched Hyperpure B2B supplies' },
      { year: 2021, milestone: 'Landmark IPO at ₹9,375 Cr — India\'s biggest tech IPO at the time' },
      { year: 2022, milestone: 'Acquired Blinkit (formerly Grofers) for $568M in all-stock deal' },
      { year: 2023, milestone: 'Achieved first EBITDA-positive quarter. Zomato Live launched.' },
      { year: 2024, milestone: 'Blinkit surpasses 1000 dark stores. Revenue crosses $1.4B annualised.' }
    ],
    founderInsights: {
      whyItWorked: [
        'Radical transparency: Deepinder Goyal publicly shares strategy, failures, and financial data directly on LinkedIn — building unmatched investor trust',
        'Willingness to make bold, contrarian bets: The Blinkit acquisition was made at a time when quick commerce was being written off by many investors',
        'Network density strategy: focused on making existing cities deeply profitable rather than chasing vanity metrics of city count',
        'Built a world-class advertising platform that treats restaurants as media publishers — creating a high-margin revenue layer on top of low-margin delivery',
        'Culture of speed and experimentation: Launched and killed multiple products (Zomato Instant, etc.) without ego'
      ],
      mistakes: [
        'Aggressive international expansion to 24 countries without achieving unit economics — had to retreat from most markets by 2019',
        'Multiple failed experiments: Zomato Grocery during COVID 1.0, Zomato Instant (separate quick delivery app), Nutraceuticals',
        'Underestimated the capital intensity of building a reliable gig worker supply chain in smaller cities',
        'Early over-reliance on discounting to acquire users created unsustainable CAC expectations'
      ],
      lessons: [
        'Profitability is a choice, not an inevitability of scale. You choose it by saying no to low-quality growth.',
        'Your second business (Blinkit) can dwarf your first if you own the customer relationship and logistics.',
        'Transparency with shareholders is not just ethics — it is a competitive advantage in investor relations.',
        'Retreat is not failure. Exiting 23 international markets was a strategic decision that saved the company.'
      ]
    },
    caseStudy: {
      problem: 'By 2020-21, Zomato was burning $40M+ per month with no visible path to profitability.',
      solution: 'Introduced platform fees, cracked down on discounting, and built ad revenue as a parallel business.',
      outcome: 'Turned EBITDA positive in Q2 FY24, stock 5x\'d from its all-time low.',
      lessons: 'Monetize attention first. The delivery business is infrastructure; the advertising business is the margin engine.',
      fullCaseStudy: `In 2008, two IIT Delhi graduates working at Bain & Company — Deepinder Goyal and Pankaj Chaddah — noticed that their colleagues wasted hours standing in lines at the office cafeteria just to read the physical menu cards. They realized that digitizing these menus and uploading them online would save immense time. They scanned the menus and uploaded them to a portal called "Foodiebay." The idea was deceptively simple, yet highly addictive. Within weeks, Bain employees were using it daily. Recognizing a larger opportunity, they rebranded the business to Zomato in 2010 to reflect the broad, consumer-friendly identity they wanted to build.

Over the next decade, Zomato chased a hyper-aggressive growth model. Funded by Info Edge and later global tech investors, the company expanded its restaurant discovery database to 24 countries, including the UK, UAE, Philippines, and South Africa. They acquired local guide services, established massive offices, and burned hundreds of millions of dollars attempting to replicate their domestic success in foreign markets. However, they ran into a wall: the unit economics of international food discovery and delivery were radically different, and local incumbents held deep moats. By 2019, Zomato made one of the hardest strategic decisions in the history of Indian tech startups: they pulled out of 23 international markets, choosing to focus exclusively on their home turf.

Focusing back on India proved to be a masterstroke. The domestic food delivery market was undergoing a massive consolidation, transforming into a duopoly between Zomato and Swiggy. In 2020, in the middle of the COVID-19 pandemic, Zomato acquired Uber Eats India, absorbing its customer base and neutralizing a third competitor. During the pandemic lock-downs, food delivery became a vital public utility. Zomato invested heavily in hygiene standards, launched contactless delivery, and raised a massive pre-IPO round.

In July 2021, Zomato launched its landmark Initial Public Offering (IPO), raising ₹9,375 crore. It was a massive success, oversubscribed by more than 38 times, and valued the company at over ₹1 lakh crore on listing day. However, the post-listing honeymoon was short-lived. Global interest rates rose, inflation spiked, and public market investors quickly lost patience with loss-making tech startups. Zomato's stock price, which peaked at ₹169, plummeted to an all-time low of ₹40 in 2022. Analysts and media houses declared that the aggregator model was fundamentally broken and that food delivery would never yield sustainable profits.

Faced with severe market skepticism, Deepinder Goyal executed a two-pronged strategy: operational optimization in food delivery and a massive, contrarian bet on quick commerce.

First, within the core food delivery business, Zomato shifted its focus from user acquisition to margin expansion. The company introduced a ₹2 platform fee on every order, which was gradually raised to ₹5 and then ₹9 in select markets. At 15-20 million orders a month, this fee alone generated ₹30-50 crore of near-100% margin revenue every month. Simultaneously, they optimized their delivery routing algorithms to reduce fuel subsidies, renegotiated merchant commissions, and aggressively scaled Zomato Gold, a subscription program that locked in high-frequency users and reduced churn.

Second, in June 2022, Zomato announced the acquisition of Blinkit (formerly Grofers), a struggling grocery delivery startup, for $568 million in an all-stock transaction. The market reacted with horror; Zomato\'s stock fell 14% on the day of the announcement, and critics accused the company of burning shareholder money to bail out a failing business. Deepinder Goyal, however, saw a massive synergy. The infrastructure Zomato had built for food delivery—its real-time routing engine, its gig-worker fleet, and its consumer trust—could be leveraged to power a 10-minute grocery delivery model.

Instead of running Blinkit as a separate entity, Zomato integrated its backend operations. They replaced Blinkit\'s large warehouses with a network of micro-warehouses (dark stores) packed with the 5,000 most-needed household SKUs, located in dense urban corridors. By optimizing packing times to under 90 seconds, Blinkit made its 10-minute delivery promise highly reliable. As transaction density in each neighborhood grew, the delivery cost per order plummeted, and the dark stores began breaking even.

Simultaneously, Zomato\'s advertising platform became a massive profit engine. Restaurants and D2C brands desperately wanted to reach Zomato and Blinkit\'s high-intent, affluent customer base. Zomato built a Google-like auction system where sellers bid for placement on search result pages and app banners. Because this advertising revenue required almost no incremental variable cost, its gross margins were close to 90%, effectively subsidizing the low-margin delivery logistics.

The results of these changes were extraordinary. In Q2 of FY24, Zomato reported its first-ever consolidated net profit. The financial markets responded with a massive rally, and Zomato\'s stock rose over 5x from its 2022 lows, crossing ₹200 and establishing the company as a darling of public market institutional investors. Blinkit, the once-ridiculed acquisition, was now valued by analysts at over $15 billion, eclipsing the value of the core food delivery division itself.

The Zomato case study yields three profound lessons for startup founders:
First, profitability is a product of operational discipline, not just scale. Zomato achieved profitability not by waiting to get bigger, but by systematically introducing platform fees, cutting customer discounts, and optimizing delivery routes.
Second, a company\'s second act can leverage the infrastructure of its first. Blinkit succeeded because it didn\'t have to build a logistics fleet or user base from scratch; it rode on the rails Zomato had spent a decade building.
Third, transparency builds an unmatched protective moat. Deepinder Goyal\'s decision to write candid, detailed blog posts explaining business metrics and strategic errors directly to public investors helped the company weather the 2022 stock crash and emerge with investor trust intact.`
    },
    techStack: ['Node.js', 'Python', 'React Native', 'PHP (Legacy)', 'PostgreSQL', 'Redis', 'AWS', 'Kubernetes'],
    keyCompetitors: ['Swiggy', 'Zepto', 'ONDC', 'Amazon India'],
    fundingRounds: [
      { round: 'Series A', amount: '$1M', date: '2010-11' },
      { round: 'Series E', amount: '$37M', date: '2013-11' },
      { round: 'Series H', amount: '$200M', date: '2018-02' },
      { round: 'Pre-IPO', amount: '$250M', date: '2021-02' },
      { round: 'IPO', amount: '$1.3B', date: '2021-07' }
    ],
    notableInvestors: ['Info Edge India', 'Ant Group', 'Tiger Global Management', 'Temasek Holdings', 'Fidelity']
  },
  {
    name: 'Swiggy',
    slug: 'swiggy',
    industry: 'Food Delivery & Quick Commerce',
    tagline: 'Delivering unparalleled convenience',
    logoUrl: 'https://www.google.com/s2/favicons?domain=swiggy.com&sz=128',
    stats: { funding: '$3.6B', revenue: '$1.0B', users: '14M+ MTU', founded: 2014 },
    overview: {
      businessModel: 'Hyperlocal logistics platform that started with food delivery and expanded into quick commerce (Instamart), package delivery (Genie), and dining out (Dineout). Swiggy monetizes through restaurant commissions, delivery fees, subscription (Swiggy One), advertising, and product margins on Instamart.',
      revenueStreams: ['Restaurant Commissions (18-25% per order)', 'Delivery Fees', 'Instamart Product Margin', 'Swiggy One Membership', 'Platform Advertising'],
      marketPosition: 'Strong #2 in food delivery (45% share). Pioneer of quick commerce in India — Instamart preceded Blinkit by nearly 2 years. Dineout acquisition made them a dining-out platform too.'
    },
    metrics: {
      revenueGrowth: [{ year: '2020', revenue: 230 }, { year: '2021', revenue: 350 }, { year: '2022', revenue: 600 }, { year: '2023', revenue: 850 }, { year: '2024', revenue: 1050 }],
      marketShare: [{ segment: 'Swiggy', share: 45 }, { segment: 'Zomato', share: 55 }]
    },
    deepDive: {
      unitEconomics: 'Swiggy One subscription (₹1,499/year) converts high-frequency users into committed customers, drastically reducing churn. Instamart requires heavy dark store capex (~₹50-80L per store) but commands 20-25% product margins on grocery. Contribution margin is positive in food delivery; Instamart is on the path.',
      customerSegments: ['Urban nuclear families (Instamart power users)', 'Convenience-seeking young professionals', 'Dineout users for special occasions', 'Restaurants & cloud kitchens needing order volume'],
      growthStrategy: 'Super-app strategy: consolidate food, grocery, dining, and parcel delivery into one app. Swiggy One subscription is the lock-in mechanism. The goal is to become the daily utility app for urban India — not just a food app.',
      distributionChannels: ['Swiggy One membership (recurring lock-in)', 'Bank & credit card partnerships (exclusive cashbacks)', 'Restaurant exclusivity deals', 'Push notifications & personalization engine']
    },
    swot: {
      strengths: ['Swiggy One drives exceptional user loyalty and reduces churn by 40%+', 'Instamart pioneered quick commerce — 2-year head start in category creation', 'Dineout gives access to the massive dining-out market', 'Proprietary routing and ETA prediction technology'],
      weaknesses: ['Capital intensive Instamart dark store expansion', 'Marginally losing food delivery share to Zomato', 'Multiple verticals (food, grocery, dining, genie) strain management focus'],
      opportunities: ['IPO proceeds to fund quick commerce war chest', 'Dineout expansion in Tier-2 cities', 'Swiggy One as a bundled lifestyle subscription'],
      threats: ['Zepto gaining quick commerce share with better product quality curation', 'Reliance JioMart Express entering quick commerce with offline-online muscle', 'ONDC enabling restaurants to bypass aggregators']
    },
    timeline: [
      { year: 2014, milestone: 'Sriharsha Majety, Nandan Reddy & Rahul Jaimini found Swiggy in Bangalore' },
      { year: 2015, milestone: 'Raised Series A from Accel; expanded to 4 cities' },
      { year: 2018, milestone: 'Became a Unicorn ($1B valuation). Crossed 1M orders/day.' },
      { year: 2019, milestone: 'Launched Swiggy Genie — package pickup & delivery' },
      { year: 2020, milestone: 'Launched Swiggy Instamart — pioneer of 10-45 min grocery delivery' },
      { year: 2022, milestone: 'Acquired Dineout (India\'s largest dining reservations platform) for ~$200M' },
      { year: 2024, milestone: 'Listed on Indian stock exchanges in landmark IPO' }
    ],
    founderInsights: {
      whyItWorked: [
        'Owned the delivery fleet from Day 1 — this was a contrarian bet when the industry was using third-party delivery. It gave Swiggy unprecedented reliability and control over the customer experience.',
        'Invented the quick-commerce category in India before any competitor. Instamart launched in 2020, 2 years before Blinkit was even acquired by Zomato.',
        'Swiggy One subscription created a recurring revenue base and dramatically reduced churn among high-LTV customers.',
        'Rahul Jaimini\'s engineering-first culture led to best-in-class routing algorithms that kept ETAs accurate — critical in a business where trust = speed.'
      ],
      mistakes: [
        'Supr Daily (milk & subscription grocery) was a separate brand that never achieved integration with the core Swiggy app — eventually wound down',
        'Scattered brand portfolio (Swiggy, Instamart, Genie, Dineout) creates user confusion about what Swiggy actually is',
        'Slower to publish unit economics compared to Zomato, leading to investor confidence gap during the IPO process'
      ],
      lessons: [
        'Logistics infrastructure IS the moat — it cannot be bought, only built over years',
        'Subscriptions (Swiggy One) are the highest-ROI retention tool available to a consumer internet company',
        'Category creation (inventing quick commerce) gives you a 2-year head start that is nearly impossible to overcome, even for better-funded competitors'
      ]
    },
    caseStudy: {
      problem: 'By 2019, food delivery growth was plateauing and user acquisition costs were rising unsustainably.',
      solution: 'Invented the quick-commerce category with Instamart and launched Swiggy One subscription for lock-in.',
      outcome: 'Built a $10B+ company with diversified revenue across food, grocery, and dining.',
      lessons: 'Your logistics infrastructure is your most durable competitive advantage. Build it, don\'t rent it.',
      fullCaseStudy: `In 2014, when Sriharsha Majety, Nandan Reddy, and Rahul Jaimini founded Swiggy in Bengaluru, the food delivery market was already crowded. Players like Foodpanda, TinyOwl, and Zomato (which was then a discovery platform transitioning to delivery) were locked in intense competition. However, all these platforms operated as pure software marketplaces: they connected customers to restaurants, but left the actual delivery to the restaurants themselves. This led to highly inconsistent delivery times, cold food, and frustrated customers.

Swiggy's founders made a massive, contrarian bet: they decided to build and own the delivery logistics network. They hired their own delivery executives, built routing software, and took complete ownership of the delivery process from the restaurant's kitchen to the customer's doorstep. This was capital-intensive and operationally grueling, but it gave Swiggy a massive competitive advantage. They guaranteed delivery under 30 minutes, introduced real-time GPS tracking of delivery executives, and allowed customers to order even a single cup of tea without minimum order value constraints. The customer experience was so superior that Swiggy quickly overtook its competitors, capturing over 50% market share in major metros within three years.

As the company scaled, raising billions from Naspers (Prosus) and SoftBank, they realized that food delivery alone would not justify a multi-billion-dollar valuation due to the inherently low margins of the restaurant sector. The founders envisioned Swiggy as a broader hyperlocal delivery utility. 

In 2019, they launched Swiggy Genie, an on-demand pickup-and-drop service for packages, allowing users to send documents, keys, or lunchboxes across cities. However, the ultimate breakthrough came in August 2020, during the height of the COVID-19 pandemic, when Swiggy launched Instamart.

Instamart was the pioneer of quick commerce in India. While competitors were still offering next-day or slot-based grocery deliveries, Swiggy bet that consumers would pay a premium to have fresh vegetables, milk, snacks, and toiletries delivered to their doorstep in under 30 minutes. Swiggy achieved this by building a network of "dark stores"—micro-warehouses hidden from public view, located in dense urban neighborhoods, and stocked with the 5,000 most-ordered SKUs. Instamart was a massive success, scaling to millions of orders within months and establishing quick commerce as a major consumer category in India, nearly two years before Zomato acquired Blinkit.

To bind these different services together, Swiggy launched "Swiggy One"—a unified membership program. For a monthly or annual fee, subscribers received free delivery on food orders, free delivery on Instamart purchases above a certain threshold, and discounts on Dineout (their table reservation service acquired in 2022) and Genie. Swiggy One was a massive retention engine. Subscribers ordered 2.5x more frequently than non-subscribers, and their customer lifetime value (LTV) was significantly higher.

However, Swiggy's super-app strategy had its drawbacks. Consolidating food delivery, quick commerce, dining reservations, and parcel delivery into a single app interface created cognitive overload for users. The app became complex and cluttered. Simultaneously, Zomato, operating a highly focused, clean interface and executing a successful IPO in 2021, began gaining market share in the food delivery sector. Swiggy also faced a late but hyper-aggressive threat in quick commerce from Zepto, which focused exclusively on a 10-minute promise, forcing Instamart to invest heavily in dark store automation and speed.

By 2024, Swiggy prepared for its own public listing. To improve its financial metrics for the IPO, the company began shutting down unprofitable experiments (like Supr Daily, its milk delivery subscription) and introducing platform fees on orders, similar to Zomato. Swiggy successfully listed on the Indian stock exchanges in late 2024, raising massive capital to expand its dark store footprint and build out its automated fulfillment centers.

The Swiggy case study offers three key takeaways for tech founders:
First, logistics is the ultimate moat in hyperlocal commerce. By owning the delivery fleet from day one, Swiggy established a standard of reliability that software-only marketplaces couldn\'t match.
Second, unified subscriptions are the most powerful customer retention tools. Swiggy One turned casual users into daily ecosystem loyalists who stopped comparing prices with competitors.
Third, first-mover advantage in category creation (like Instamart with quick commerce) gives a brand a massive head start, but maintaining that lead requires relentless focus on execution speed and preventing product clutter.`
    },
    techStack: ['Golang', 'Java', 'React', 'Swift', 'Kotlin', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    keyCompetitors: ['Zomato', 'Zepto', 'BigBasket', 'Dunzo'],
    fundingRounds: [
      { round: 'Series A', amount: '$2M', date: '2015-04' },
      { round: 'Series D', amount: '$75M', date: '2016-09' },
      { round: 'Series G', amount: '$210M', date: '2018-06' },
      { round: 'Series I', amount: '$1.2B', date: '2021-07' },
      { round: 'IPO', amount: '$1.3B', date: '2024-11' }
    ],
    notableInvestors: ['Prosus (Naspers)', 'SoftBank Vision Fund', 'Accel Partners', 'Elevation Capital', 'DST Global']
  }
];

module.exports = companiesPart1;
