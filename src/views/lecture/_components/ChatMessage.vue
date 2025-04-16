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
      class="max-w-[90%] rounded-lg p-3"
      :class="{
        'bg-blue-600 text-white': message.role === 'user',
        'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
          message.role === 'system',
        'relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden bg-white dark:bg-gray-800':
          message.role === 'assistant'
      }"
    >
      <p class="text-sm">{{ message.content }}</p>
      <div
        v-if="
          message.role === 'assistant' &&
          message.references &&
          message.references.length > 0
        "
        class="mt-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <button
          class="text-blue-600 dark:text-blue-400 hover:underline text-xs p-0"
          v-for="(reference, idx) in message.references"
          :key="idx"
          @click="onReferenceClick && onReferenceClick(reference)"
        >
          참조: 페이지 {{ reference }}
        </button>
      </div>
    </div>
  </div>
</template>
