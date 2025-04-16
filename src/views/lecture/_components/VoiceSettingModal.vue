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
  const selectedTone = ref('natural'); // 기본값: 자연스러운
  const selectedLanguage = ref('ko_KR'); // 기본값: 한국어

  // 어조 옵션
  const toneOptions = [
    {
      value: 'natural',
      label: '자연스러운',
      description: '부드럽고 자연스러운 음성'
    },
    {
      value: 'friendly',
      label: '친근한',
      description: '친근하고 대화하듯 설명하는 음성'
    },
    {
      value: 'professional',
      label: '전문적인',
      description: '전문적이고 명확한 설명 스타일'
    },
    { value: 'calm', label: '차분한', description: '차분하고 명상적인 음성' },
    {
      value: 'enthusiastic',
      label: '열정적인',
      description: '활기차고 열정적인 설명 스타일'
    }
  ];

  // 언어 옵션
  const languageOptions = [
    { value: 'ko_KR', label: '한국어', flag: '🇰🇷' },
    { value: 'en_US', label: '영어 (미국)', flag: '🇺🇸' },
    { value: 'ja_JP', label: '일본어', flag: '🇯🇵' },
    { value: 'zh_CN', label: '중국어 (간체)', flag: '🇨🇳' },
    { value: 'es_ES', label: '스페인어', flag: '🇪🇸' }
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
        class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleClose"
        ></div>

        <!-- 모달 콘텐츠 -->
        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <!-- 아이콘 -->
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10"
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

              <!-- 모달 내용 -->
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                >
                  강의 음성 설정
                </h3>
                <div class="mt-4">
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          <!-- 버튼 영역 -->
          <div
            class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="handleConfirm"
            >
              설정 완료
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
