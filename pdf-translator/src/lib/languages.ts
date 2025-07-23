export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<string, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr'
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    direction: 'ltr' // Punjabi is typically left-to-right
  }
};

export const LANGUAGE_PAIRS = [
  {
    from: LANGUAGES.en,
    to: LANGUAGES.pa,
    label: 'English → Punjabi',
    description: 'Translate from English to Punjabi'
  },
  {
    from: LANGUAGES.pa,
    to: LANGUAGES.en,
    label: 'Punjabi → English',
    description: 'Translate from Punjabi to English'
  }
];

// Franc language codes mapping
export const FRANC_TO_LANGUAGE: Record<string, string> = {
  'eng': 'en',
  'pan': 'pa',
  'guru': 'pa', // Gurmukhi script
  'deva': 'pa', // Devanagari script (sometimes used for Punjabi)
};

export function detectLanguage(text: string): string {
  // Import franc dynamically to avoid SSR issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const franc = require('franc');
  const detected = franc(text);
  
  // Map franc result to our language codes
  return FRANC_TO_LANGUAGE[detected] || 'en';
}

export function getLanguageName(code: string): string {
  return LANGUAGES[code]?.name || 'Unknown';
}

export function getNativeName(code: string): string {
  return LANGUAGES[code]?.nativeName || 'Unknown';
} 