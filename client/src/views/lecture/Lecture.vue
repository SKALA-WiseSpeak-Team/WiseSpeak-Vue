<script setup lang="ts">
  import { ref, onMounted, computed, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { postChat } from '../../services/postChat';

  import VoiceSettingsModal from './_components/VoiceSettingModal.vue';
  import LoadingModal from './_components/LoadingModal.vue';
  import LectureHeader from './_components/LectureHeader.vue';
  import PDFViewer from './_components/PDFViewer.vue';
  import AudioPlayer from './_components/AudioPlayer.vue';
  import ChatInterface from './_components/ChatInterface.vue';

  import getLecture from '../../services/getLecture'; // Import the API service

  interface Lecture {
    id: string;
    title: string;
    description: string;
    created_at: Date;
    pdfUrl: string;
    audioUrl: string;
    // audioUrls: string[];
    pages: number; // Will need to be derived or fetched separately
  }

  const route = useRoute();
  const router = useRouter();
  const id = route.params.id as string;

  // 페이지 상태
  const isInitialized = ref(false);
  const isChatLoading = ref(false); // 채팅 로딩 상태 추적
  const isLoading = ref(false); // 전체 페이지 로딩 상태 유지
  const isSettingsModalOpen = ref(true);
  const loadingError = ref<string | null>(null);

  // 강의 정보
  const lecture = ref<Lecture | null>(null);

  // 선택된 설정 저장
  const voiceSettings = ref({
    tone: 'natural',
    language: 'ko_KR'
  });

  // 상태 변수들
  const notFound = ref(false);
  const currentPage = ref(1);
  const isPlaying = ref(false);
  const volume = ref(80);
  const isMuted = ref(false);
  const isFullscreen = ref(false);
  const zoomLevel = ref(100);
  const chatInput = ref('');
  const showChat = ref(true);
  const isRecording = ref(false);
  const isListening = ref(false);
  const progress = ref(35);

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

  const handleChatResponse = response => {
    // 응답 데이터로 AI 메시지 생성
    const aiMessage = {
      id: messages.value.length + 1,
      role: 'assistant',
      // response.answer 대신 response.chat_answer 사용
      content: response?.chat_answer || '응답을 받지 못했습니다.',
      references: response?.references || [] // API 응답에 참조 페이지 정보가 있다면 사용
    };

    messages.value.push(aiMessage);
  };

  // 설정 모달 닫기 처리
  const handleCloseSettingsModal = () => {
    if (!isInitialized.value) {
      router.push('/gallery');
    } else {
      isSettingsModalOpen.value = false;
    }
  };

  // 설정 확인 후 강의 초기화
  const handleSettingsConfirm = async (settings: {
    tone: string;
    language: string;
  }) => {
    voiceSettings.value = settings;
    isSettingsModalOpen.value = false;

    try {
      isLoading.value = true;
      loadingError.value = null;

      // API 호출하여 강의 데이터 가져오기
      const lectureData = await getLecture({
        id,
        voice_style: settings.tone,
        language: settings.language
      });

      // 강의 데이터 매핑
      lecture.value = {
        id: lectureData.id,
        title: lectureData.title,
        description: lectureData.description,
        created_at: new Date(lectureData.created_at),
        pdfUrl: lectureData.pdf_url,
        audioUrl: lectureData.voice_url,
        // audioUrls: [lectureData.voice_url], // API returns a single voice_url, wrapping in array
        pages: lectureData.total_pages,
        duration: '2시간 30분' // API doesn't provide this; using a default value (could be calculated)
      };

      isInitialized.value = true;
    } catch (error) {
      loadingError.value =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다';
      isSettingsModalOpen.value = true;
      notFound.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  // 로딩 에러 모달 닫기 처리
  const handleCloseErrorModal = () => {
    loadingError.value = null;
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
      // 전체화면 진입 로직
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      // 전체화면 종료 로직
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // 채팅 토글
  const toggleChat = () => {
    showChat.value = !showChat.value;
  };

  // 확대
  const handleZoomIn = () => {
    if (zoomLevel.value < 200) {
      zoomLevel.value += 10;
    }
  };

  // 축소
  const handleZoomOut = () => {
    if (zoomLevel.value > 50) {
      zoomLevel.value -= 10;
    }
  };

  // 확대/축소 초기화
  const handleResetZoom = () => {
    zoomLevel.value = 100;
  };

  // 메시지 전송 처리 - 텍스트 입력용
  const handleSendMessage = async (messageText, isVoiceInput = false) => {
    // 사용자 메시지 추가
    const userMessage = {
      id: messages.value.length + 1,
      role: 'user',
      content: messageText
    };
    messages.value.push(userMessage);

    // 음성 입력이 아닌 경우에만 API 호출 (음성 입력은 이미 useAudioRecorder에서 API 호출함)
    if (!isVoiceInput) {
      // 여기서 isLoading 대신 isChatLoading 사용
      isChatLoading.value = true;

      try {
        // API 호출
        const response = await postChat(
          lecture.value.id,
          messageText,
          voiceSettings.value.language,
          voiceSettings.value.tone
        );
        handleChatResponse(response);
      } catch (error) {
        console.error('채팅 API 오류:', error);
        const errorMessage = {
          id: messages.value.length + 1,
          role: 'assistant',
          content: '죄송합니다. 응답 생성 중 오류가 발생했습니다.'
        };
        messages.value.push(errorMessage);
      } finally {
        // 채팅 로딩 상태만 해제
        isChatLoading.value = false;
      }
    }
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
    setTimeout(() => {
      isListening.value = true;
      setTimeout(() => {
        const recognizedText = '이 강의의 핵심 개념을 설명해주세요';
        chatInput.value = recognizedText;
        isRecording.value = false;
        isListening.value = false;

        const userMessage = {
          id: messages.value.length + 1,
          role: 'user',
          content: recognizedText
        };
        messages.value.push(userMessage);

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
    if (!id) {
      notFound.value = true;
      isSettingsModalOpen.value = false;
    }
  });
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- 설정 모달 -->
    <VoiceSettingsModal
      :isOpen="isSettingsModalOpen"
      @close="handleCloseSettingsModal"
      @confirm="handleSettingsConfirm"
    />

    <!-- 로딩 모달 -->
    <LoadingModal
      :isOpen="isLoading && !isInitialized.value"
      type="loading"
      message="강의 준비 중..."
    />

    <!-- 오류 모달 -->
    <LoadingModal
      :isOpen="!!loadingError"
      type="error"
      message="오류가 발생했습니다"
      :errorMessage="loadingError || ''"
      @close="handleCloseErrorModal"
    />

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
      <h2 class="text-2xl font-bold mb-4"></h2>
      <p class="text-gray-500 mb-8"></p>
      <router-link to="/gallery">
        <button
          class="bg-gradient-to-b from-blue-600 to-blue-700 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg active:translate-y-0.5 active:shadow-sm"
        >
          강의 갤러리로 돌아가기
        </button>
      </router-link>
    </div>

    <!-- 강의 콘텐츠 -->
    <div v-else-if="isInitialized" class="container py-4 md:py-6">
      <!-- 강의 헤더 컴포넌트 -->
      <LectureHeader
        :title="lecture.title"
        :description="lecture.description"
        :voiceSettings="voiceSettings"
        @navigateToGallery="() => router.push('/gallery')"
        @openSettings="() => (isSettingsModalOpen = true)"
      />

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

          <!-- Lecture.vue 파일에 PDFViewer 컴포넌트 연결 -->
          <PDFViewer
            ref="pdfViewerRef"
            :currentPage="currentPage"
            :totalPages="lecture?.pages || 0"
            :zoomLevel="zoomLevel"
            :isFullscreen="isFullscreen"
            :title="lecture?.title || ''"
            :pdfUrl="lecture?.pdfUrl || ''"
            @zoomIn="handleZoomIn"
            @zoomOut="handleZoomOut"
            @resetZoom="handleResetZoom"
            @toggleFullscreen="toggleFullscreen"
            @toggleChat="toggleChat"
            @update:totalPages="pages => (lecture.pages = pages)"
          />

          <!-- 오디오 플레이어 컴포넌트 -->
          <AudioPlayer
            :currentPage="currentPage"
            :totalPages="lecture.pages"
            :isPlaying="isPlaying"
            :isMuted="isMuted"
            :volume="volume"
            :currentTime="formattedCurrentTime"
            :totalTime="formattedTotalTime"
            :audioUrl="lecture?.audioUrl || ''"
            @togglePlay="togglePlay"
            @toggleMute="toggleMute"
            @volumeChange="value => (volume = value)"
            @prevPage="handlePrevPage"
            @nextPage="handleNextPage"
            @pageChange="page => (currentPage = page)"
          />
        </div>

        <!-- 채팅 영역 -->
        <div v-if="showChat" class="...">
          <!-- 채팅 인터페이스 -->
          <ChatInterface
            :messages="messages"
            :isLoading="isChatLoading"
            :isListening="isListening"
            :lectureId="lecture?.id"
            :voiceSettings="voiceSettings"
            @sendMessage="handleSendMessage"
            @navigateToPage="page => (currentPage = page)"
            @chatResponse="handleChatResponse"
          />
        </div>
      </div>
    </div>

    <!-- 초기화 대기 메시지 -->
    <div v-else class="hidden"></div>
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
