<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirm', settings: { tone: string; language: string }): void;
  }>();

  defineProps<{
    isOpen: boolean;
  }>();

  // 음성 설정 상태
  const selectedTone = ref('alloy'); // 기본값: 자연스러운
  const selectedLanguage = ref('ko'); // 기본값: 한국어

  const toneOptions = [
    {
      value: 'alloy',
      label: 'alloy',
      description: '중성적이고 현대적인 느낌, 명확하고 자연스러운 발음'
    },
    {
      value: 'ash',
      label: 'ash',
      description: '부드럽고 따뜻한 여성 음색, 친근하고 포근한 느낌'
    },
    {
      value: 'ballad',
      label: 'ballad',
      description: '감성적이고 서정적인 스타일, 약간 느린 톤'
    },
    {
      value: 'coral',
      label: 'coral',
      description: '밝고 경쾌한 여성 음색, 활기차고 명랑한 분위기'
    },
    {
      value: 'echo',
      label: 'echo',
      description: '젊고 에너지 넘치는 남성 음색, 또렷한 발음'
    },
    {
      value: 'fable',
      label: 'fable',
      description: '이야기꾼 스타일, 약간 동화적이고 부드러운 톤'
    },
    {
      value: 'onyx',
      label: 'onyx',
      description: '저음의 남성 음색, 차분하고 신뢰감 있는 느낌'
    },
    {
      value: 'nova',
      label: 'nova',
      description: '현대적이고 또렷한 여성 음색, 전문적이고 명확함'
    },
    {
      value: 'sage',
      label: 'sage',
      description: '중후하고 지적인 남성 음색, 신뢰와 안정감 전달'
    },
    {
      value: 'shimmer',
      label: 'shimmer',
      description: '밝고 섬세한 여성 음색, 산뜻하고 상냥한 분위기'
    }
  ];

  // 언어 옵션
  const languageOptions = [
    { value: 'ko', label: '한국어', flag: '🇰🇷' },
    { value: 'en', label: '영어 (미국)', flag: '🇺🇸' },
    { value: 'ja', label: '일본어', flag: '🇯🇵' },
    { value: 'zh', label: '중국어', flag: '🇨🇳' },
    { value: 'es', label: '스페인어', flag: '🇪🇸' },
    { value: 'fr', label: '프랑스어', flag: '🇫🇷' },
    { value: 'de', label: '독일어', flag: '🇩🇪' }
  ];

  // 확인 버튼 클릭 시 설정 전달
  const handleConfirm = () => {
    emit('confirm', {
      tone: selectedTone.value,
      language: selectedLanguage.value
    });
  };

  // 취소 버튼 클릭 시 모달 닫기
  const handleClose = () => {
    emit('close');
  };
</script>

<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto">
      <!-- 배경 오버레이 -->
      <div
        class="flex items-center justify-center min-h-screen p-4 text-center"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleClose"
        ></div>

        <!-- 모달 콘텐츠 -->
        <div
          class="inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-md mx-auto"
        >
          <div class="bg-white dark:bg-gray-800 px-6 pt-5 pb-4">
            <div class="flex flex-col items-start">
              <!-- 아이콘과 제목 -->
              <div class="flex items-center mb-4">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 mr-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                >
                  강의 음성 설정
                </h3>
              </div>

              <!-- 모달 내용 -->
              <div class="w-full">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  강의를 시작하기 전에 음성 스타일과 언어를 선택해주세요.
                </p>

                <!-- 어조 선택 -->
                <div class="mb-4">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    어조 선택
                  </label>
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1"
                  >
                    <div
                      v-for="tone in toneOptions"
                      :key="tone.value"
                      class="relative border rounded-md px-3 py-2 cursor-pointer transition-colors"
                      :class="{
                        'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30':
                          selectedTone === tone.value,
                        'border-gray-300 dark:border-gray-600':
                          selectedTone !== tone.value
                      }"
                      @click="selectedTone = tone.value"
                    >
                      <span
                        class="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ tone.label }}
                      </span>
                      <span
                        class="block text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ tone.description }}
                      </span>
                      <div
                        v-if="selectedTone === tone.value"
                        class="absolute inset-y-0 right-0 flex items-center pr-2"
                      >
                        <svg
                          class="h-5 w-5 text-blue-500 dark:text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 언어 선택 -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    언어 선택
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      v-for="language in languageOptions"
                      :key="language.value"
                      class="relative border rounded-md px-3 py-2 cursor-pointer transition-colors"
                      :class="{
                        'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30':
                          selectedLanguage === language.value,
                        'border-gray-300 dark:border-gray-600':
                          selectedLanguage !== language.value
                      }"
                      @click="selectedLanguage = language.value"
                    >
                      <div class="flex items-center gap-2">
                        <span class="text-lg">{{ language.flag }}</span>
                        <span
                          class="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ language.label }}
                        </span>
                      </div>
                      <div
                        v-if="selectedLanguage === language.value"
                        class="absolute inset-y-0 right-0 flex items-center pr-2"
                      >
                        <svg
                          class="h-5 w-5 text-blue-500 dark:text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 버튼 영역 -->
          <div
            class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row-reverse sm:justify-end gap-2"
          >
            <button
              type="button"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
              @click="handleConfirm"
            >
              설정 완료
            </button>
            <button
              type="button"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
              @click="handleClose"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
