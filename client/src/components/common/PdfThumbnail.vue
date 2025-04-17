<script setup lang="ts">
  // PdfThumbnail.vue
  import {
    ref,
    defineProps,
    defineEmits,
    watch,
    onMounted,
    computed
  } from 'vue';
  import VuePdfEmbed from 'vue-pdf-embed';

  const props = defineProps<{
    pdfUrl: string;
    width?: number;
    height?: number;
    title?: string; // 제목 추가 (대체 이미지 텍스트로 사용)
  }>();

  const emit = defineEmits(['loaded', 'error']);

  const isLoading = ref(true);
  const hasError = ref(false);

  // PDF URL이 있는지 확인
  const hasPdfUrl = computed(() => {
    return !!props.pdfUrl && props.pdfUrl.trim() !== '';
  });

  // 대체 이미지 URL (제목이 있는 경우 제목 포함)
  const fallbackImageUrl = computed(() => {
    const text = props.title ? props.title.substring(0, 20) : 'PDF Preview';
    return `https://placehold.co/800x400?text=${encodeURIComponent(text)}`;
  });

  // PDF 렌더링 완료 핸들러
  const handleRendered = () => {
    isLoading.value = false;
    emit('loaded');
  };

  // PDF 로드 오류 핸들러
  const handleError = (error: any) => {
    console.error('PDF 썸네일 렌더링 오류:', error);
    hasError.value = true;
    isLoading.value = false;
    emit('error');
  };

  // URL이 변경되면 로딩 상태 재설정
  watch(
    () => props.pdfUrl,
    () => {
      if (hasPdfUrl.value) {
        isLoading.value = true;
        hasError.value = false;
      } else {
        // PDF URL이 없으면 바로 에러 상태로
        hasError.value = true;
        isLoading.value = false;
        emit('error');
      }
    }
  );

  onMounted(() => {
    if (!hasPdfUrl.value) {
      hasError.value = true;
      isLoading.value = false;
      emit('error');
    }
  });
</script>

<template>
  <div class="pdf-thumbnail-container relative">
    <!-- PDF URL이 없거나 오류 발생 시 대체 이미지 표시 -->
    <div
      v-if="!hasPdfUrl || hasError"
      class="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center"
    >
      <img
        :src="fallbackImageUrl"
        :alt="title || 'PDF Preview'"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 로딩 표시 -->
    <div
      v-else-if="isLoading"
      class="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
    >
      <svg
        class="w-10 h-10 text-gray-400 dark:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>

    <!-- vue-pdf-embed 컴포넌트 (PDF URL이 있고 로딩 중이거나 로딩 성공일 때만 표시) -->
    <div
      v-if="hasPdfUrl && !hasError"
      :class="{
        'opacity-0': isLoading,
        'opacity-100': !isLoading
      }"
      class="mx-auto transition-opacity duration-300"
    >
      <vue-pdf-embed
        :source="props.pdfUrl"
        :page="1"
        :width="width"
        :height="height"
        @rendered="handleRendered"
        @error="handleError"
      />
    </div>
  </div>
</template>

<style scoped>
  .pdf-thumbnail-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.03);
  }
</style>
