// src/data/articles.js
export const articles = [
  {
    slug: "first-time-homebuyer-guide",
    title: "First-Time Homebuyer Guide: Step-by-Step to Your First Keys",
    excerpt:
      "Learn the steps, numbers, and lender moves to buy your first home with confidence—plus quick links to the calculators that keep your budget on track.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    summary: [
      "Know what you can afford—not just what you’re approved for—using payment, affordability, and extra-payment calculators.",
      "Budget for down payment, closing costs, and a reserve so surprises don’t derail the deal.",
      "Shop multiple lenders on the same day, compare total costs, and lock only when the numbers fit your plan."
    ],
    sections: [
      {
        title: "Quick start checklist",
        paragraphs: [
          "List your monthly budget target and translate it to a payment cap.",
          "Estimate price range with the Home Affordability Calculator, then sanity-check the payment in the Mortgage Calculator.",
          "Save a down payment, closing costs (plan for ~2–5% of price), and a small reserve.",
          "Pull your credit scores; note any late payments to dispute or explain.",
          "Get at least three same-day lender quotes and compare full costs, not just the rate."
        ],
        ctas: [
          { label: "Home Affordability Calculator", to: "/tools/home-affordability" },
          { label: "Mortgage Calculator", to: "/tools/mortgage-calculator" }
        ]
      },
      {
        title: "What you can afford vs what you’re approved for",
        paragraphs: [
          "Lenders may approve you higher than your comfort zone. Build your own number using net take-home and recurring expenses.",
          "Pair the Home Affordability Calculator with the Mortgage Calculator to check both total price and the monthly PITI + PMI + HOA.",
          "Aim for a payment that still lets you save for emergencies after moving."
        ],
        ctas: [
          { label: "Run affordability", to: "/tools/home-affordability" },
          { label: "Model the monthly", to: "/tools/mortgage-calculator" }
        ]
      },
      {
        title: "Budget & cash to close",
        paragraphs: [
          "Cash to close usually equals down payment + closing costs + prepaids + a small reserve.",
          "Closing costs: plan for roughly 2–5% of price (lender fees, appraisal, title, taxes, insurance prepaids).",
          "Keep a reserve if you can—at least 1–2 months of the new payment for repairs and breathing room."
        ]
      },
      {
        title: "Credit score + DTI basics",
        paragraphs: [
          "Most lenders like to see debt-to-income (DTI) at or below the low 40%s; keeping your target payment modest helps.",
          "Higher scores lower pricing hits. Pay every bill on time, keep utilization low, and avoid new debt before closing."
        ]
      },
      {
        title: "Rate shopping (and locking) the smart way",
        paragraphs: [
          "Request at least three Loan Estimates on the same day to compare rate, points, lender fees, and credits consistently.",
          "Use the Mortgage Calculator to see how points or credits change the breakeven over your expected time in the home.",
          "Lock only when the full numbers fit your plan; shorter locks usually cost less than long ones."
        ],
        ctas: [{ label: "Compare scenarios", to: "/tools/mortgage-calculator" }]
      },
      {
        title: "Common mistakes",
        paragraphs: [
          "Chasing preapproval max instead of the payment you can live with.",
          "Skipping inspection details or underestimating repairs and maintenance.",
          "Not budgeting for closing costs or reserves, leading to last-minute stress.",
          "Locking a rate before comparing total lender costs side by side."
        ]
      },
      {
        title: "Use comps and the contract to avoid overpaying",
        paragraphs: [
          "Rely on closed sale comps within 3–6 months, similar size and school zone. Adjust for condition and lot, not just bed/bath counts.",
          "Keep appraisal risk in mind—offer with an appraisal contingency when you can, or be ready with cash if you waive it."
        ]
      },
      {
        title: "What to do before you bid",
        paragraphs: [
          "Re-run affordability with current rates and your latest savings number.",
          "Plug the target price into the Mortgage Calculator and confirm the monthly fits your budget even with taxes/insurance.",
          "Plan an extra-payment strategy so you know how fast you can build equity once you move in."
        ],
        ctas: [
          { label: "Affordability check", to: "/tools/home-affordability" },
          { label: "Monthly payment check", to: "/tools/mortgage-calculator" },
          { label: "Extra Payment Calculator", to: "/tools/extra-payment" }
        ]
      },
      {
        title: "Next steps",
        paragraphs: [
          "Narrow your price and payment guardrails, then set alerts in your target neighborhoods.",
          "Get refreshed quotes the week you plan to offer and compare all-in costs with the Mortgage Calculator.",
          "After closing, use the Extra Payment Calculator to see how small extras speed up equity."
        ],
        ctas: [
          { label: "Start with affordability", to: "/tools/home-affordability" },
          { label: "Compare mortgage options", to: "/tools/mortgage-calculator" },
          { label: "Plan extra payments", to: "/tools/extra-payment" }
        ]
      }
    ],
    readTime: "6 min read",
    category: "Homebuying",
  },
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
