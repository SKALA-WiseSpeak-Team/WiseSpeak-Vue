import { ref, computed, watchEffect } from 'vue';
import { translations } from './translations';
import { Language, type SupportedLanguage } from './types';

// 지원되는 언어 목록
export const SUPPORTED_LANGUAGES: Record<string, SupportedLanguage> = {
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
};
// 브라우저 언어 감지
function detectBrowserLanguage(): string {
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang)
    ? browserLang
    : 'ko';
}

// 현재 언어 상태 (로컬 스토리지에서 복구하거나 브라우저 언어 감지)
export const currentLanguage = ref(
  localStorage.getItem('language') || detectBrowserLanguage()
);

// 언어 변경 함수
export function changeLanguage(lang: string) {
  if (Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
    currentLanguage.value = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('lang', lang);
  }
}

// HTML 언어 속성 설정
watchEffect(() => {
  document.documentElement.setAttribute('lang', currentLanguage.value);
});

// 번역 함수
export function t(key: string): string {
  const lang = currentLanguage.value as keyof (typeof translations)[string];

  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  return translations[key][lang] || translations[key]['en'] || key;
}

// 컴포저블 훅으로 사용
export function useI18n() {
  const locale = computed(() => currentLanguage.value);

  return {
    t,
    locale,
    currentLanguage,
    changeLanguage,
    SUPPORTED_LANGUAGES
  };
}

// 초기화 함수
export function setupI18n() {
  document.documentElement.setAttribute('lang', currentLanguage.value);
}
