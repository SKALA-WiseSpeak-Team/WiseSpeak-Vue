<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    title: string;
    description: string;
    voiceSettings: {
      tone: string;
      language: string;
    };
  }>();

  const emit = defineEmits<{
    (e: 'navigateToGallery'): void;
    (e: 'openSettings'): void;
  }>();

  const goToGallery = () => {
    emit('navigateToGallery');
  };

  const openSettings = () => {
    emit('openSettings');
  };

  // 선택된 언어에 따른 텍스트와 아이콘 반환
  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'ko':
        return '🇰🇷 한국어';
      case 'en':
        return '🇺🇸 영어 (미국)';
      case 'ja':
        return '🇯🇵 일본어';
      case 'zh':
        return '🇨🇳 중국어';
      case 'es':
        return '🇪🇸 스페인어';
      case 'fr':
        return '🇫🇷 프랑스어';
      case 'de':
        return '🇩🇪 독일어';
      default:
        return '언어';
    }
  };

  // 선택된 어조에 따른 텍스트 반환
  const getToneDisplay = (tone: string) => {
    switch (tone) {
      case 'alloy':
        return '중성적이고 현대적인 느낌';
      case 'ash':
        return '부드럽고 따뜻한 여성 음색';
      case 'ballad':
        return '감성적이고 서정적인 스타일';
      case 'coral':
        return '밝고 경쾌한 여성 음색';
      case 'echo':
        return '젊고 에너지 넘치는 남성 음색';
      case 'fable':
        return '이야기꾼 스타일';
      case 'onyx':
        return '저음의 남성 음색';
      case 'nova':
        return '현대적이고 또렷한 여성 음색';
      case 'sage':
        return '중후하고 지적인 남성 음색';
      case 'shimmer':
        return '밝고 섬세한 여성 음색';
      default:
        return '어조';
    }
  };
</script>

<template>
  <!-- 상단 네비게이션 -->
  <div class="flex items-center mb-4">
    <button
      class="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
      @click="goToGallery"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      갤러리
    </button>

    <!-- 현재 선택된 설정 표시 -->
    <div
      class="ml-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
    >
      <span>{{ getLanguageDisplay(voiceSettings.language) }}</span>
      <span>|</span>
      <span>{{ getToneDisplay(voiceSettings.tone) }}</span>
      <button
        @click="openSettings"
        class="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        title="음성 설정 변경"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- 강의 제목 및 설명 -->
  <div class="mb-4 transition-all transform">
    <h1
      class="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white"
    >
      {{ title }}
    </h1>
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      {{ description }}
    </p>
  </div>
</template>
