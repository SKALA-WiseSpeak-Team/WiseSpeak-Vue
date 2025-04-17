// 기존 Translations 인터페이스 유지
export interface Translations {
  [key: string]: {
    ko: string;
    en: string;
    zh: string;
    ja: string;
    fr: string;
    de: string;
  };
}

// Language 타입 추가
export type Language = 'ko' | 'zh' | 'ja' | 'en' | 'fr' | 'de';

export interface SupportedLanguage {
  code: Language;
  name: string;
  flag: string;
}

// Language 값 추가
export const Language = {
  KO: 'ko',
  EN: 'en',
  ZH: 'zh',
  JA: 'ja',
  FR: 'fr',
  DE: 'de'
};
