<script setup lang="ts">
  import {
    defineProps,
    defineEmits,
    ref,
    watch,
    computed,
    onMounted,
    onUnmounted
  } from 'vue';

  const props = defineProps<{
    currentPage: number;
    totalPages: number;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    currentTime: string;
    totalTime: string;
    audioUrl: string;
  }>();

  const emit = defineEmits<{
    (e: 'togglePlay'): void;
    (e: 'toggleMute'): void;
    (e: 'volumeChange', value: number): void;
    (e: 'prevPage'): void;
    (e: 'nextPage'): void;
    (e: 'pageChange', page: number): void;
    (e: 'timeUpdate', currentTime: number, duration: number): void;
  }>();

  // 오디오 요소 참조
  const audioRef = ref<HTMLAudioElement | null>(null);
  const seekBarRef = ref<HTMLDivElement | null>(null);
  const currentTimeRef = ref(0);
  const durationRef = ref(0);
  const seeking = ref(false);
  const seekPosition = ref(0);
  const isDragging = ref(false);

  // 재생 진행도 계산
  const progressPercentage = computed(() => {
    if (durationRef.value === 0) return 0;
    return (currentTimeRef.value / durationRef.value) * 100;
  });

  // 시간 포맷 함수
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 현재 시간과 총 시간 계산
  const displayCurrentTime = computed(() => formatTime(currentTimeRef.value));
  const displayTotalTime = computed(() => formatTime(durationRef.value));

  // 볼륨 변경 처리
  const handleVolumeChange = (event: Event) => {
    const value = Number((event.target as HTMLInputElement).value);
    emit('volumeChange', value);
    if (audioRef.value) {
      audioRef.value.volume = value / 100;
    }
  };

  // 시크바에서 마우스 클릭 처리
  const handleSeekBarClick = (e: MouseEvent) => {
    if (!seekBarRef.value || !audioRef.value || durationRef.value <= 0) return;

    const rect = seekBarRef.value.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    const time = (percentage / 100) * durationRef.value;

    audioRef.value.currentTime = time;
    currentTimeRef.value = time;
    emit('timeUpdate', time, durationRef.value);
  };

  // 시크 포인터 드래그 시작
  const startDragging = (e: MouseEvent) => {
    e.preventDefault();
    isDragging.value = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDragging);

    // 드래그 중에는 재생을 일시 중지할 수도 있음 (옵션)
    const wasPlaying = props.isPlaying;
    if (wasPlaying) {
      // emit('togglePlay'); // 드래그 중 일시정지하고 싶다면 이 주석을 해제
    }
  };

  // 드래그 중 처리
  const handleDrag = (e: MouseEvent) => {
    if (
      !isDragging.value ||
      !seekBarRef.value ||
      !audioRef.value ||
      durationRef.value <= 0
    )
      return;

    const rect = seekBarRef.value.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    const time = (percentage / 100) * durationRef.value;

    // 드래그 중에는 UI만 업데이트하고 실제 오디오 현재 시간은 변경하지 않을 수도 있음
    currentTimeRef.value = time; // 미리보기처럼 UI 업데이트
  };

  // 드래그 종료 처리
  const stopDragging = (e: MouseEvent) => {
    if (!isDragging.value) return;

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDragging);

    // 드래그 종료 시 오디오 위치 설정
    if (seekBarRef.value && audioRef.value && durationRef.value > 0) {
      const rect = seekBarRef.value.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (offsetX / rect.width) * 100;
      const time = (percentage / 100) * durationRef.value;

      audioRef.value.currentTime = time;
      currentTimeRef.value = time;
      emit('timeUpdate', time, durationRef.value);

      // 필요하다면 드래그 전에 재생 중이었으면 다시 재생 시작
      // if (wasPlaying) emit('togglePlay');
    }

    isDragging.value = false;
  };

  // 오디오 시간 업데이트 이벤트 처리
  const handleTimeUpdate = () => {
    if (audioRef.value && !isDragging.value) {
      currentTimeRef.value = audioRef.value.currentTime;
      emit('timeUpdate', currentTimeRef.value, durationRef.value);
    }
  };

  // 오디오 로드 완료 이벤트 처리
  const handleLoadedMetadata = () => {
    if (audioRef.value) {
      durationRef.value = audioRef.value.duration;
    }
  };

  // prop 변경 시 오디오 상태 업데이트
  watch(
    () => props.isPlaying,
    isPlaying => {
      if (audioRef.value) {
        if (isPlaying) {
          audioRef.value
            .play()
            .catch(err => console.error('오디오 재생 실패:', err));
        } else {
          audioRef.value.pause();
        }
      }
    }
  );

  watch(
    () => props.isMuted,
    isMuted => {
      if (audioRef.value) {
        audioRef.value.muted = isMuted;
      }
    }
  );

  watch(
    () => props.volume,
    volume => {
      if (audioRef.value) {
        audioRef.value.volume = volume / 100;
      }
    }
  );

  watch(
    () => props.audioUrl,
    url => {
      if (audioRef.value && url) {
        audioRef.value.load();
        currentTimeRef.value = 0;
        durationRef.value = 0;
        if (props.isPlaying) {
          audioRef.value
            .play()
            .catch(err => console.error('오디오 재생 실패:', err));
        }
      }
    },
    { immediate: true }
  );

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  onMounted(() => {
    if (audioRef.value) {
      audioRef.value.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.value.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
  });

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDragging);

    if (audioRef.value) {
      audioRef.value.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.value.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );
    }
  });
</script>

<template>
  <!-- 오디오 요소 추가 -->
  <audio
    ref="audioRef"
    style="display: none"
    @ended="emit('togglePlay')"
    @timeupdate="handleTimeUpdate"
    @loadedmetadata="handleLoadedMetadata"
  >
    <source v-if="audioUrl" :src="audioUrl" type="audio/mpeg" />
    브라우저가 오디오 재생을 지원하지 않습니다.
  </audio>

  <div class="mt-4 bg-gray-200/20 dark:bg-gray-700/20 p-4 rounded-md">
    <div class="mb-2">
      <!-- 시크바(진행바) -->
      <div
        ref="seekBarRef"
        class="h-12 bg-gray-300/30 dark:bg-gray-600/30 rounded-md mb-2 relative overflow-hidden cursor-pointer"
        @click="handleSeekBarClick"
      >
        <!-- 배경 이미지 (사용하지 않음) -->
        <div class="absolute inset-0"></div>

        <!-- 진행바 -->
        <div
          class="absolute bottom-0 left-0 h-full bg-amber-500/30 dark:bg-amber-600/30 transition-all duration-300 ease-linear transform"
          :style="{ width: `${progressPercentage}%` }"
        ></div>

        <!-- 시크 포인터 -->
        <div
          class="absolute top-0 h-full transition-all duration-300 ease-linear transform"
          :style="{ left: `${progressPercentage}%` }"
          @mousedown="startDragging"
        >
          <div
            class="w-2 h-12 bg-amber-500 dark:bg-amber-600 rounded-full opacity-70 hover:opacity-100 cursor-grab active:cursor-grabbing"
          ></div>
        </div>
      </div>

      <!-- 컨트롤 -->
      <div class="flex justify-between items-center">
        <!-- 재생/일시정지 버튼 -->
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

        <!-- 볼륨 컨트롤 -->
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

        <!-- 시간 표시 -->
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ displayCurrentTime }} / {{ displayTotalTime }}
        </div>
      </div>
    </div>

    <!-- 페이지 네비게이션 -->
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
