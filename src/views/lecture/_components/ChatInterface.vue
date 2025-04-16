<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';

  import ChatMessage from './ChatMessage.vue';

  const props = defineProps<{
    messages: {
      id: number;
      role: string;
      content: string;
      references?: number[];
    }[];
    isLoading: boolean;
    isRecording: boolean;
    isListening: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'sendMessage', message: string): void;
    (e: 'toggleRecording'): void;
    (e: 'navigateToPage', page: number): void;
  }>();

  const chatInput = ref('');
  const chatContainerRef = ref<HTMLElement | null>(null);

  // 메시지 전송 처리
  const handleSendMessage = (e: Event) => {
    e.preventDefault();
    if (!chatInput.value.trim() || props.isLoading || props.isListening) return;

    emit('sendMessage', chatInput.value);
    chatInput.value = '';
  };

  // 페이지 참조 클릭 처리
  const handleReferenceClick = (page: number) => {
    emit('navigateToPage', page);
  };

  // 채팅 컨테이너 자동 스크롤
  watch(
    () => props.messages.length,
    () => {
      nextTick(() => {
        if (chatContainerRef.value) {
          chatContainerRef.value.scrollTop =
            chatContainerRef.value.scrollHeight;
        }
      });
    }
  );
</script>

<template>
  <div
    class="relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden h-full"
  >
    <div class="absolute top-0 left-0 w-full h-1 bg-amber-500/70"></div>
    <div class="absolute bottom-0 left-0 w-full h-1 bg-amber-500/70"></div>

    <div class="pt-6 h-full flex flex-col p-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        질문하기
      </h3>

      <!-- 채팅 메시지 영역 -->
      <div
        ref="chatContainerRef"
        class="flex-1 overflow-y-auto mb-4 relative border-y-2 border-blue-600/30 dark:border-blue-500/30 py-4 px-6"
        style="height: calc(100vh - 400px)"
      >
        <div
          class="absolute -left-3 -top-3 w-6 h-6 bg-amber-500/20 rounded-full"
        ></div>
        <div
          class="absolute -right-3 -bottom-3 w-6 h-6 bg-amber-500/20 rounded-full"
        ></div>

        <TransitionGroup name="chat-message">
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :onReferenceClick="handleReferenceClick"
          />

          <!-- 로딩 표시 -->
          <div v-if="isLoading" key="loading" class="flex justify-start mb-4">
            <div
              class="max-w-[90%] relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden bg-white dark:bg-gray-800 p-3"
            >
              <div class="flex space-x-2">
                <div
                  class="w-2 h-2 rounded-full bg-gray-500/30 dark:bg-gray-400/30 animate-pulse"
                ></div>
                <div
                  class="w-2 h-2 rounded-full bg-gray-500/30 dark:bg-gray-400/30 animate-pulse"
                  style="animation-delay: 0.2s"
                ></div>
                <div
                  class="w-2 h-2 rounded-full bg-gray-500/30 dark:bg-gray-400/30 animate-pulse"
                  style="animation-delay: 0.4s"
                ></div>
              </div>
            </div>
          </div>

          <!-- 음성 인식 중 표시 -->
          <div v-if="isListening" key="listening" class="flex justify-end mb-4">
            <div class="max-w-[90%] bg-amber-500/20 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                ></div>
                <span class="text-xs text-gray-700 dark:text-gray-300"
                  >음성 인식 중...</span
                >
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- 메시지 입력 폼 -->
      <form @submit.prevent="handleSendMessage" class="flex gap-2">
        <input
          v-model="chatInput"
          type="text"
          placeholder="질문을 입력하세요..."
          class="relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex-1"
          :disabled="isRecording || isListening"
        />
        <button
          type="button"
          :class="[
            isRecording
              ? 'bg-amber-500 text-white'
              : 'relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden bg-white dark:bg-gray-800'
          ]"
          @click="emit('toggleRecording')"
          class="p-2 rounded-md"
        >
          <svg
            v-if="isRecording"
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
          <svg
            v-else
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        <button
          type="submit"
          class="bg-gradient-to-b from-amber-500 to-amber-600 text-white font-bold uppercase tracking-wider px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
          :disabled="
            (!chatInput.trim() && !isRecording) || isLoading || isListening
          "
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .chat-message-enter-active,
  .chat-message-leave-active {
    transition: all 0.3s;
  }
  .chat-message-enter-from,
  .chat-message-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
