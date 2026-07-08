const RENOVATION_RATE_TABLE = {
  Apartment: {
    "Light Upgrade": { Essential: 40, Premium: 60, Signature: 80 },
    "Standard Renovation": { Essential: 60, Premium: 80, Signature: 100 },
    "Full Turnkey Fitout": { Essential: 80, Premium: 100, Signature: 120 }
  },
  Townhouse: {
    "Light Upgrade": { Essential: 60, Premium: 80, Signature: 100 },
    "Standard Renovation": { Essential: 80, Premium: 100, Signature: 120 },
    "Full Turnkey Fitout": { Essential: 100, Premium: 120, Signature: 140 }
  },
  Villa: {
    "Light Upgrade": { Essential: 60, Premium: 80, Signature: 100 },
    "Standard Renovation": { Essential: 80, Premium: 100, Signature: 120 },
    "Full Turnkey Fitout": { Essential: 100, Premium: 120, Signature: 140 }
  },
  Commercial: {
    "Light Upgrade": { Essential: 50, Premium: 70, Signature: 90 },
    "Standard Renovation": { Essential: 70, Premium: 90, Signature: 110 },
    "Full Turnkey Fitout": { Essential: 90, Premium: 110, Signature: 130 }
  }
};

const COMMERCIAL_CATEGORY_MULTIPLIERS = {
  Office: 1,
  "Retail Shop": 1.1,
  "Restaurant / Café": 1.4,
  "Salon / Spa": 1.2,
  Clinic: 1.3,
  Other: 1
};

const BATHROOM_ADDON_RATE = {
  Essential: 6000,
  Premium: 10000,
  Signature: 15000
};

const PROJECT_TYPE_MIN_BUDGET = {
  "Light Upgrade": 25000,
  "Standard Renovation": 50000,
  "Full Turnkey Fitout": 75000
};

// Client asked to hide phone OTP verification for now (real-time estimate instead).
// Flip back to true to re-enable the Twilio OTP step without touching any other code.
const REQUIRE_OTP_VERIFICATION = false;

const CONTINGENCY_RATE = 0.1;
const SALES_BUFFER_RATE = 0.2;
const DISPLAY_LOWER_RATE = 0.9;
const DISPLAY_UPPER_RATE = 1.1;

function calculateRenovationCost({ propertyType, commercialType, scope, finish, area, bathrooms }) {
  const baseRate = RENOVATION_RATE_TABLE[propertyType]?.[scope]?.[finish];

  if (!baseRate || !Number.isFinite(area) || area <= 0) {
    return { lower: 0, upper: 0 };
  }

  const commercialMultiplier = propertyType === "Commercial"
    ? (COMMERCIAL_CATEGORY_MULTIPLIERS[commercialType] ?? 1)
    : 1;

  const areaCost = area * baseRate * commercialMultiplier;
  const bathroomAddon = Math.max(Number(bathrooms) || 0, 0) * (BATHROOM_ADDON_RATE[finish] ?? 0);
  const subtotal = areaCost + bathroomAddon;

  const minBudget = propertyType === "Commercial" ? 75000 : (PROJECT_TYPE_MIN_BUDGET[scope] ?? 0);
  const adjustedSubtotal = Math.max(subtotal, minBudget);

  const backendEstimate = adjustedSubtotal * (1 + CONTINGENCY_RATE + SALES_BUFFER_RATE);

  return {
    lower: backendEstimate * DISPLAY_LOWER_RATE,
    upper: backendEstimate * DISPLAY_UPPER_RATE
  };
}
