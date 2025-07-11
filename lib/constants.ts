// constants.ts
export const ARABIC_COUNTRY_VALUES = [
  "Asia/Riyadh",
  "Africa/Tripoli",
  "Asia/Kuwait",
  "Asia/Baghdad",
  "Asia/Dubai",
  "Africa/Cairo",
  "Africa/Algiers",
  "Africa/Casablanca",
  "Africa/Tunis",
  "Asia/Damascus",
  "Asia/Gaza",
  "Asia/Amman",
  "Asia/Beirut",
  "Asia/Bahrain",
  "Asia/Qatar",
  "Asia/Muscat",
  "Asia/Aden",
  "Africa/Khartoum",
  "Africa/Nouakchott",
  "Africa/Mogadishu",
  "Africa/Djibouti",
  "Indian/Comoro",
] as const;

// استخرج النوع الموحَّد للقيم
export type ArabicCountryValue = typeof ARABIC_COUNTRY_VALUES[number];

// الآن عرّف قائمة العرض (label/value) للعربية
export const ARABIC_COUNTRIES: { label: string; value: ArabicCountryValue }[] = [
  { label: "السعودية", value: "Asia/Riyadh" },
  { label: "ليبيا",    value: "Africa/Tripoli" },
  { label: "الكويت",   value: "Asia/Kuwait" },
  { label: "العراق",   value: "Asia/Baghdad" },
  { label: "الإمارات", value: "Asia/Dubai" },
  { label: "مصر",      value: "Africa/Cairo" },
  { label: "الجزائر",  value: "Africa/Algiers" },
  { label: "المغرب",   value: "Africa/Casablanca" },
  { label: "تونس",     value: "Africa/Tunis" },
  { label: "سوريا",    value: "Asia/Damascus" },
  { label: "فلسطين",   value: "Asia/Gaza" },
  { label: "الأردن",   value: "Asia/Amman" },
  { label: "لبنان",    value: "Asia/Beirut" },
  { label: "البحرين",  value: "Asia/Bahrain" },
  { label: "قطر",      value: "Asia/Qatar" },
  { label: "عُمان",    value: "Asia/Muscat" },
  { label: "اليمن",    value: "Asia/Aden" },
  { label: "السودان",  value: "Africa/Khartoum" },
  { label: "موريتانيا",value: "Africa/Nouakchott" },
  { label: "الصومال",  value: "Africa/Mogadishu" },
  { label: "جيبوتي",   value: "Africa/Djibouti" },
  { label: "جزر القمر", value: "Indian/Comoro" },
];






export const ROLE_VALUES = [
  "superadmin",
  "admin",
  "moderator",
  "special",
  "normal",
] as const;






export const sidebarLinks = [
  {
    imgURL: "/home.svg",
    route: "/",
    label: "الرئيسية",
  },
  {
    imgURL: "/users.svg",
    route: "/dashboard",
    label: "لوحة التحكم",
    hideFor: ["normal", "special"],
  },
  {
    imgURL: "/suitcase.svg",
    route: "/apply",
    label: "النموذج العام",
  },
    {
    imgURL: "/rules.svg",
    route: "/rules",
    label: "القوانين",
  },
  {
    imgURL: "/skull.svg",
    route: "/secret-room",
    label: "الغرفة السرية",
  },
  // {
  //   imgURL: "/icons/tag.svg",
  //   route: "/tags",
  //   label: "Tags",
  // },
  // {
  //   imgURL: "/icons/user.svg",
  //   route: "/profile",
  //   label: "Profile",
  // },
  // {
  //   imgURL: "/icons/question.svg",
  //   route: "/ask-question",
  //   label: "Ask a question",
  // },
];




const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  APPLY: "/apply",
  RULES: "/rules",
  DEFEAT_DANGER: "/defeat-danger",
};

export default ROUTES;