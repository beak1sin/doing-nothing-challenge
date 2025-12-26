import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface Ranking {
  id: string;
  nickname: string;
  score: number;
  country: string;
  created_at: string;
}

// 국가 코드 -> 국기 이모지 변환
export const countryFlags: Record<string, string> = {
  KR: "🇰🇷",
  US: "🇺🇸",
  JP: "🇯🇵",
  CN: "🇨🇳",
  GB: "🇬🇧",
  DE: "🇩🇪",
  FR: "🇫🇷",
  CA: "🇨🇦",
  AU: "🇦🇺",
  BR: "🇧🇷",
  IN: "🇮🇳",
  RU: "🇷🇺",
  MX: "🇲🇽",
  ES: "🇪🇸",
  IT: "🇮🇹",
  NL: "🇳🇱",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  PL: "🇵🇱",
  TW: "🇹🇼",
  HK: "🇭🇰",
  SG: "🇸🇬",
  TH: "🇹🇭",
  VN: "🇻🇳",
  PH: "🇵🇭",
  ID: "🇮🇩",
  MY: "🇲🇾",
  NZ: "🇳🇿",
};

// 국가 코드 -> 국가명 변환
export const countryNames: Record<string, string> = {
  KR: "한국",
  US: "미국",
  JP: "일본",
  CN: "중국",
  GB: "영국",
  DE: "독일",
  FR: "프랑스",
  CA: "캐나다",
  AU: "호주",
  BR: "브라질",
  IN: "인도",
  RU: "러시아",
  MX: "멕시코",
  ES: "스페인",
  IT: "이탈리아",
  NL: "네덜란드",
  SE: "스웨덴",
  NO: "노르웨이",
  DK: "덴마크",
  FI: "핀란드",
  PL: "폴란드",
  TW: "대만",
  HK: "홍콩",
  SG: "싱가포르",
  TH: "태국",
  VN: "베트남",
  PH: "필리핀",
  ID: "인도네시아",
  MY: "말레이시아",
  NZ: "뉴질랜드",
};

export const getFlag = (countryCode: string): string => {
  return countryFlags[countryCode] || "🌍";
};
