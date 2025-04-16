<script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from 'vue';
  import VuePdfEmbed from 'vue-pdf-embed';

  const props = defineProps<{
    currentPage: number;
    totalPages: number;
    zoomLevel: number;
    isFullscreen: boolean;
    title: string;
    pdfUrl: string;
  }>();

  const emit = defineEmits<{
    (e: 'zoomIn'): void;
    (e: 'zoomOut'): void;
    (e: 'resetZoom'): void;
    (e: 'toggleFullscreen'): void;
    (e: 'toggleChat'): void;
    (e: 'update:totalPages', pages: number): void;
  }>();

  const pdfContainerRef = ref<HTMLDivElement | null>(null);
  const pdfRef = ref<InstanceType<typeof VuePdfEmbed> | null>(null);

  defineExpose({
    pdfContainerRef
  });

  const pdfScale = computed(() => props.zoomLevel / 100);

  // Handle PDF load to emit total pages
  const handlePdfLoad = (event: any) => {
    const totalPages = event.source?.numPages || 0;
    if (totalPages > 0) {
      emit('update:totalPages', totalPages);
    }
  };
</script>

<template>
  <div>
    <!-- PDF 뷰어 상단 컨트롤 -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-2">
        <button
          class="p-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
          @click="emit('zoomOut')"
          :disabled="zoomLevel <= 50"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            />
          </svg>
        </button>
        <span class="text-sm">{{ zoomLevel }}%</span>
        <button
          class="p-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
          @click="emit('zoomIn')"
          :disabled="zoomLevel >= 200"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </button>
        <button
          class="p-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          @click="emit('resetZoom')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 inline mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          초기화
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="hidden lg:flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="emit('toggleChat')"
        >
          채팅 표시/숨기기
        </button>
        <button
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          @click="emit('toggleFullscreen')"
        >
          <svg
            v-if="isFullscreen"
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
              d="M4 16h4M4 16v4M4 16l6-6M20 8h-4M20 8V4M20 8l-6 6"
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
              d="M4 8V4m0 4h4M4 8l5-5M20 8V4m0 4h-4m4 0l-5-5M4 16v4m0-4h4m-4 0l5 5M20 16v4m0-4h-4m4 0l-5 5"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- PDF 뷰어 콘텐츠 -->
    <div
      v-if="pdfUrl"
      ref="pdfContainerRef"
      class="relative bg-gray-200/30 dark:bg-gray-700/30 rounded-md overflow-auto"
      style="height: calc(100vh - 300px)"
    >
      <VuePdfEmbed
        ref="pdfRef"
        :source="pdfUrl"
        :page="currentPage"
        :scale="pdfScale"
        class="w-full h-full"
        @loaded="handlePdfLoad"
      />
      <div
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center"
      >
        <span
          class="text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded"
        >
          페이지 {{ currentPage }} / {{ totalPages }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="relative bg-gray-200/30 dark:bg-gray-700/30 rounded-md overflow-auto flex items-center justify-center"
      style="height: calc(100vh - 300px)"
    >
      <p class="text-gray-500 dark:text-gray-400">PDF를 로드할 수 없습니다.</p>
    </div>
  </div>
</template>
