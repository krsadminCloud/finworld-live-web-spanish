// State standard deduction / personal exemption reference data (2024/2025)
// Scope: Take‑Home Pay calculator only. This file captures high‑level rules
// for each state so we can optionally adjust state taxable income before
// applying STATE_MODELS in taxData.js.
//
// IMPORTANT:
// - This is a research scaffold. Amounts and formulas vary by year and filing
//   status and are subject to periodic inflation updates.
// - Populate amounts and sources incrementally. Prefer official Dept. of
//   Revenue or legislative references; include direct URLs in `sources`.
// - Where a state has no wage income tax, `hasIncomeTax` is false and
//   deductions/exemptions are 0 by definition for wages.
// - Some states start from Federal AGI or Federal Taxable Income; in those
//   cases `conformsToFederal` indicates whether a separate state standard
//   deduction is not applied beyond the federal one.
//
// Data schema per state:
// {
//   hasIncomeTax: boolean,
//   conformsToFederal?: boolean, // uses federal taxable income starting point
//   model: 'standard' | 'exemptions' | 'standard_and_exemptions' | 'none' | 'formula' | 'credit',
//   notes?: string,
//   sources?: string[],
//   data: {
//     2024: {
//       standard?: { single?: number|null, mfj?: number|null, mfs?: number|null, hoh?: number|null } | 'formula' | null,
//       exemptions?: { single?: number|null, mfj?: number|null, mfs?: number|null, hoh?: number|null } | 'formula' | null,
//     },
//     2025: { ...same shape... }
//   }
// }

export const STATE_DEDUCTIONS = {
  // No state wage income tax
  AK: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  FL: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  NV: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  SD: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  TN: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No tax on wages (Hall tax fully repealed).'},
  TX: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  WY: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No individual income tax.' },
  WA: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No tax on wage income (has capital gains excise).'},
  NH: { hasIncomeTax: false, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No tax on wage income (interest/dividends phase‑out).'},

  // Example entries with placeholders for detailed research.
  // Replace 'formula' with explicit numbers or phase‑out rules and add sources.

  AL: {
    hasIncomeTax: true,
    model: 'standard_and_exemptions',
    data: {
      2024: { standard: 'formula', exemptions: 'formula' },
      2025: { standard: 'formula', exemptions: 'formula' },
    },
    notes: 'Standard deduction and personal exemptions both apply; phased based on AGI.',
    sources: []
  },

  AZ: {
    hasIncomeTax: true,
    model: 'standard',
    data: {
      2024: { standard: 'formula' },
      2025: { standard: 'formula' },
    },
    notes: 'State standard deduction available with optional increase; indexing applies.',
    sources: []
  },

  CA: {
    hasIncomeTax: true,
    model: 'standard',
    data: {
      2024: { standard: 'formula' },
      2025: { standard: 'formula' },
    },
    notes: 'California provides a modest standard deduction separate from federal; amounts indexed.',
    sources: []
  },

  CO: {
    hasIncomeTax: true,
    conformsToFederal: true,
    model: 'none',
    data: { 2024: {}, 2025: {} },
    notes: 'Starts from federal taxable income; no separate state standard deduction beyond federal.',
    sources: []
  },

  GA: {
    hasIncomeTax: true,
    model: 'standard',
    data: {
      2024: { standard: 'formula' },
      2025: { standard: 'formula' },
    },
    notes: 'Georgia standard deduction (aka personal allowance) by filing status; amounts indexed in recent reforms.',
    sources: []
  },

  IL: {
    hasIncomeTax: true,
    conformsToFederal: true,
    model: 'exemptions',
    data: {
      2024: { exemptions: 'formula' },
      2025: { exemptions: 'formula' },
    },
    notes: 'Illinois allows personal exemptions; no separate standard deduction; starts from AGI.',
    sources: []
  },

  IN: {
    hasIncomeTax: true,
    model: 'exemptions',
    data: { 2024: { exemptions: 'formula' }, 2025: { exemptions: 'formula' } },
    notes: 'Personal exemptions; local income taxes also apply (not modeled here).',
    sources: []
  },

  MI: {
    hasIncomeTax: true,
    model: 'exemptions',
    data: { 2024: { exemptions: 'formula' }, 2025: { exemptions: 'formula' } },
    notes: 'Personal exemptions; additional senior/retirement adjustments exist.',
    sources: []
  },

  NC: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'Standard deduction by filing status; amounts indexed.',
    sources: []
  },

  NY: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'New York standard deduction by filing status; amounts may differ for NYC part‑year/nonresidents.',
    sources: []
  },

  OH: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'Standard deduction based on filing status and indexed.',
    sources: []
  },

  OR: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'Provides standard deduction; separate from federal and indexed.',
    sources: []
  },

  PA: {
    hasIncomeTax: true,
    model: 'none',
    data: { 2024: {}, 2025: {} },
    notes: 'No standard deduction; limited allowance via dependent credits for low income; flat tax with few deductions.',
    sources: []
  },

  SC: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'Standard deduction separate from federal; retirement subtraction also common.',
    sources: []
  },

  VA: {
    hasIncomeTax: true,
    model: 'standard',
    data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } },
    notes: 'Virginia standard deduction increased recently; amounts indexed.',
    sources: []
  },

  // Fallback entries for remaining states (to be populated with research)
  AR: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  CT: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  DC: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  DE: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  GA: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  HI: { hasIncomeTax: true, model: 'standard_and_exemptions', data: { 2024: { standard: 'formula', exemptions: 'formula' }, 2025: { standard: 'formula', exemptions: 'formula' } }, sources: [] },
  IA: { hasIncomeTax: true, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'Iowa conforms closely to federal starting point after recent reforms.', sources: [] },
  ID: { hasIncomeTax: true, model: 'exemptions', data: { 2024: { exemptions: 'formula' }, 2025: { exemptions: 'formula' } }, sources: [] },
  KS: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  KY: { hasIncomeTax: true, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'Flat tax; limited deductions; confirm current standard deduction policy.', sources: [] },
  LA: { hasIncomeTax: true, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'Primarily itemized adjustments; confirm standard deduction policy.', sources: [] },
  ME: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  MD: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, notes: 'Local (county) income tax applies separately.', sources: [] },
  MA: { hasIncomeTax: true, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'Massachusetts does not offer a standard deduction; personal exemptions apply.', sources: [] },
  MN: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  MO: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  MS: { hasIncomeTax: true, model: 'exemptions', data: { 2024: { exemptions: 'formula' }, 2025: { exemptions: 'formula' } }, sources: [] },
  MT: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  NE: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  NJ: { hasIncomeTax: true, model: 'none', data: { 2024: {}, 2025: {} }, notes: 'No standard deduction; personal exemptions/credits.', sources: [] },
  NM: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  ND: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  OH: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  OK: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  RI: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  UT: { hasIncomeTax: true, model: 'credit', data: { 2024: {}, 2025: {} }, notes: 'Utah uses a nonrefundable credit in place of standard deduction; income‑based phaseouts.', sources: [] },
  VT: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  VA: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  WV: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
  WI: { hasIncomeTax: true, model: 'standard', data: { 2024: { standard: 'formula' }, 2025: { standard: 'formula' } }, sources: [] },
};

// Helper: returns deduction/exemption info for a state and year
export function getStateDeductionInfo(state, year) {
  const entry = STATE_DEDUCTIONS[state];
  if (!entry) return null;
  const data = entry.data?.[year];
  return { ...entry, data };
}

