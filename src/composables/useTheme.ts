import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  onMounted(() => {
    // 저장된 환경설정 또는 시스템 설정 확인
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    updateTheme()
  })

  // isDark가 변경될 때마다 테마 업데이트
  watch(isDark, updateTheme)

  return {
    isDark,
    toggleTheme
  }
}