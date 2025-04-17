<script setup lang="ts">
  defineProps<{
    isOpen: boolean;
    type?: 'loading' | 'error';
    message?: string;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

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
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <!-- 로딩 모달 -->
      <div
        v-if="type === 'loading'"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="flex flex-col items-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"
          ></div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ message || '로딩 중...' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            PDF와 오디오 파일을 로드하는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      </div>

      <!-- 에러 모달 -->
      <div
        v-else-if="type === 'error'"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="flex flex-col items-center">
          <div
            class="rounded-full h-16 w-16 bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ message || '오류가 발생했습니다' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {{
              errorMessage ||
              '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'
            }}
          </p>
          <button
            @click="handleClose"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
