// 기존 Translations 인터페이스 유지
export interface Translations {
  [key: string]: {
    ko: string
    zh: string
    ja: string
    en: string
    fr: string
  }
}

// Language 타입 추가
export type Language = 'ko' | 'zh' | 'ja' | 'en' | 'fr'

export interface SupportedLanguage {
  code: Language
  name: string
  flag: string
}

// Language 값 추가
export const Language = {
  KO: 'ko',
  ZH: 'zh',
  JA: 'ja',
  EN: 'en',
  FR: 'fr'
}
