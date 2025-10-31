// API utilities for mortgage rates
// Converted from Express.js backend to work directly with React

// State mapping
export const STATES = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

// Lender configuration
export const LENDERS = [
  {
    name: "LendingTree",
    initials: "LT",
    url: "https://www.lendingtree.com/mortgage/rates/",
    logo: "https://companieslogo.com/img/orig/TREE_BIG-3e8ef2c1.png"
  },
  {
    name: "Bankrate",
    initials: "BR",
    url: "https://www.bankrate.com/mortgages/mortgage-rates/",
    logo: "https://companieslogo.com/img/orig/BANKRATE-c2b46918.png"
  },
  {
    name: "Zillow",
    initials: "Z",
    url: "https://www.zillow.com/mortgage-rates/",
    logo: "https://s.zillowstatic.com/pfs/static/z-logo-default.svg"
  },
  {
    name: "SmartAsset",
    initials: "SA",
    url: "https://smartasset.com/mortgage/mortgage-rates",
    logo: "https://www.smartasset.com/resources/images/sa-logo.svg"
  },
  {
    name: "Better.com",
    initials: "B",
    url: "https://better.com/mortgage",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Better.com_logo.svg"
  }
];

// Fetch mortgage rates by state
export async function fetchRates(stateCode = 'NC') {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/mortgage-rate?state=${stateCode}`, {
      headers: { 
        'X-Api-Key': '5nYZ8dQglYCQIQMjkT/e1w==tdJqf8CZDaJlWlFY'
      }
    });
    const data = await response.json();
    
    // Return normalized rate data with fallback values
    return {
      f30: data.thirty_year_fixed || 7.05,
      f15: data.fifteen_year_fixed || 6.38,
      arm: data.arm5_1 || 6.52,
      apr30: data.apr30 || 6.85,
      apr15: data.apr15 || 6.17,
      aprArm: data.aprArm || 6.51
    };
  } catch (err) {
    console.error('Error fetching mortgage rates:', err);
    // Return fallback values
    return {
      f30: 7.10,
      f15: 6.40,
      arm: 6.55,
      apr30: 6.85,
      apr15: 6.17,
      aprArm: 6.54
    };
  }
}

// Track user clicks (placeholder - you might want to integrate with analytics)
export function trackClick(lenderName, stateCode) {
  console.log(`Click: ${lenderName} (${stateCode})`);
  // Here you could integrate with Google Analytics, Mixpanel, or your own tracking system
  // fetch(`http://localhost:8080/api/trackClick?lender=${encodeURIComponent(lenderName)}&state=${stateCode}`)
  //   .catch(() => {});
}
