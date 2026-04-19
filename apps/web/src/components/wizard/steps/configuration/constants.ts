export const OPTION_LABELS: Record<string, Record<string, string>> = {
  seating_type: {
    open: "Open Seating",
    reserved: "Reserved Seating",
  },
  food_package: {
    none: "No Food",
    light: "Light Snacks",
    full: "Full Catering",
  },
  date_flex_window_days: {
    "0": "No Flexibility",
    "7": "± 7 Days",
    "30": "± 30 Days",
  },
  priority_level: {
    "1": "Standard",
    "2": "Priority",
    "3": "VIP",
  },
  catering_license_tier: {
    tier_3: "Tier 3",
  },
};

export const OPTION_CODE_LABELS: Record<string, string> = {
  seating_type: "Seating Type",
  food_package: "Food Package",
  date_flex_window_days: "Date Flexibility",
  priority_level: "Priority Level",
  catering_license_tier: "Catering License Tier",
};
