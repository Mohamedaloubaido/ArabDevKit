export interface NormalizeArabicOptions {
  removeDiacritics?: boolean;
  removeTatweel?: boolean;
  normalizeAlef?: boolean;
  normalizeYa?: boolean;
}

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;

export function normalizeArabic(
  input: string,
  options: NormalizeArabicOptions = {}
): string {
  const {
    removeDiacritics = true,
    removeTatweel = true,
    normalizeAlef = true,
    normalizeYa = true
  } = options;

  let value = input.normalize("NFKC");

  if (removeDiacritics) value = value.replace(ARABIC_DIACRITICS, "");
  if (removeTatweel) value = value.replace(TATWEEL, "");
  if (normalizeAlef) value = value.replace(/[إأآٱ]/g, "ا");
  if (normalizeYa) value = value.replace(/ى/g, "ي");

  return value;
}
