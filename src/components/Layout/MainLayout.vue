<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ThemeSwitcher from '../ThemeSwitcher.vue'

  const isMenuOpen = ref(false)
  const isLangMenuOpen = ref(false)
  const isDarkMode = ref(false)

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const toggleLangMenu = () => {
    isLangMenuOpen.value = !isLangMenuOpen.value
  }

  // const changeLanguage = (langCode: string) => {
  //   setLocale(langCode)
  //   isLangMenuOpen.value = false
  // }

  onMounted(() => {
    // 저장된 다크모드 설정 불러오기
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    isDarkMode.value = savedDarkMode
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  })
</script>

<template>
  <div class="min-h-screen bg-theme-primary">
    <header
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="container mx-auto px-4 py-4 flex items-center">
        <!-- 로고 영역 -->
        <a href="/" class="flex items-center mr-8">
          <img
            src="/logo.svg"
            alt="WiseSpeak Logo"
            class="w-10 h-10 rounded-md mr-3"
          />
          <span class="font-bold text-xl text-gray-900 dark:text-white"
            >WiseSpeak</span
          >
        </a>

        <!-- 메인 네비게이션 - 로고 바로 옆에 위치 -->
        <nav class="hidden md:flex space-x-8 flex-grow">
          <a
            href="/"
            class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >홈</a
          >
          <a
            href="/gallery"
            class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >강의 갤러리</a
          >
          <a
            href="/create"
            class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >강의 만들기</a
          >
        </nav>

        <!-- 오른쪽 영역: 언어 선택 및 테마 스위처 -->
        <div class="flex items-center space-x-4 ml-auto">
          <!-- 언어 선택 드롭다운 -->
          <div class="relative">
            <button
              class="flex items-center space-x-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300"
              @click="toggleLangMenu"
            >
              <span>한국어</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- 언어 선택 드롭다운 메뉴 -->
            <div
              v-if="isLangMenuOpen"
              class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
            >
              <button
                v-for="lang in ['ko', 'en', 'ja', 'zh', 'fr']"
                :key="lang"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {{
                  lang === 'ko'
                    ? '한국어'
                    : lang === 'en'
                      ? 'English'
                      : lang === 'ja'
                        ? '日本語'
                        : lang === 'zh'
                          ? '中文'
                          : 'Français'
                }}
              </button>
            </div>
          </div>

          <!-- 다크모드 토글 -->
          <ThemeSwitcher />

          <!-- 모바일 메뉴 버튼 -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Menu"
          >
            <svg
              v-if="!isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 모바일 메뉴 -->
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <nav class="flex flex-col space-y-1 px-4 py-3">
          <a
            href="/"
            class="py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >홈</a
          >
          <a
            href="/gallery"
            class="py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >강의 갤러리</a
          >
          <a
            href="/create"
            class="py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >강의 만들기</a
          >
        </nav>
      </div>
    </header>

    <main class="min-h-screen flex-grow bg-gray-50 dark:bg-gray-900">
      <slot></slot>
    </main>

    <footer
      class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8"
    >
      <div class="container mx-auto px-4">
        <p class="text-center text-theme-secondary">
          &copy; 2025 WiseSpeak. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
