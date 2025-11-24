// src/data/articles.js
export const articles = [
  {
    slug: "building-credit-tips",
    title: "5 Tips for Building Credit",
    excerpt: "Improve your score and unlock better financial products.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    readTime: "4 min read",
    category: "Credit",
    summary: [
      "Start with a single card, keep utilization low, and pay on time to build a clean history.",
      "Let older accounts age and avoid opening several new lines at once to protect your score.",
      "Automate payments and monitor your credit reports for errors twice a year."
    ],
    sections: [
      {
        title: "Open carefully, pay on time",
        paragraphs: [
          "Building credit is a marathon, not a sprint. Start with a single card or a secured card, keep utilization low, and pay on time every month."
        ]
      },
      {
        title: "Protect your credit history",
        paragraphs: [
          "Keep your oldest accounts open to lengthen credit history, and avoid opening multiple new lines in a short window unless necessary."
        ]
      },
      {
        title: "Automate and monitor",
        paragraphs: [
          "Set up automatic payments to avoid late fees, and monitor your reports for errors at least twice a year."
        ]
      }
    ]
  },
  {
    slug: "investment-risks",
    title: "Understanding Investment Risks",
    excerpt: "A practical framework to assess and manage risks.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
    summary: [
      "Define risk by your goals and time horizon, not just price swings.",
      "Diversify across asset classes and geographies to avoid concentration risk.",
      "Rebalance on a schedule to keep risk in check and limit emotional decisions."
    ],
    sections: [
      {
        title: "Clarify what risk means for you",
        paragraphs: [
          "Risk is not just volatility—it’s the chance of not meeting your goals. Clarify your time horizon, liquidity needs, and loss tolerance."
        ]
      },
      {
        title: "Diversify broadly",
        paragraphs: [
          "Diversify across asset classes and geographies. Avoid concentration in a single stock, sector, or country."
        ]
      },
      {
        title: "Rebalance with intent",
        paragraphs: [
          "Rebalance on a schedule to keep risk in check and avoid emotional decision-making during market swings."
        ]
      }
    ],
    readTime: "5 min read",
    category: "Investing",
  },
  {
    slug: "first-time-homebuyer-guide",
    title: "First-Time Homebuyer Guide",
    excerpt: "Everything you need to know before you buy.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    summary: [
      "Hire a responsive local agent and vet them with questions about experience, availability, and strategy.",
      "Price homes using fresh comps, avoiding outliers and different school zones; shop at least three lenders on the same day.",
      "Budget the true monthly (PITI + PMI + HOA + utilities + maintenance) and 2–5% closing costs, negotiating fees where possible."
    ],
    sections: [
      {
        title: "Find a realtor you trust",
        paragraphs: [
          "A good realtor is your advisor and negotiator. Source candidates through referrals, local specialists, online profiles, and open houses.",
          "Vet them with clear questions: experience in your target areas, availability, strategy to win in competitive markets, and proof of past results. Look for someone busy enough to be sharp but not overloaded."
        ]
      },
      {
        title: "Pull solid comps before you bid",
        paragraphs: [
          "Use fresh sales data from MLS, county records, or portals (Zillow/Redfin/Realtor) to understand fair value. Aim for sales within the last 3–6 months, same school zone, similar square footage and style, and similar lot and condition.",
          "Avoid red flags: outlier designer flips, old sales, or comps from different districts. Listing prices alone aren’t value—closed prices are."
        ]
      },
      {
        title: "Pick and compare lenders",
        paragraphs: [
          "Talk to multiple lender types (local banks/credit unions, national lenders, brokers, online options). Ask about rate with your credit score, all lender fees, speed to close, first-time buyer programs, and rate matching.",
          "Get at least three quotes on the same day so you are comparing apples-to-apples using standardized Loan Estimates."
        ]
      },
      {
        title: "Know your full monthly number",
        paragraphs: [
          "Total monthly cost = mortgage principal & interest + property taxes + homeowners insurance + PMI (if <20% down) + HOA (if any) + utilities and maintenance. A 1% of home price annual maintenance reserve is a good rule of thumb.",
          "Aim to keep the full monthly within roughly 28–33% of gross income so the payment remains comfortable."
        ]
      },
      {
        title: "Plan and negotiate closing costs",
        paragraphs: [
          "Expect roughly 2–5% of the purchase price. Typical items include: lender fees for origination/underwriting/application ($1,000–$3,000), appraisal ($400–$800), inspection ($350–$700), attorney/review where required ($500–$1,500), title search and insurance ($1,000–$2,500), recording fees ($50–$250), transfer taxes (varies by state), prepaid taxes/insurance for escrow, and optional rate buydowns.",
          "Negotiate where you can: request seller concessions, compare lender quotes and fee sheets, decline unnecessary add-ons, ask about first-time buyer credits, and push for fee matches when you have competing offers."
        ]
      },
      {
        title: "Make the decision with confidence",
        paragraphs: [
          "With the right team, solid comps, and clear costs, you can move fast without surprises. Take your time, ask questions, and remember your first home should be both a smart investment and a place you love."
        ]
      }
    ],
    readTime: "6 min read",
    category: "Homebuying",
  },
  {
    slug: "negotiating-auto-loan",
    title: "Negotiating Your Auto Loan",
    excerpt: "Strategies to secure the best possible terms.",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80",
    summary: [
      "Arrive with pre-approvals from banks or credit unions to anchor the conversation.",
      "Negotiate the out-the-door price before talking about monthly payments.",
      "Scrutinize add-ons and check for prepayment penalties before you sign."
    ],
    sections: [
      {
        title: "Secure financing options first",
        paragraphs: [
          "Get rate quotes from banks and credit unions before visiting the dealership; arriving with financing changes the negotiation."
        ]
      },
      {
        title: "Negotiate on total cost",
        paragraphs: [
          "Negotiate the out-the-door price first, not the monthly payment. Longer terms can hide higher costs."
        ]
      },
      {
        title: "Read the fine print",
        paragraphs: [
          "Review add-ons carefully and skip anything that doesn’t provide clear value. Check for prepayment penalties before signing."
        ]
      }
    ],
    readTime: "4 min read",
    category: "Auto",
  }
];

export const getArticleBySlug = (slug) =>
  articles.find((article) => article.slug === slug);
