const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  industry: String,
  tagline: String,
  logoUrl: String,
  stats: {
    funding: String,
    revenue: String,
    users: String,
    founded: Number
  },
  overview: {
    businessModel: String,
    revenueStreams: [String],
    marketPosition: String
  },
  metrics: {
    revenueGrowth: [{ year: String, revenue: Number }], // in millions
    marketShare: [{ segment: String, share: Number }] // percentage
  },
  deepDive: {
    unitEconomics: String,
    customerSegments: [String],
    growthStrategy: String,
    distributionChannels: [String]
  },
  swot: {
    strengths: [String],
    weaknesses: [String],
    opportunities: [String],
    threats: [String]
  },
  timeline: [
    {
      year: Number,
      milestone: String
    }
  ],
  founderInsights: {
    whyItWorked: [String],
    mistakes: [String],
    lessons: [String]
  },
  caseStudy: {
    problem: String,
    solution: String,
    outcome: String,
    lessons: String,
    fullCaseStudy: String
  },
  techStack: [String],
  keyCompetitors: [String],
  fundingRounds: [
    {
      round: String,
      amount: String,
      date: String
    }
  ],
  notableInvestors: [String]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
