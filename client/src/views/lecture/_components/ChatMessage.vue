<script setup lang="ts">
  defineProps<{
    message: {
      id: number;
      role: string;
      content: string;
      references?: number[];
    };
    onReferenceClick?: (page: number) => void;
  }>();
</script>

<template>
  <div
    class="mb-4"
    :class="{
      'flex justify-end': message.role === 'user',
      'flex justify-start': message.role !== 'user'
    }"
  >
    <div
      class="max-w-[90%] rounded-lg p-3 word-wrap-break-word"
      :class="{
        'bg-blue-600 text-white': message.role === 'user',
        'bg-white dark:bg-gray-800 border-2 border-blue-600/30 dark:border-blue-500/30':
          message.role !== 'user'
      }"
    >
      <p class="text-sm break-words whitespace-pre-wrap">
        {{ message.content }}
      </p>

      <!-- 참조 페이지 정보가 있다면 표시 -->
      <div
        v-if="message.references && message.references.length > 0"
        class="mt-2"
      >
        <p class="text-xs text-gray-200 dark:text-gray-400 mb-1">
          참조 페이지:
        </p>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="page in message.references"
            :key="page"
            @click="onReferenceClick && onReferenceClick(page)"
            class="text-xs px-1.5 py-0.5 bg-blue-500/20 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
          >
            {{ page }}p
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .word-wrap-break-word {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    max-width: 100%;
  }
</style>
