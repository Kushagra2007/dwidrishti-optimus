export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  dir: "ltr" | "rtl";
  isPrimary: boolean;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  // Primary 6
  { code: "en", name: "English", nativeName: "English", script: "Latin", dir: "ltr", isPrimary: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari", dir: "ltr", isPrimary: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "Bengali", dir: "ltr", isPrimary: true },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Tamil", dir: "ltr", isPrimary: true },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Telugu", dir: "ltr", isPrimary: true },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari", dir: "ltr", isPrimary: true },

  // Additional 6
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati", dir: "ltr", isPrimary: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "Kannada", dir: "ltr", isPrimary: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "Malayalam", dir: "ltr", isPrimary: false },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Gurmukhi", dir: "ltr", isPrimary: false },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "Odia", dir: "ltr", isPrimary: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", script: "Arabic", dir: "rtl", isPrimary: false },
];

export const DEFAULT_LOCALE = "en";
