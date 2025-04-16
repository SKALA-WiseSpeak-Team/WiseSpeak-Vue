<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps<{
    currentPage: number;
    totalPages: number;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    currentTime: string;
    totalTime: string;
  }>();

  const emit = defineEmits<{
    (e: 'togglePlay'): void;
    (e: 'toggleMute'): void;
    (e: 'volumeChange', value: number): void;
    (e: 'prevPage'): void;
    (e: 'nextPage'): void;
    (e: 'pageChange', page: number): void;
  }>();

  const handleVolumeChange = (event: Event) => {
    const value = Number((event.target as HTMLInputElement).value);
    emit('volumeChange', value);
  };
</script>

<template>
  <div class="mt-4 bg-gray-200/20 dark:bg-gray-700/20 p-4 rounded-md">
    <div class="mb-2">
      <div
        class="h-12 bg-gray-300/30 dark:bg-gray-600/30 rounded-md mb-2 relative overflow-hidden"
      >
        <div
          class="absolute inset-0"
          :style="{
            backgroundImage: 'url(https://placehold.co/800x100)',
            backgroundSize: 'cover',
            opacity: 0.5
          }"
        ></div>
        <div
          class="absolute bottom-0 left-0 h-full bg-amber-500/30 dark:bg-amber-600/30 transition-all"
          :style="{ width: `${isPlaying ? 30 : 0}%` }"
        ></div>
      </div>

      <div class="flex justify-between items-center">
        <button
          class="p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          @click="emit('togglePlay')"
        >
          <svg
            v-if="isPlaying"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 9v6m4-6v6M9 9h1m4 0h1M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <div class="flex items-center gap-2 flex-1 mx-4">
          <button
            class="p-1 text-gray-600 dark:text-gray-400"
            @click="emit('toggleMute')"
          >
            <svg
              v-if="isMuted"
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
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clip-rule="evenodd"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
            <svg
              v-else-if="volume < 50"
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
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clip-rule="evenodd"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072"
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
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                clip-rule="evenodd"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
              />
            </svg>
          </button>
          <div class="w-20 md:w-32">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="volume"
              @input="handleVolumeChange"
              class="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentTime }} / {{ totalTime }}
        </div>
      </div>
    </div>

    <div class="flex justify-between mt-2">
      <div class="flex items-center gap-2">
        <input
          type="number"
          min="1"
          :max="totalPages"
          :value="currentPage"
          @input="
            e =>
              emit('pageChange', Number((e.target as HTMLInputElement).value))
          "
          class="w-16 text-center px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          / {{ totalPages }}
        </span>
      </div>

      <div class="flex gap-2">
        <button
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          @click="emit('prevPage')"
          :disabled="currentPage <= 1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전 페이지
        </button>

        <button
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          @click="emit('nextPage')"
          :disabled="currentPage >= totalPages"
        >
          다음 페이지
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
