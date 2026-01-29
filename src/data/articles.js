// src/data/articles.js
export const articles = [
  {
    slug: "first-time-homebuyer-guide",
    title: "First-Time Homebuyer Guide: Step-by-Step Checklist, Budget & Mortgage Basics",
    excerpt:
      "Step-by-step first-time homebuyer checklist: affordability, cash-to-close, credit/DTI, and rate shopping—plus quick links to FinWorld calculators.",
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
    relatedSlugs: ["building-credit-tips", "negotiating-auto-loan"],
  },
  {
    slug: "building-credit-tips",
    title: "How to Build Credit: A Simple Step-by-Step Guide That Actually Works",
    excerpt:
      "Learn how to build credit from scratch or improve a low score—payment history, utilization, credit mix, and smart habits that actually work.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
    readTime: "4 min read",
    category: "Credit",
    relatedSlugs: ["negotiating-auto-loan", "first-time-homebuyer-guide"],
    summary: [
      "What credit is and why it matters for borrowing and housing.",
      "The 5 factors that affect your score and how each is weighted.",
      "What helps vs what hurts: on-time payments, utilization, inquiries, and mix.",
      "How long credit improvement typically takes based on habits.",
      "Next steps with FinWorld tools to budget, pay debt, and prep for big purchases."
    ],
    sections: [
      {
        title: "What Credit Is (and Why It Matters)",
        paragraphs: [
          "Credit is your trust record with lenders—scores influence approvals, rates, deposits, and insurance pricing.",
          "Higher scores lower borrowing costs; lower scores limit options and increase fees."
        ]
      },
      {
        title: "The 5 Factors That Affect Your Credit Score",
        paragraphs: [
          "Payment history: pay every bill on time—this is the biggest factor.",
          "Utilization: keep balances low vs limits (aim under 30%, lower is better).",
          "Length of history: older accounts help; avoid closing your oldest card without cause.",
          "New credit: too many hard inquiries in a short time can ding you.",
          "Credit mix: having both installment and revolving accounts can help over time."
        ]
      },
      {
        title: "How to Build Credit From Scratch",
        paragraphs: [
          "Start with a secured card or a beginner-friendly card; pay in full every month.",
          "Use small recurring charges (e.g., subscriptions) and autopay them to avoid missed payments.",
          "If eligible, become an authorized user on a well-managed card to add positive history."
        ],
        ctas: [
          { label: "Check your budget with Take-Home Pay Calculator", to: "/tools/take-home-pay" }
        ]
      },
      {
        title: "How to Improve a Low Credit Score",
        paragraphs: [
          "Catch up on any past-due amounts first; stop new late payments immediately.",
          "Snowball or avalanche card balances to lower utilization—focus extra money on the highest APR or smallest balance.",
          "Dispute clear errors on your reports; remove only incorrect negatives."
        ],
        ctas: [
          { label: "Check your budget with Take-Home Pay Calculator", to: "/tools/take-home-pay" }
        ]
      },
      {
        title: "Credit Utilization Explained (with examples)",
        paragraphs: [
          "If your total limits are $5,000 and balances are $1,250, utilization is 25%.",
          "Keeping each card and overall under 30% is a common target; under 10% is stronger.",
          "Pay mid-cycle if needed so statement balances report lower to bureaus."
        ]
      },
      {
        title: "Common Credit Myths",
        paragraphs: [
          "Myth: You must carry a balance to build credit. Reality: paying in full still reports on-time history.",
          "Myth: Closing cards always helps. Reality: closing can raise utilization and shorten history.",
          "Myth: Multiple rate quotes wreck your score. Reality: grouped mortgage/auto inquiries within a short window often count as one."
        ]
      },
      {
        title: "How Long Credit Improvement Takes",
        paragraphs: [
          "On-time payments and lower utilization can show within a few statement cycles.",
          "Serious negatives (late pays, collections) take longer to fade but hurt less with time and new positive history.",
          "Consistent habits beat quick hacks—set reminders and autopay."
        ]
      },
      {
        title: "Mistakes That Hurt Your Credit",
        paragraphs: [
          "Late payments and returned payments.",
          "Maxing cards or letting utilization spike before statements cut.",
          "Opening many accounts at once without a plan.",
          "Ignoring errors on your reports."
        ]
      },
      {
        title: "Next Steps (Tools That Help You Stay on Track)",
        paragraphs: [
          "Map your monthly cash flow so bills are never late and balances stay low.",
          "If you’re prepping for a mortgage, test payments and down payment options early.",
          "Use small extra payments to knock down balances faster and keep utilization healthy."
        ],
        ctas: [
          { label: "Check cash flow with Take-Home Pay Calculator", to: "/tools/take-home-pay" },
          { label: "Model a mortgage payment", to: "/tools/mortgage-calculator" }
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
    title: "How to Negotiate an Auto Loan: Avoid Dealer Traps and Save Thousands",
    excerpt:
      "Learn how auto loan negotiation really works—rates, terms, dealer markups, and mistakes to avoid so you don’t overpay for your car.",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80",
    summary: [
      "Why the loan terms can matter more than the car price.",
      "Common dealer financing tricks and how to spot them.",
      "How credit and income shape your leverage with lenders.",
      "When to walk away instead of stretching the deal.",
      "Tools to sanity-check what you can really afford."
    ],
    sections: [
      {
        title: "Why Auto Loan Negotiation Matters More Than the Sticker Price",
        paragraphs: [
          "A low car price can still become expensive with a marked-up rate or a long term.",
          "Small changes in rate or term can add thousands over the life of the loan."
        ]
      },
      {
        title: "How Dealers Make Money on Financing (Simple Explanation)",
        paragraphs: [
          "Dealers can add reserve (markup) to the rate a lender approves—your rate isn’t always the lender’s rate.",
          "Add-ons rolled into financing increase profit and interest paid.",
          "Knowing this helps you negotiate rate and decline unnecessary products."
        ]
      },
      {
        title: "The Levers You Can Negotiate (Rate, Term, Add-ons)",
        paragraphs: [
          "Rate: compare with your own quotes and push dealers to match or beat.",
          "Term: shorter terms cost more monthly but far less in total interest.",
          "Add-ons: GAP, service contracts, and extras are optional—remove what you don’t need."
        ]
      },
      {
        title: "Credit Score vs Interest Rate (What Actually Changes)",
        paragraphs: [
          "Higher scores unlock lower rate tiers; mid-score borrowers should still shop multiple quotes.",
          "Pay history and utilization drive credit tiers—improving them before you shop can lower costs.",
          "Hard pulls for auto loans within a short window often count as one for scoring, so shop the same week."
        ]
      },
      {
        title: "Budget First: What Payment You Can Really Afford",
        paragraphs: [
          "Decide your payment ceiling before seeing cars; avoid letting the dealer set it for you.",
          "Map net income minus essentials so the payment fits without stressing savings goals."
        ],
        ctas: [
          { label: "Check your real take-home pay before you shop", to: "/tools/take-home-pay" }
        ]
      },
      {
        title: "Common Auto Loan Traps to Avoid",
        paragraphs: [
          "Stretching to a very long term to “fit” the payment—this inflates total interest and increases negative equity risk.",
          "Negotiating only the monthly payment; always compare out-the-door price and APR.",
          "Rolling add-ons and fees into the loan without checking if they’re needed or overpriced."
        ]
      },
      {
        title: "When to Get Pre-Approved (and When Not To)",
        paragraphs: [
          "Get pre-approved with a bank or credit union before you shop; it anchors the rate and gives leverage.",
          "If dealer financing can beat your pre-approval on the same terms (rate, fees, no junk add-ons), you can switch—but compare in writing."
        ]
      },
      {
        title: "How to Know When to Walk Away",
        paragraphs: [
          "If the dealer won’t show the buy rate or itemize add-ons, pause the deal.",
          "If the payment only “works” with an extra-long term or big add-ons, walk away.",
          "A deal you can’t explain clearly is a deal to skip."
        ]
      },
      {
        title: "Next Steps: Stay in Control of the Numbers",
        paragraphs: [
          "Lock your budget first, then shop cars that fit it and negotiate financing separately.",
          "Re-check affordability whenever price, rate, or term changes so you know the impact.",
          "Planning a home purchase later? Use the mortgage calculator to see how an auto payment affects future flexibility."
        ],
        ctas: [
          { label: "Verify your monthly budget with Take-Home Pay Calculator", to: "/tools/take-home-pay" },
          { label: "Long-term planning? Test a future mortgage payment", to: "/tools/mortgage-calculator" }
        ]
      }
    ],
    readTime: "5 min read",
    category: "Auto",
    relatedSlugs: ["building-credit-tips", "first-time-homebuyer-guide"],
  }
];

export const getArticleBySlug = (slug) =>
  articles.find((article) => article.slug === slug);
