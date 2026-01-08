// Unicode fonts for multilingual PDF support
// To add actual fonts: Download .ttf files and convert to base64
// 1. Download from: https://github.com/google/fonts/tree/main/ofl/notosansdevanagari
// 2. Download from: https://github.com/google/fonts/tree/main/ofl/notosanstamil
// 3. Convert to base64 using: btoa(fileContent) or online tool

export const fonts = {
  // Placeholder: Add base64 encoded Noto Sans Devanagari Regular here
  NotoSansDevanagari: null,

  // Placeholder: Add base64 encoded Noto Sans Tamil Regular here
  NotoSansTamil: null,
};

// Instructions to add fonts:
// 1. Replace null values above with base64 strings
// 2. Format: 'data:font/ttf;base64,AAEAAAALAIAAAwAwT1...' (very long string)
// 3. Fonts will auto-load in pdfGenerator.js when available
