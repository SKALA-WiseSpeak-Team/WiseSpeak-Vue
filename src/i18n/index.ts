import { createI18n } from 'vue-i18n'
import type { Language, SupportedLanguage } from './types'
import { translations } from './translations'

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

// 브라우저 언어 설정 가져오기
const browserLang = navigator.language.split('-')[0] as Language
const savedLocale = localStorage.getItem('locale') as Language

// 기본 언어 설정
const defaultLocale =
  savedLocale ||
  (SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang)
    ? browserLang
    : 'en')

// 번역 데이터 형식 변환
const messages = Object.keys(translations).reduce(
  (acc, key) => {
    SUPPORTED_LANGUAGES.forEach(({ code }) => {
      if (!acc[code]) acc[code] = {}
      acc[code][key] = translations[key][code]
    })
    return acc
  },
  {} as Record<string, Record<string, string>>
)

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages
})

// 언어 변경 함수
export const setLocale = (locale: Language) => {
  i18n.global.locale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
  localStorage.setItem('locale', locale)
}

export default i18n
