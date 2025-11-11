// Tax data constants for 2024 and 2025

export const STATES_LIST = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY'
];

export const FICA_LIMITS = {
  2024: {
    ss_limit: 168600,
    ss_rate: 0.062,
    med_rate: 0.0145,
    add_med_threshold: { single: 200000, mfj: 250000, mfs: 125000, hoh: 200000 }
  },
  2025: {
    ss_limit: 174900,
    ss_rate: 0.062,
    med_rate: 0.0145,
    add_med_threshold: { single: 200000, mfj: 250000, mfs: 125000, hoh: 200000 }
  }
};

export const FED_STD = {
  2024: { single: 14600, mfj: 29200, mfs: 14600, hoh: 21900 },
  2025: { single: 15750, mfj: 31500, mfs: 15750, hoh: 23600 }
};

export const FED_BRACKETS = {
  2024: {
    single: [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]],
    mfj: [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]],
    mfs: [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [365600, 0.35], [Infinity, 0.37]],
    hoh: [[16550, 0.10], [63100, 0.12], [100500, 0.22], [191950, 0.24], [243700, 0.32], [609350, 0.35], [Infinity, 0.37]]
  },
  2025: {
    single: [[11925, 0.10], [48475, 0.12], [103350, 0.22], [197300, 0.24], [250525, 0.32], [626350, 0.35], [Infinity, 0.37]],
    mfj: [[23850, 0.10], [96950, 0.12], [206700, 0.22], [394600, 0.24], [501050, 0.32], [751600, 0.35], [Infinity, 0.37]],
    mfs: [[11925, 0.10], [48475, 0.12], [103350, 0.22], [197300, 0.24], [250525, 0.32], [313175, 0.35], [Infinity, 0.37]],
    hoh: [[17000, 0.10], [64850, 0.12], [103350, 0.22], [197300, 0.24], [250500, 0.32], [626350, 0.35], [Infinity, 0.37]]
  }
};

export const STATE_MODELS = {
  AL: { type: 'progressive', brackets: [[500, 0.02], [3000, 0.04], [Infinity, 0.05]] },
  AK: { type: 'flat', rate: 0 },
  AZ: { type: 'flat', rate: 0.025 },
  AR: { type: 'progressive', brackets: [[4400, 0.02], [8800, 0.04], [Infinity, 0.049]] },
  CA: { type: 'progressive', brackets: [[10412, 0.01], [24684, 0.02], [38959, 0.04], [54081, 0.06], [68350, 0.08], [349137, 0.093], [418961, 0.103], [698271, 0.113], [Infinity, 0.123]] },
  CO: { type: 'flat', rate: 0.044 },
  CT: { type: 'progressive', brackets: [[10000, 0.03], [50000, 0.05], [100000, 0.055], [200000, 0.06], [250000, 0.065], [Infinity, 0.0699]] },
  DE: { type: 'progressive', brackets: [[2000, 0.022], [5000, 0.039], [10000, 0.048], [20000, 0.052], [25000, 0.0555], [60000, 0.066], [Infinity, 0.066]] },
  DC: { type: 'progressive', brackets: [[10000, 0.04], [40000, 0.06], [60000, 0.065], [250000, 0.085], [500000, 0.0925], [1000000, 0.10], [Infinity, 0.1075]] },
  FL: { type: 'flat', rate: 0 },
  GA: { type: 'flat', rate: 0.0549 },
  HI: { type: 'progressive', brackets: [[2400, 0.014], [4800, 0.032], [9600, 0.055], [14400, 0.064], [19200, 0.068], [36000, 0.072], [48000, 0.076], [150000, 0.079], [175000, 0.0825], [200000, 0.09], [Infinity, 0.11]] },
  ID: { type: 'flat', rate: 0.058 },
  IL: { type: 'flat', rate: 0.0495 },
  IN: { type: 'flat', rate: 0.0315 },
  IA: { type: 'flat', rate: 0.044 },
  KS: { type: 'progressive', brackets: [[15000, 0.031], [30000, 0.0525], [Infinity, 0.057]] },
  KY: { type: 'flat', rate: 0.04 },
  LA: { type: 'progressive', brackets: [[12500, 0.0185], [50000, 0.035], [Infinity, 0.0425]] },
  ME: { type: 'progressive', brackets: [[26000, 0.058], [61550, 0.0675], [Infinity, 0.0715]] },
  MD: { type: 'progressive', brackets: [[1000, 0.02], [2000, 0.03], [3000, 0.04], [100000, 0.0475], [125000, 0.05], [150000, 0.0525], [250000, 0.055], [Infinity, 0.0575]] },
  MA: { type: 'flat', rate: 0.05 },
  MI: { type: 'flat', rate: 0.0425 },
  MN: { type: 'progressive', brackets: [[31190, 0.0535], [103060, 0.068], [171220, 0.0785], [Infinity, 0.0985]] },
  MS: { type: 'progressive', brackets: [[10000, 0.04], [Infinity, 0.05]] },
  MO: { type: 'progressive', brackets: [[1121, 0], [2242, 0.02], [4484, 0.025], [8968, 0.032], [13452, 0.037], [17936, 0.041], [22420, 0.045], [24762, 0.048], [Infinity, 0.049]] },
  MT: { type: 'flat', rate: 0.054 },
  NE: { type: 'progressive', brackets: [[3700, 0.0246], [22170, 0.0351], [35630, 0.0501], [Infinity, 0.0664]] },
  NV: { type: 'flat', rate: 0 },
  NH: { type: 'flat', rate: 0 },
  NJ: { type: 'progressive', brackets: [[20000, 0.014], [35000, 0.0175], [40000, 0.035], [75000, 0.05525], [500000, 0.0637], [1000000, 0.1075], [Infinity, 0.1075]] },
  NM: { type: 'progressive', brackets: [[5500, 0.017], [11000, 0.032], [16000, 0.047], [21000, 0.049], [Infinity, 0.059]] },
  NY: { type: 'progressive', brackets: [[8500, 0.04], [11700, 0.045], [13900, 0.0525], [80650, 0.0585], [215400, 0.0625], [1077550, 0.0685], [Infinity, 0.0882]] },
  NC: { type: 'flat', rate: 0.0425 },
  ND: { type: 'progressive', brackets: [[44725, 0.0195], [225975, 0.0241], [Infinity, 0.025]] },
  OH: { type: 'progressive', brackets: [[26950, 0.0275], [53800, 0.0322], [107600, 0.0367], [Infinity, 0.0399]] },
  OK: { type: 'progressive', brackets: [[1000, 0.0025], [2500, 0.0075], [3750, 0.0175], [4900, 0.0275], [7200, 0.0375], [Infinity, 0.0475]] },
  OR: { type: 'progressive', brackets: [[4050, 0.0475], [10200, 0.0675], [125000, 0.0875], [Infinity, 0.099]] },
  PA: { type: 'flat', rate: 0.0307 },
  RI: { type: 'progressive', brackets: [[7550, 0.0375], [85550, 0.0475], [Infinity, 0.0599]] },
  SC: { type: 'progressive', brackets: [[4040, 0], [20200, 0.03], [Infinity, 0.065]] },
  SD: { type: 'flat', rate: 0 },
  TN: { type: 'flat', rate: 0 },
  TX: { type: 'flat', rate: 0 },
  UT: { type: 'flat', rate: 0.0485 },
  VT: { type: 'progressive', brackets: [[42150, 0.0335], [102200, 0.066], [214900, 0.076], [Infinity, 0.0875]] },
  VA: { type: 'progressive', brackets: [[3000, 0.02], [5000, 0.03], [17000, 0.05], [Infinity, 0.0575]] },
  WA: { type: 'flat', rate: 0 },
  WV: { type: 'progressive', brackets: [[10000, 0.03], [25000, 0.04], [40000, 0.045], [60000, 0.065], [Infinity, 0.065]] },
  WI: { type: 'progressive', brackets: [[13230, 0.0354], [52620, 0.0465], [284570, 0.0530], [Infinity, 0.0765]] },
  WY: { type: 'flat', rate: 0 }
};
