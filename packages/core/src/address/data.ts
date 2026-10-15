import type { ArabCountryCode } from "../countries/types.js";

export interface AddressSubdivision {
  id: string;
  name: string;
  nameAr: string;
}

export const SA_REGIONS: readonly AddressSubdivision[] = [
  { id: "riyadh", name: "Riyadh", nameAr: "الرياض" },
  { id: "makkah", name: "Makkah", nameAr: "مكة المكرمة" },
  { id: "madinah", name: "Madinah", nameAr: "المدينة المنورة" },
  { id: "qassim", name: "Al-Qassim", nameAr: "القصيم" },
  { id: "eastern", name: "Eastern Province", nameAr: "المنطقة الشرقية" },
  { id: "asir", name: "Asir", nameAr: "عسير" },
  { id: "tabuk", name: "Tabuk", nameAr: "تبوك" },
  { id: "hail", name: "Hail", nameAr: "حائل" },
  { id: "northern-borders", name: "Northern Borders", nameAr: "الحدود الشمالية" },
  { id: "jazan", name: "Jazan", nameAr: "جازان" },
  { id: "najran", name: "Najran", nameAr: "نجران" },
  { id: "al-baha", name: "Al-Baha", nameAr: "الباحة" },
  { id: "al-jouf", name: "Al-Jouf", nameAr: "الجوف" }
];

export const AE_EMIRATES: readonly AddressSubdivision[] = [
  { id: "abu-dhabi", name: "Abu Dhabi", nameAr: "أبوظبي" },
  { id: "dubai", name: "Dubai", nameAr: "دبي" },
  { id: "sharjah", name: "Sharjah", nameAr: "الشارقة" },
  { id: "ajman", name: "Ajman", nameAr: "عجمان" },
  { id: "umm-al-quwain", name: "Umm Al Quwain", nameAr: "أم القيوين" },
  { id: "ras-al-khaimah", name: "Ras Al Khaimah", nameAr: "رأس الخيمة" },
  { id: "fujairah", name: "Fujairah", nameAr: "الفجيرة" }
];

export const EG_GOVERNORATES: readonly AddressSubdivision[] = [
  { id: "cairo", name: "Cairo", nameAr: "القاهرة" },
  { id: "alexandria", name: "Alexandria", nameAr: "الإسكندرية" },
  { id: "port-said", name: "Port Said", nameAr: "بورسعيد" },
  { id: "suez", name: "Suez", nameAr: "السويس" },
  { id: "damietta", name: "Damietta", nameAr: "دمياط" },
  { id: "dakahlia", name: "Dakahlia", nameAr: "الدقهلية" },
  { id: "sharqia", name: "Sharqia", nameAr: "الشرقية" },
  { id: "qalyubia", name: "Qalyubia", nameAr: "القليوبية" },
  { id: "kafr-el-sheikh", name: "Kafr El Sheikh", nameAr: "كفر الشيخ" },
  { id: "gharbia", name: "Gharbia", nameAr: "الغربية" },
  { id: "monufia", name: "Monufia", nameAr: "المنوفية" },
  { id: "beheira", name: "Beheira", nameAr: "البحيرة" },
  { id: "ismailia", name: "Ismailia", nameAr: "الإسماعيلية" },
  { id: "giza", name: "Giza", nameAr: "الجيزة" },
  { id: "beni-suef", name: "Beni Suef", nameAr: "بني سويف" },
  { id: "faiyum", name: "Faiyum", nameAr: "الفيوم" },
  { id: "minya", name: "Minya", nameAr: "المنيا" },
  { id: "asyut", name: "Asyut", nameAr: "أسيوط" },
  { id: "sohag", name: "Sohag", nameAr: "سوهاج" },
  { id: "qena", name: "Qena", nameAr: "قنا" },
  { id: "luxor", name: "Luxor", nameAr: "الأقصر" },
  { id: "aswan", name: "Aswan", nameAr: "أسوان" },
  { id: "red-sea", name: "Red Sea", nameAr: "البحر الأحمر" },
  { id: "new-valley", name: "New Valley", nameAr: "الوادي الجديد" },
  { id: "matrouh", name: "Matrouh", nameAr: "مطروح" },
  { id: "north-sinai", name: "North Sinai", nameAr: "شمال سيناء" },
  { id: "south-sinai", name: "South Sinai", nameAr: "جنوب سيناء" }
];

export const SY_GOVERNORATES: readonly AddressSubdivision[] = [
  { id: "damascus", name: "Damascus", nameAr: "دمشق" },
  { id: "rif-dimashq", name: "Rif Dimashq", nameAr: "ريف دمشق" },
  { id: "aleppo", name: "Aleppo", nameAr: "حلب" },
  { id: "daraa", name: "Daraa", nameAr: "درعا" },
  { id: "quneitra", name: "Quneitra", nameAr: "القنيطرة" },
  { id: "as-suwayda", name: "As-Suwayda", nameAr: "السويداء" },
  { id: "homs", name: "Homs", nameAr: "حمص" },
  { id: "hama", name: "Hama", nameAr: "حماة" },
  { id: "tartus", name: "Tartus", nameAr: "طرطوس" },
  { id: "latakia", name: "Latakia", nameAr: "اللاذقية" },
  { id: "idlib", name: "Idlib", nameAr: "إدلب" },
  { id: "raqqa", name: "Raqqa", nameAr: "الرقة" },
  { id: "deir-ez-zor", name: "Deir ez-Zor", nameAr: "دير الزور" },
  { id: "al-hasakah", name: "Al-Hasakah", nameAr: "الحسكة" }
];

export const STRUCTURED_SUBDIVISIONS: Partial<Record<ArabCountryCode, readonly AddressSubdivision[]>> = {
  SA: SA_REGIONS,
  AE: AE_EMIRATES,
  EG: EG_GOVERNORATES,
  SY: SY_GOVERNORATES
};
