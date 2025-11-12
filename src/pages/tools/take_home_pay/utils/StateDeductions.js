// State standard deduction / personal exemption reference data (2024/2025)
// Generated from the provided State Standard Deductions (2024-2025) - Amounts and Phase-Outs document.
// Each entry captures the per-year deduction/exemption policy for the Take-Home Pay calculator.

export const STATE_DEDUCTIONS = {
  "AL": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Standard deduction varies by AGI. Phases down as income rises (minimum $2,500 single / $5,000 MFJ for high incomes)[1].",
        "sources": [
          "2024 Alabama DOR Chart[1]."
        ],
        "standard": {
          "single": 3000,
          "mfj": 8500,
          "note": "Up to $3,000 (max) / Up to $8,500 (max)"
        }
      },
      "2025": {
        "phaseOut": "Yes - Income-based phase-out (same structure; inflation-indexed thresholds)[2][3].",
        "sources": [
          "Tax Foundation 2025 summary (phase-out structure)[2][3]."
        ],
        "standard": {
          "single": 3000,
          "mfj": 8500,
          "note": "Up to $3,000 (indexed, ~same) / Up to $8,500 (indexed, ~same)"
        }
      }
    }
  },
  "AK": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[4] (no state income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - Alaska has no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "AZ": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; standard deduction equals federal amount (no phase-out)[5].",
        "sources": [
          "Tax Foundation 2024[5]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Standard deduction follows federal; no phase-out[5].",
        "sources": [
          "Tax Foundation 2025 (indexed to federal)[5]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 (matches federal 2025) / $30,000"
        }
      }
    }
  },
  "AR": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction (no phase-out)[6].",
        "sources": [
          "Tax Foundation 2024[6]."
        ],
        "standard": {
          "single": 2340,
          "mfj": 4680,
          "note": "$2,340 / $4,680"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged (no phase-out)",
        "sources": [
          "Arkansas DOR 2025 (no change; not cited in sources)"
        ],
        "standard": {
          "single": 2340,
          "mfj": 4680,
          "note": "$2,340 / $4,680"
        }
      }
    }
  },
  "CA": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Indexed annually; no phase-out for standard deduction[7].",
        "sources": [
          "California FTB 2024[7]."
        ],
        "standard": {
          "single": 5363,
          "mfj": 10726,
          "note": "$5,363 / $10,726"
        }
      },
      "2025": {
        "phaseOut": "No - Inflation adjustments only (no phase-out)",
        "sources": [
          "California FTB 2025 (indexed; no phase-out)[7]."
        ],
        "standard": {
          "single": 5519,
          "mfj": 11038,
          "note": "$5,519 (indexed) / $11,038 (indexed)"
        }
      }
    }
  },
  "CO": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; Colorado uses federal taxable income (federal standard deduction)[8]. No separate phase-out.",
        "sources": [
          "Tax Foundation 2024[8]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal standard deduction; no phase-out",
        "sources": [
          "Tax Foundation 2025 (federal conformity)[8]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "CT": {
    "hasIncomeTax": true,
    "model": "exemptions",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Personal exemption phases out as income rises (e.g. phases out for AGI > \\$30k single / \\$48k MFJ)[9][10].",
        "sources": [
          "Tax Foundation 2024[9]; CT DOR (phase-out)[10]."
        ],
        "exemptions": {
          "single": 15000,
          "mfj": 24000,
          "note": "N/A - (No std. ded.; Personal Exemption \\$15,000) / N/A - (No std. ded.; Personal Exemption \\$24,000)"
        }
      },
      "2025": {
        "phaseOut": "Yes - Personal exemption still \\$15k/ \\$24k; phases out with income (no std. ded.)[9][10].",
        "sources": [
          "Tax Foundation 2025 (CT phase-out provisions)[10]."
        ],
        "exemptions": {
          "single": null,
          "mfj": null,
          "note": "N/A (no standard deduction) / N/A"
        }
      }
    }
  },
  "DE": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction (no phase-out)[11].",
        "sources": [
          "Delaware DOR 2024[11]."
        ],
        "standard": {
          "single": 3250,
          "mfj": 6500,
          "note": "$3,250 / $6,500"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged; no phase-out",
        "sources": [
          "Delaware DOR 2025 (no change; not cited)"
        ],
        "standard": {
          "single": 3250,
          "mfj": 6500,
          "note": "$3,250 / $6,500"
        }
      }
    }
  },
  "FL": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[12] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "GA": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Standard deduction doubled in recent reform; no phase-out[13].",
        "sources": [
          "Georgia DOR 2024[13]."
        ],
        "standard": {
          "single": 12000,
          "mfj": 24000,
          "note": "$12,000 / $24,000"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged (flat tax system; no phase-out)",
        "sources": [
          "Georgia DOR 2025 (no change; see 2024 source)[13]."
        ],
        "standard": {
          "single": 12000,
          "mfj": 24000,
          "note": "$12,000 / $24,000"
        }
      }
    }
  },
  "HI": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction; no phase-out[14].",
        "sources": [
          "Hawaii DOR 2024[14]."
        ],
        "standard": {
          "single": 2200,
          "mfj": 4400,
          "note": "$2,200 / $4,400"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged (no phase-out)",
        "sources": [
          "Hawaii DOR 2025 (no change; see 2024 source)[14]."
        ],
        "standard": {
          "single": 2200,
          "mfj": 4400,
          "note": "$2,200 / $4,400"
        }
      }
    }
  },
  "ID": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; follows federal standard deduction (no phase-out)[15].",
        "sources": [
          "Tax Foundation 2024[15]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal standard deduction; no phase-out",
        "sources": [
          "Tax Foundation 2025 (federal conformity)[15]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "IL": {
    "hasIncomeTax": true,
    "model": "exemptions",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Personal exemption is disallowed for high incomes (no exemption if AGI > \\$250k single / \\$500k joint)[15][16].",
        "sources": [
          "Tax Foundation 2024[15]; IL DOR (phase-out)[16]."
        ],
        "exemptions": {
          "single": 2775,
          "mfj": 5550,
          "note": "N/A - (No std. ded.; Personal Exemption \\$2,775) / N/A - (No std. ded.; Personal Exemption \\$5,550)"
        }
      },
      "2025": {
        "phaseOut": "Yes - Personal exemption \\$(~2,850/5,700) with same high-income phase-out (AGI >\\$250k/\\$500k)[16].",
        "sources": [
          "IL DOR Notice 2025 (exemption \\$2,850; phase-out)[16]."
        ],
        "exemptions": {
          "single": 2850,
          "mfj": 5700,
          "note": "N/A (no std. ded.; pers. ex. \\$2,850)* / N/A (no std. ded.; pers. ex. \\$5,700)*"
        }
      }
    }
  },
  "IN": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; uses personal exemption (no standard ded.; no phase-out)[17].",
        "sources": [
          "Tax Foundation 2024[17]."
        ]
      },
      "2025": {
        "phaseOut": "No - No standard deduction; personal exemption unchanged (no phase-out)",
        "sources": [
          "Indiana DOR 2025 (no std. ded.; no phase-out)"
        ]
      }
    }
  },
  "IA": {
    "hasIncomeTax": true,
    "model": "credit",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Iowa eliminated standard deduction; small personal credit instead (no phase-out)[18].",
        "sources": [
          "Tax Foundation 2024[18]."
        ],
        "credit": {
          "single": "N/A - No standard deduction (flat tax)",
          "mfj": "N/A - No standard deduction"
        }
      },
      "2025": {
        "phaseOut": "No - No standard deduction (tax reform continued; no phase-out)",
        "sources": [
          "Tax Foundation 2025 (Iowa flat tax; no std. ded.)[18]."
        ]
      }
    }
  },
  "KS": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction (recently increased; no phase-out)[19].",
        "sources": [
          "Tax Foundation 2024[19]."
        ],
        "standard": {
          "single": 3500,
          "mfj": 8000,
          "note": "$3,500 / $8,000"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged; no phase-out",
        "sources": [
          "Kansas DOR 2025 (no change; not cited)"
        ],
        "standard": {
          "single": 3500,
          "mfj": 8000,
          "note": "$3,500 / $8,000"
        }
      }
    }
  },
  "KY": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; standard deduction indexed to inflation (no phase-out)[20].",
        "sources": [
          "Kentucky DOR 2024[20]."
        ],
        "standard": {
          "single": 3160,
          "mfj": 6320,
          "note": "$3,160 / $6,320"
        }
      },
      "2025": {
        "phaseOut": "No - Inflation-adjusted (no phase-out)",
        "sources": [
          "Kentucky DOR 2025 (indexed; no phase-out)"
        ],
        "standard": {
          "single": 3260,
          "mfj": 6520,
          "note": "$3,260 (approx.) / $6,520 (approx.)"
        }
      }
    }
  },
  "LA": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Standard deduction not used; personal exemptions (no phase-out)[21].",
        "sources": [
          "Tax Foundation 2024[21]."
        ]
      },
      "2025": {
        "phaseOut": "No - No standard deduction; personal exemption unchanged (no phase-out)",
        "sources": [
          "Louisiana DOR 2025 (no std. ded.; no phase-out)"
        ]
      }
    }
  },
  "ME": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Follows federal amount; phased out for high incomes (standard deduction is reduced for Maine AGI > ~$93k single / ~$186k joint)[22][23].",
        "sources": [
          "Tax Foundation 2024[22]; Maine Rev. (phase-out)[23]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "Yes - Phases out for Maine AGI > $100,000 (single) / $200,050 (joint); completely eliminated by ~$175k/$275k AGI[23].",
        "sources": [
          "Maine Rev. 2025 (phase-out thresholds)[23]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "MD": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Standard ded. = 15% of Maryland AGI (floor and cap apply)[24]. No phase-out at high income (deduction simply capped).",
        "sources": [
          "Maryland DOR 2024[24]."
        ],
        "standard": {
          "single": 2550,
          "mfj": 5150,
          "note": "$2,550 (15% of income; min $1,600, max $2,550) / $5,150 (15% of income; min $3,200, max $5,150)"
        }
      },
      "2025": {
        "phaseOut": "No - Same 15% formula (2025 caps indexed higher; no phase-out)[25].",
        "sources": [
          "Tax Foundation 2025 (MD formula & 2025 caps)[25]."
        ],
        "standard": {
          "single": 2700,
          "mfj": 5450,
          "note": "$2,700 (15% of income; min ~$1,800, max $2,700) / $5,450 (15% of income; min ~$3,650, max $5,450)"
        }
      }
    }
  },
  "MA": {
    "hasIncomeTax": true,
    "model": "exemptions",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - No standard deduction; personal exemptions phase out for high incomes (fully phased out at ~$130k single / ~$176k joint)[26][27].",
        "sources": [
          "Tax Foundation 2024[26]; Mass. DOR (phase-out)[27]."
        ]
      },
      "2025": {
        "phaseOut": "Yes - Personal exemptions remain \\$4,400/\\$8,800; phase-out for high earners continues[26][27].",
        "sources": [
          "Tax Foundation 2025 (no std. ded.; phase-out)[27]."
        ],
        "exemptions": {
          "single": null,
          "mfj": null,
          "note": "N/A (no standard deduction) / N/A"
        }
      }
    }
  },
  "MI": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; no standard deduction (personal exemption only; no phase-out)[28].",
        "sources": [
          "Tax Foundation 2024[28]."
        ]
      },
      "2025": {
        "phaseOut": "No - No standard deduction; personal exemption ~$5,800 (inflation) with no phase-out",
        "sources": [
          "Michigan Treasury 2025 (no std. ded.; no phase-out)"
        ]
      }
    }
  },
  "MN": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Follows federal standard deduction (slightly different due to state indexing; no phase-out)[29].",
        "sources": [
          "Tax Foundation 2024[29]."
        ],
        "standard": {
          "single": 14575,
          "mfj": 29150,
          "note": "$14,575 / $29,150"
        }
      },
      "2025": {
        "phaseOut": "No - Standard deduction indexed (about \\$15k/\\$30k in 2025); no phase-out",
        "sources": [
          "Minnesota DOR 2025 (indexed; no phase-out)"
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 (approx.) / $30,000 (approx.)"
        }
      }
    }
  },
  "MS": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction; no phase-out[30].",
        "sources": [
          "Mississippi DOR 2024[30]."
        ],
        "standard": {
          "single": 2300,
          "mfj": 4600,
          "note": "$2,300 / $4,600"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged; no phase-out",
        "sources": [
          "Miss. DOR 2025 (no change; see 2024 source)[30]."
        ],
        "standard": {
          "single": 2300,
          "mfj": 4600,
          "note": "$2,300 / $4,600"
        }
      }
    }
  },
  "MO": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Follows federal standard deduction (no phase-out)[31].",
        "sources": [
          "Tax Foundation 2024[31]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Tracks federal; no phase-out",
        "sources": [
          "Tax Foundation 2025 (federal conformity)[31]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "MT": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Conforms to federal standard deduction (no phase-out)[32].",
        "sources": [
          "Tax Foundation 2024[32]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal; no phase-out",
        "sources": [
          "Montana DOR 2025 (federal conformity; no phase-out)"
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "NE": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed state-specific standard deduction; no phase-out[33].",
        "sources": [
          "Tax Foundation 2024[33]."
        ],
        "standard": {
          "single": 7900,
          "mfj": 15800,
          "note": "$7,900 / $15,800"
        }
      },
      "2025": {
        "phaseOut": "No - Slight inflation adjustment; no phase-out",
        "sources": [
          "Nebraska DOR 2025 (indexed; no phase-out)"
        ],
        "standard": {
          "single": 8000,
          "mfj": 16000,
          "note": "$8,000 (approx.) / $16,000 (approx.)"
        }
      }
    }
  },
  "NV": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[34] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "NH": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "- (NH taxes only interest/dividends; a personal exemption of $2,400 single / $4,800 joint applies to that tax)[35].",
        "sources": [
          "Tax Foundation 2024[35]."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "- (No broad income tax; standard deduction not applicable)",
        "sources": [
          "(No change - no wage income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "NJ": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - New Jersey has no standard deduction; small personal exemptions (no phase-out for most taxpayers)[36].",
        "sources": [
          "Tax Foundation 2024[36]."
        ]
      },
      "2025": {
        "phaseOut": "No - Personal exemptions remain \\$1k/\\$2k (no standard deduction; exemptions not available to very high incomes)**",
        "sources": [
          "NJ Div. of Tax 2025 (no std. ded.; high-income limitation)*"
        ]
      }
    }
  },
  "NM": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Follows federal standard deduction; no phase-out[37].",
        "sources": [
          "Tax Foundation 2024[37]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Indexed to federal; no phase-out",
        "sources": [
          "Tax Foundation 2025 (federal conformity)[37]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "NY": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction (no phase-out)[38].",
        "sources": [
          "NY Dept. of Tax 2024[38]."
        ],
        "standard": {
          "single": 8000,
          "mfj": 16050,
          "note": "$8,000 / $16,050"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged (no phase-out; itemized deductions limited at high income, but standard ded. remains available)",
        "sources": [
          "NY Dept. of Tax 2025 (no change; see 2024 source)[38]."
        ],
        "standard": {
          "single": 8000,
          "mfj": 16050,
          "note": "$8,000 / $16,050"
        }
      }
    }
  },
  "NC": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Flat tax; standard deduction (slightly lower than federal) with no phase-out[39].",
        "sources": [
          "NC DOR 2024[39]."
        ],
        "standard": {
          "single": 12750,
          "mfj": 25500,
          "note": "$12,750 / $25,500"
        }
      },
      "2025": {
        "phaseOut": "No - Standard deduction was legislatively increased for 2025 (no phase-out)[40].",
        "sources": [
          "Tax Foundation 2025 (NC tax reform)[41]."
        ],
        "standard": {
          "single": 13250,
          "mfj": 26500,
          "note": "$13,250 (scheduled increase) / $26,500 (scheduled increase)"
        }
      }
    }
  },
  "ND": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Conforms to federal standard deduction; no phase-out[42].",
        "sources": [
          "Tax Foundation 2024[42]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal; no phase-out (note: ND enacted tax credits that eliminate tax for low incomes)",
        "sources": [
          "Tax Foundation 2025 (flat tax; no std. ded. change)[42]."
        ],
        "credit": {
          "single": "$15,000",
          "mfj": "$30,000"
        }
      }
    }
  },
  "OH": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - No state standard deduction; personal exemption (phases out only for very high incomes)[43].",
        "sources": [
          "Tax Foundation 2024[43]."
        ]
      },
      "2025": {
        "phaseOut": "No - Personal exemptions remain (\\$2,400/\\$4,800); no standard deduction",
        "sources": [
          "Ohio Tax Dept. 2025 (no std. ded.; no major change)"
        ]
      }
    }
  },
  "OK": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Fixed standard deduction (matches pre-TCJA federal); no phase-out[44].",
        "sources": [
          "Oklahoma Tax Comm. 2024[44]."
        ],
        "standard": {
          "single": 6350,
          "mfj": 12700,
          "note": "$6,350 / $12,700"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged; no phase-out",
        "sources": [
          "Oklahoma Tax Comm. 2025 (no change; see 2024 source)[44]."
        ],
        "standard": {
          "single": 6350,
          "mfj": 12700,
          "note": "$6,350 / $12,700"
        }
      }
    }
  },
  "OR": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Standard deduction is relatively low; phased out for high-income filers (no deduction allowed for income > ~$254k single / $283k joint)[45][46].",
        "sources": [
          "Tax Foundation 2024[45]; OR DOR (phase-out)[46]."
        ],
        "standard": {
          "single": 2745,
          "mfj": 5495,
          "note": "$2,745 / $5,495"
        }
      },
      "2025": {
        "phaseOut": "Yes - Standard deduction phases out completely at high incomes (approx. AGI $254k-$283k range)[46].",
        "sources": [
          "Tax Foundation 2025 (phase-out range)[46]."
        ],
        "standard": {
          "single": 2845,
          "mfj": 5690,
          "note": "$2,845 (indexed) / $5,690 (indexed)"
        }
      }
    }
  },
  "PA": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - PA has a flat tax with no standard deduction or personal exemptions[47].",
        "sources": [
          "Tax Foundation 2024[47]."
        ]
      },
      "2025": {
        "phaseOut": "No - No standard deduction (flat 3.07% tax; no phase-out)",
        "sources": [
          "(Unchanged - PA has no std. deduction)"
        ]
      }
    }
  },
  "RI": {
    "hasIncomeTax": true,
    "model": "credit",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Standard deduction available (structured as a tax credit equal to 6% of the deduction)[48][46]; no phase-out for standard deduction (personal exemptions phase out at high incomes).",
        "sources": [
          "Tax Foundation 2024[48]; R.I. Div. of Taxation."
        ]
      },
      "2025": {
        "phaseOut": "No - Small inflation adjustment; no phase-out (standard ded. still via nonrefundable credit)",
        "sources": [
          "Tax Foundation 2025 (RI credit structure)[46]."
        ],
        "credit": {
          "single": "$10,950 (indexed)",
          "mfj": "$21,900 (indexed)"
        }
      }
    }
  },
  "SC": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Conforms to federal standard deduction (no phase-out)[49].",
        "sources": [
          "Tax Foundation 2024[49]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal; no phase-out",
        "sources": [
          "Tax Foundation 2025 (no phase-out)[49]."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  },
  "SD": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[50] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "TN": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "- (TN phased out its tax on interest/dividends by 2021; no income tax)",
        "sources": [
          "[50] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "TX": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[50] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "UT": {
    "hasIncomeTax": true,
    "model": "credit",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Flat tax with a nonrefundable credit (equals 4.65% of a roughly \\$18,800 \"deduction\" per filer). Credit phases out for AGI above ~$17,652 (single) / $35,304 (joint)[51][52].",
        "sources": [
          "Tax Foundation 2024[51]; UT State Tax Comm. (phase-out)[52]."
        ],
        "credit": {
          "single": "N/A - (No std. ded.; Tax credit instead)",
          "mfj": "N/A - (No std. ded.; Tax credit instead)"
        }
      },
      "2025": {
        "phaseOut": "Yes - Credit (4.65% of std. ded. equiv.) phases out at ~\\$18k single / \\$36k joint AGI (eliminated by ~\\$85k/170k AGI)[52].",
        "sources": [
          "Tax Foundation 2025 (Utah credit phase-out)[52]."
        ],
        "credit": {
          "single": "N/A (credit approx \\$900 single)",
          "mfj": "N/A (credit approx \\$1,800 joint)"
        }
      }
    }
  },
  "VT": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Vermont standard deduction is lower than federal and phases out at high incomes (no deduction available above ~$263k AGI for single filers)[53][46].",
        "sources": [
          "Tax Foundation 2024[53]; VT Dept. of Taxes[46]."
        ],
        "standard": {
          "single": 7000,
          "mfj": 14050,
          "note": "$7,000 / $14,050"
        }
      },
      "2025": {
        "phaseOut": "Yes - Phases out for high incomes (phase-out range ~$254,250-$283,250 for all filers)[46].",
        "sources": [
          "Tax Foundation 2025 (phase-out range)[46]."
        ],
        "standard": {
          "single": 7350,
          "mfj": 14700,
          "note": "$7,350 (indexed) / $14,700 (indexed)"
        }
      }
    }
  },
  "VA": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - Standard deduction recently increased (2022 law); no phase-out[54].",
        "sources": [
          "Virginia DOR 2024[54]."
        ],
        "standard": {
          "single": 8000,
          "mfj": 16000,
          "note": "$8,000 / $16,000"
        }
      },
      "2025": {
        "phaseOut": "No - Unchanged (no phase-out)",
        "sources": [
          "Virginia DOR 2025 (no change; see 2024 source)[54]."
        ],
        "standard": {
          "single": 8000,
          "mfj": 16000,
          "note": "$8,000 / $16,000"
        }
      }
    }
  },
  "WA": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "- (WA taxes capital gains, with a \\$250,000 per-person exemption; no wage income tax)[55].",
        "sources": [
          "Wash. Dept. of Rev.[55]."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "- (No income tax on wages; \\$250k capital gains deduction remains)",
        "sources": [
          "(No change - no income tax on ordinary income)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "WV": {
    "hasIncomeTax": true,
    "model": "none",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - No standard deduction; personal exemptions (no phase-out)[56].",
        "sources": [
          "Tax Foundation 2024[56]."
        ]
      },
      "2025": {
        "phaseOut": "No - No standard deduction; personal exemptions unchanged",
        "sources": [
          "WV State Tax Dept. 2025 (no std. ded.)"
        ]
      }
    }
  },
  "WI": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "Yes - Standard deduction is phased out as income increases (completely $0 at about $132,550 AGI for single; $155,150 for joint)[57][58].",
        "sources": [
          "Tax Foundation 2024[57]; WI DOR (phase-out)[58]."
        ],
        "standard": {
          "single": 13230,
          "mfj": 24490,
          "note": "$13,230 / $24,490"
        }
      },
      "2025": {
        "phaseOut": "Yes - Phases out to $0 at approximately $137,000 AGI (single) and $160,000 (joint)[58].",
        "sources": [
          "Tax Foundation 2025 (phase-out thresholds)[58]."
        ],
        "standard": {
          "single": 13810,
          "mfj": 25690,
          "note": "$13,810 (indexed) / $25,690 (indexed)"
        }
      }
    }
  },
  "WY": {
    "hasIncomeTax": false,
    "model": "none",
    "notes": "No state income tax.",
    "data": {
      "2024": {
        "phaseOut": "-",
        "sources": [
          "[59] (no income tax)."
        ],
        "notes": "No state income tax for wage income."
      },
      "2025": {
        "phaseOut": "-",
        "sources": [
          "(No change - no income tax)"
        ],
        "notes": "No state income tax for wage income."
      }
    }
  },
  "DC": {
    "hasIncomeTax": true,
    "model": "standard",
    "notes": "",
    "data": {
      "2024": {
        "phaseOut": "No - D.C. conforms to federal standard deduction (no phase-out for standard ded.)[60].",
        "sources": [
          "DC Office of Tax 2024[60]."
        ],
        "standard": {
          "single": 14600,
          "mfj": 29200,
          "note": "$14,600 / $29,200"
        }
      },
      "2025": {
        "phaseOut": "No - Follows federal increase; no phase-out",
        "sources": [
          "DC Office of Tax 2025 (federal conformity; no phase-out)."
        ],
        "standard": {
          "single": 15000,
          "mfj": 30000,
          "note": "$15,000 / $30,000"
        }
      }
    }
  }
};

export function getStateDeductionInfo(state, year) {
  const entry = STATE_DEDUCTIONS[state];
  if (!entry) return null;
  const dataPoint = entry.data?.[year];
  return { ...entry, data: dataPoint || null };
}
