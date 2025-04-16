<script setup lang="ts">
  import { ref, onMounted, computed, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  interface Lecture {
    title: string;
    description: string;
    pages: number;
    date: Date;
    instructor: string;
    level: string;
    duration: string;
  }

  // 인덱스 시그니처를 사용하여 문자열 키를 가진 객체 타입 정의
  interface LectureMap {
    [key: string]: Lecture;
  }

  const route = useRoute();
  const router = useRouter();
  const id = route.params.id as string;

  // 목업 데이터에 타입 적용
  const mockLectures: LectureMap = {
    '1': {
      title: '고대 로마 건축의 비밀',
      description: '고대 로마의 건축 기술과 공학적 경이로움을 탐구합니다',
      pages: 10,
      date: new Date(2025, 3, 10),
      instructor: '김강사',
      level: '중급',
      duration: '2시간 30분'
    },
    '2': {
      title: '현대 물리학의 이해',
      description: '양자역학과 상대성 이론의 이해',
      pages: 15,
      date: new Date(2025, 2, 15),
      instructor: '이교수',
      level: '고급',
      duration: '3시간 15분'
    },
    '3': {
      title: '철학의 기초',
      description: '기본적인 철학 개념과 사상가들',
      pages: 12,
      date: new Date(2025, 1, 20),
      instructor: '박박사',
      level: '초급',
      duration: '1시간 45분'
    }
  };

  // 강의 정보
  const lecture = ref(mockLectures[id] || null);

  // 상태 변수들
  const notFound = ref(!lecture.value);
  const currentPage = ref(1);
  const isPlaying = ref(false);
  const volume = ref(80);
  const isMuted = ref(false);
  const isFullscreen = ref(false);
  const zoomLevel = ref(100);
  const chatInput = ref('');
  const isLoading = ref(false);
  const showChat = ref(true);
  const isRecording = ref(false);
  const isListening = ref(false);
  const progress = ref(35); // 기존 코드에서 유지

  // 초기 메시지
  const messages = ref([
    {
      id: 1,
      role: 'system',
      content:
        '강의에 대해 질문해 주세요. 음성으로 질문하시려면 마이크 버튼을 누르세요.'
    }
  ]);

  // 레퍼런스
  const pdfContainerRef = ref(null);
  const chatContainerRef = ref(null);

  // 번역 함수 (실제로는 i18n 라이브러리 사용)
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'lecture.page': '페이지',
      'lecture.of': '/',
      'lecture.previousPage': '이전 페이지',
      'lecture.nextPage': '다음 페이지',
      'lecture.reset': '초기화',
      'lecture.hideChat': '채팅 숨기기',
      'lecture.showChat': '채팅 보기',
      'lecture.askQuestions': '질문하기',
      'lecture.askPlaceholder': '질문을 입력하세요...',
      'lecture.reference': '참고 페이지:',
      'lecture.sampleContent':
        '{page}페이지 콘텐츠 샘플입니다. 실제 내용이 여기에 표시됩니다.',
      'lecture.notFound': '강의를 찾을 수 없습니다',
      'lecture.notFoundDesc': '요청하신 강의가 존재하지 않거나 삭제되었습니다.',
      'gallery.title': '강의 갤러리'
    };
    return translations[key] || key;
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
      isPlaying.value = true;
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (lecture.value && currentPage.value < lecture.value.pages) {
      currentPage.value += 1;
      isPlaying.value = true;
    }
  };

  // 재생/일시정지 토글
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
  };

  // 음소거 토글
  const toggleMute = () => {
    isMuted.value = !isMuted.value;
  };

  // 전체화면 토글
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;

    if (isFullscreen.value) {
      if (pdfContainerRef.value?.requestFullscreen) {
        pdfContainerRef.value.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 확대
  const handleZoomIn = () => {
    if (zoomLevel.value < 200) {
      zoomLevel.value += 25;
    }
  };

  // 축소
  const handleZoomOut = () => {
    if (zoomLevel.value > 50) {
      zoomLevel.value -= 25;
    }
  };

  // 확대/축소 초기화
  const handleResetZoom = () => {
    zoomLevel.value = 100;
  };

  // 메시지 전송
  const handleSendMessage = (e: Event) => {
    e.preventDefault();
    if (!chatInput.value.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: messages.value.length + 1,
      role: 'user',
      content: chatInput.value
    };
    messages.value.push(userMessage);
    chatInput.value = '';

    // AI 응답 시뮬레이션
    isLoading.value = true;
    setTimeout(() => {
      if (lecture.value) {
        const aiMessage = {
          id: messages.value.length + 1,
          role: 'assistant',
          content: `"${userMessage.content}"에 대한 답변입니다. 관련 정보는 ${Math.min(
            currentPage.value + 1,
            lecture.value.pages
          )}페이지에서 확인할 수 있습니다.`,
          references: [Math.min(currentPage.value + 1, lecture.value.pages)]
        };
        messages.value.push(aiMessage);
      }
      isLoading.value = false;
    }, 1500);
  };

  // 녹음 토글
  const toggleRecording = () => {
    if (isRecording.value) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 녹음 시작
  const startRecording = () => {
    isRecording.value = true;
    // 실제 구현에서는 음성 인식 API를 사용하여 음성을 텍스트로 변환
    setTimeout(() => {
      isListening.value = true;
      // 3초 후 음성 인식이 완료되었다고 가정
      setTimeout(() => {
        const recognizedText = '이 강의의 핵심 개념을 설명해주세요';
        chatInput.value = recognizedText;
        isRecording.value = false;
        isListening.value = false;

        // 자동으로 메시지 전송
        const userMessage = {
          id: messages.value.length + 1,
          role: 'user',
          content: recognizedText
        };
        messages.value.push(userMessage);

        // AI 응답 시뮬레이션
        isLoading.value = true;
        setTimeout(() => {
          if (lecture.value) {
            const aiMessage = {
              id: messages.value.length + 1,
              role: 'assistant',
              content: `이 강의의 핵심 개념은 ${lecture.value.title}에 관한 것입니다. ${lecture.value.description}에 대해 다루고 있으며, 특히 ${currentPage.value}페이지에서 중요한 내용을 확인할 수 있습니다.`,
              references: [currentPage.value]
            };
            messages.value.push(aiMessage);
          }
          isLoading.value = false;

          // 음성으로 응답 재생 (실제로는 TTS API를 사용)
          speakResponse(aiMessage.content);
        }, 1500);
      }, 3000);
    }, 500);
  };

  // 녹음 중지
  const stopRecording = () => {
    isRecording.value = false;
    isListening.value = false;
  };

  // 텍스트를 음성으로 변환 (TTS)
  const speakResponse = (text: string) => {
    // 실제 구현에서는 TTS API를 사용하여 텍스트를 음성으로 변환
    console.log('Speaking:', text);
  };

  // 채팅 컨테이너 자동 스크롤
  watch(
    () => messages.value.length,
    () => {
      nextTick(() => {
        if (chatContainerRef.value) {
          chatContainerRef.value.scrollTop =
            chatContainerRef.value.scrollHeight;
        }
      });
    }
  );

  // 재생 시간 포맷팅
  const formattedCurrentTime = computed(() => {
    return isPlaying.value ? '00:45' : '00:00';
  });

  const formattedTotalTime = '03:21';

  // 페이지 로드 시 초기화
  onMounted(() => {
    if (!lecture.value) {
      notFound.value = true;
    }
  });
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- 찾을 수 없는 강의 표시 -->
    <div v-if="notFound" class="container py-16 text-center">
      <div class="mb-6 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto opacity-20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-4">{{ t('lecture.notFound') }}</h2>
      <p class="text-gray-500 mb-8">{{ t('lecture.notFoundDesc') }}</p>
      <router-link to="/gallery">
        <button
          class="bg-gradient-to-b from-blue-600 to-blue-700 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
        >
          {{ t('gallery.title') }}
        </button>
      </router-link>
    </div>

    <!-- 강의 콘텐츠 -->
    <div v-else class="container py-4 md:py-6">
      <!-- 상단 네비게이션 -->
      <div class="flex items-center mb-4">
        <button
          class="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
          @click="() => router.push('/gallery')"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ t('gallery.title') }}
        </button>
      </div>

      <!-- 강의 제목 및 설명 -->
      <div class="mb-4 transition-all transform">
        <h1
          class="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white"
        >
          {{ lecture.title }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ lecture.description }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-4">
        <!-- 메인 콘텐츠: PDF 뷰어 + 오디오 플레이어 -->
        <div
          class="relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden p-4 flex-1 transition-all transform"
        >
          <div
            class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500/20 via-amber-500/70 to-amber-500/20"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500/20 via-amber-500/70 to-amber-500/20"
          ></div>

          <!-- PDF 뷰어 상단 컨트롤 -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <button
                class="p-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                @click="handleZoomOut"
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
                @click="handleZoomIn"
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
                @click="handleResetZoom"
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
                {{ t('lecture.reset') }}
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="hidden lg:flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="() => (showChat = !showChat)"
              >
                {{ showChat ? t('lecture.hideChat') : t('lecture.showChat') }}
              </button>
              <button
                class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                @click="toggleFullscreen"
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
            ref="pdfContainerRef"
            class="relative bg-gray-200/30 dark:bg-gray-700/30 rounded-md overflow-hidden"
            style="height: calc(100vh - 300px)"
          >
            <div
              class="absolute inset-0 flex items-center justify-center transition-transform duration-300"
              :style="{
                transform: `scale(${zoomLevel / 100})`,
                backgroundImage: 'url(https://placehold.co/600x800)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center p-8 max-w-lg">
                  <h2
                    class="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
                  >
                    {{ lecture.title }} - {{ t('lecture.page') }}
                    {{ currentPage }}
                  </h2>
                  <p class="mb-4 text-gray-700 dark:text-gray-300">
                    {{
                      t('lecture.sampleContent').replace(
                        '{page}',
                        currentPage.toString()
                      )
                    }}
                  </p>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('lecture.page') }} {{ currentPage }}
                    {{ t('lecture.of') }} {{ lecture.pages }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 오디오 플레이어 -->
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
                >
                  >
                </div>
                <div
                  class="absolute bottom-0 left-0 h-full bg-amber-500/30 dark:bg-amber-600/30 transition-all"
                  :style="{ width: `${isPlaying ? 30 : 0}%` }"
                ></div>
              </div>

              <div class="flex justify-between items-center">
                <button
                  class="p-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  @click="togglePlay"
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
                    @click="toggleMute"
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
                      v-model="volume"
                      @input="isMuted && volume > 0 ? (isMuted = false) : null"
                      class="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formattedCurrentTime }} / {{ formattedTotalTime }}
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-2">
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  :max="lecture.pages"
                  v-model="currentPage"
                  class="w-16 text-center px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('lecture.of') }} {{ lecture.pages }}
                </span>
              </div>

              <div class="flex gap-2">
                <button
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  @click="handlePrevPage"
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
                  {{ t('lecture.previousPage') }}
                </button>

                <button
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  @click="handleNextPage"
                  :disabled="currentPage >= lecture.pages"
                >
                  {{ t('lecture.nextPage') }}
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
        </div>

        <!-- 채팅 인터페이스 -->
        <div v-if="showChat" class="lg:w-80 xl:w-96 transition-all transform">
          <div
            class="relative border-2 border-blue-600/30 dark:border-blue-500/30 rounded-md overflow-hidden h-full"
          >
            <div class="absolute top-0 left-0 w-full h-1 bg-amber-500/70"></div>
            <div
              class="absolute bottom-0 left-0 w-full h-1 bg-amber-500/70"
            ></div>
            <div class="pt-6 h-full flex flex-col p-4">
              <h3
                class="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
              >
                {{ t('lecture.askQuestions') }}
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
                  <div
                    v-for="message in messages"
                    :key="message.id"
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
                          message.role === 'assistant' && message.references
                        "
                        class="mt-2 text-xs text-gray-500 dark:text-gray-400"
                      >
                        <button
                          class="text-blue-600 dark:text-blue-400 hover:underline text-xs p-0"
                          @click="currentPage = message.references[0]"
                        >
                          {{ t('lecture.reference') }}
                          {{ message.references[0] }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 로딩 표시 -->
                  <div
                    v-if="isLoading"
                    key="loading"
                    class="flex justify-start mb-4"
                  >
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
                  <div
                    v-if="isListening"
                    key="listening"
                    class="flex justify-end mb-4"
                  >
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
                  @click="toggleRecording"
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
                    (!chatInput.trim() && !isRecording) ||
                    isLoading ||
                    isListening
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 채팅 메시지 애니메이션 */
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
