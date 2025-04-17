<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { getLectureGallery } from '../services/getLectureGallery';
  import {
    useVisibilityObserver,
    useElementsVisibilityObserver
  } from '../composables/useIntersectionObserver';
  import { useI18n } from '../i18n'; // i18n 훅 가져오기

  import LazyPdfThumbnail from '../components/common/LazyPdfThumbnail.vue';
  import PdfThumbnail from '../components/common/PdfThumbnail.vue';

  // i18n 설정
  const { t, currentLanguage } = useI18n();

  // API 응답 타입 정의
  interface Lecture {
    id: string;
    title: string;
    description: string;
    created_at: string;
    total_pages: number;
    pdf_url: string;
  }

  // 타이틀 섹션 애니메이션
  const { targetRef: headerRef, isVisible: headerVisible } =
    useVisibilityObserver<HTMLElement>();

  // 검색바 애니메이션
  const { targetRef: searchbarRef, isVisible: searchbarVisible } =
    useVisibilityObserver<HTMLElement>();

  // 이미지 카드 애니메이션
  const { setElementRef: setCardRef, visibleState: cardVisible } =
    useElementsVisibilityObserver({
      threshold: 0.1,
      delay: 120 // 카드별 애니메이션 지연 시간(ms)
    });

  // 강의 데이터 상태
  const lectures = ref<Lecture[]>([]);
  const isLoading = ref(true);
  const loadError = ref<string | null>(null);

  // 검색 및 정렬 상태
  const searchQuery = ref<string>('');
  const sortOption = ref<string>('newest'); // 기본 정렬은 최신순
  const isDropdownOpen = ref(false); // 드롭다운 열림 상태 관리

  const sortOptions = computed(() => [
    { value: 'newest', label: t('gallery.sort.newest') },
    { value: 'oldest', label: t('gallery.sort.oldest') },
    { value: 'mostPages', label: t('gallery.sort.mostPages') },
    { value: 'leastPages', label: t('gallery.sort.leastPages') }
  ]);

  const currentSortLabel = computed(() => {
    return (
      sortOptions.value.find(option => option.value === sortOption.value)
        ?.label || t('gallery.sort.newest')
    );
  });

  // 강의 데이터 로딩
  const loadLectures = async () => {
    try {
      isLoading.value = true;
      loadError.value = null;

      // API 호출
      const response = await getLectureGallery();

      // 응답이 { data: [] } 형태인 경우
      if (response && response.data && Array.isArray(response.data)) {
        lectures.value = response.data;
      }
      // 응답이 직접 배열인 경우
      else if (Array.isArray(response)) {
        lectures.value = response;
      }
      // 그 외의 경우 빈 배열로 처리
      else {
        console.warn('API 응답 형식이 예상과 다릅니다:', response);
        lectures.value = [];
      }
    } catch (error) {
      console.error('강의 데이터 로딩 중 오류 발생:', error);
      loadError.value = t('gallery.error');
      lectures.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // 검색 및 정렬 적용된 강의 목록
  const filteredLectures = computed(() => {
    // API 응답이 { data: [] } 형태로 오는 경우 처리
    let lecturesArray = [];

    if (lectures.value && Array.isArray(lectures.value)) {
      lecturesArray = lectures.value;
    } else if (
      lectures.value &&
      lectures.value.data &&
      Array.isArray(lectures.value.data)
    ) {
      lecturesArray = lectures.value.data;
    } else {
      return [];
    }

    let result = [...lecturesArray];

    // 검색 필터링
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        lecture =>
          lecture.title.toLowerCase().includes(query) ||
          lecture.description.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortOption.value) {
      case 'newest':
        return result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'mostPages':
        return result.sort((a, b) => b.total_pages - a.total_pages);
      case 'leastPages':
        return result.sort((a, b) => a.total_pages - b.total_pages);
      default:
        return result;
    }
  });

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);

    // 언어에 따라 다른 날짜 형식 사용
    const locale =
      {
        ko: 'ko-KR',
        en: 'en-US',
        zh: 'zh-CN',
        ja: 'ja-JP',
        fr: 'fr-FR',
        de: 'de-DE'
      }[currentLanguage.value] || 'ko-KR';

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleSortChange = (option: string) => {
    sortOption.value = option;
    isDropdownOpen.value = false;
  };

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  // 드롭다운 외부 클릭 시 닫기
  const closeDropdown = (event: MouseEvent) => {
    const dropdown = document.getElementById('sort-dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      isDropdownOpen.value = false;
    }
  };

  // 드롭다운 위치 계산 함수
  const getDropdownPosition = () => {
    const dropdown = document.getElementById('sort-dropdown');
    if (!dropdown) return {};

    const rect = dropdown.getBoundingClientRect();
    return {
      top: `${rect.bottom + window.scrollY}px`,
      right: `${window.innerWidth - rect.right}px`,
      width: '12rem'
    };
  };

  // 썸네일 상태 관리
  const thumbnailStates = ref<{
    [key: string]: 'loading' | 'loaded' | 'error';
  }>({});

  // 썸네일 로딩 완료 핸들러
  const handleThumbnailLoaded = (lectureId: string) => {
    thumbnailStates.value[lectureId] = 'loaded';
  };

  // 썸네일 로딩 오류 핸들러
  const handleThumbnailError = (lectureId: string) => {
    thumbnailStates.value[lectureId] = 'error';
  };

  // 카드 가시성을 직접 설정하는 함수 추가
  const makeCardsVisible = () => {
    // cardVisible의 모든 키에 true 값 할당
    for (let i = 0; i < filteredLectures.value.length; i++) {
      cardVisible[i] = true;
    }
  };

  onMounted(() => {
    // 페이지 로드 시 헤더는 바로 표시
    setTimeout(() => {
      headerVisible.value = true;
    }, 100);

    // 강의 데이터 로드
    loadLectures().then(() => {
      setTimeout(() => {
        makeCardsVisible();
      }, 300); // 약간의 지연 추가
    });
  });

  // 데이터가 변경될 때마다 카드 표시
  watch(filteredLectures, () => {
    setTimeout(() => {
      makeCardsVisible();
    }, 300);
  });
</script>

<template>
  <div
    class="py-12 bg-gray-100 dark:bg-gray-900 min-h-screen"
    @click="closeDropdown"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref="headerRef"
        class="text-center mb-8 transition-all duration-700"
        :class="{
          'translate-y-0 opacity-100': headerVisible,
          'translate-y-10 opacity-0': !headerVisible
        }"
      >
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('gallery.title') }}
        </h1>

        <!-- 검색 및 정렬 섹션 -->
        <div
          ref="searchbarRef"
          class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 mb-8 transition-all duration-700"
          :class="{
            'translate-y-0 opacity-100': headerVisible,
            'translate-y-10 opacity-0': !headerVisible
          }"
          style="transition-delay: 200ms"
        >
          <!-- 검색바 -->
          <div class="relative w-full md:w-2/3">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="t('gallery.search.placeholder')"
            />
          </div>

          <!-- 드롭다운 버튼 -->
          <div class="relative w-full md:w-auto" id="sort-dropdown">
            <button
              @click.stop="toggleDropdown"
              class="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{{ currentSortLabel }}</span>
              <svg
                class="w-5 h-5 transition-transform duration-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                :class="{ 'transform rotate-180': isDropdownOpen }"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Teleport를 사용해 드롭다운을 body 끝으로 이동 -->
            <Teleport to="body">
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 transform scale-95"
                enter-to-class="opacity-100 transform scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 transform scale-100"
                leave-to-class="opacity-0 transform scale-95"
              >
                <div
                  v-if="isDropdownOpen"
                  class="dropdown-menu fixed bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden"
                  style="z-index: 9999"
                  :style="getDropdownPosition()"
                >
                  <div class="py-1">
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      @click.stop="handleSortChange(option.value)"
                      class="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                      :class="{
                        'bg-blue-50 dark:bg-blue-900':
                          option.value === sortOption.value
                      }"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>
      </div>

      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="text-center py-16">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('gallery.loading') }}
        </p>
      </div>

      <!-- 오류 메시지 표시 -->
      <div
        v-else-if="loadError"
        class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-red-500 mx-auto mb-4"
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
        <p class="text-gray-700 dark:text-gray-300 text-lg mb-4">
          {{ loadError }}
        </p>
        <button
          @click="loadLectures"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ t('gallery.retry') }}
        </button>
      </div>

      <!-- 검색 결과 없음 메시지 -->
      <div
        v-else-if="filteredLectures.length === 0"
        class="text-center py-20 flex flex-col items-center justify-center border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 transform translate-y-8"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-8"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 animate-bounce-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.879 7.121A3 3 0 1013 4a3 3 0 00-3.121 3.121M3 12h.001M21 12h.01M12 3v.01M21 21l-6-6m-9 3h4a3 3 0 003-3V9a3 3 0 00-3-3H6a3 3 0 00-3 3v6a3 3 0 003 3z"
              />
            </svg>
            <p class="text-gray-600 dark:text-gray-400 text-lg">
              {{ t('gallery.noResults') }}
            </p>
            <p class="text-gray-500 dark:text-gray-500 mt-2">
              {{ t('gallery.tryAgain') }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- 강의 카드 그리드 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="(lecture, index) in filteredLectures"
          :key="lecture.id"
          :to="`/lecture/${lecture.id}`"
          class="block"
        >
          <div
            :ref="el => setCardRef(el, index)"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 cursor-pointer"
            :class="{
              'opacity-100 translate-y-0': true,
              'opacity-0 translate-y-16': false
            }"
          >
            <div class="h-48 overflow-hidden relative">
              <!-- PDF 썸네일로 대체 -->
              <PdfThumbnail
                v-if="lecture.pdf_url"
                :pdfUrl="lecture.pdf_url"
                :page-number="1"
                :width="400"
                :height="192"
                @loaded="handleThumbnailLoaded(lecture.id)"
                @error="handleThumbnailError(lecture.id)"
              />
            </div>
            <div class="p-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ lecture.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-3">
                {{ lecture.description }}
              </p>
              <div
                class="flex justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ formatDate(lecture.created_at) }}</span>
                <span>{{ lecture.total_pages }} {{ t('gallery.pages') }}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* 기존 스타일 유지 */

  /* 드롭다운 관련 스타일 */
  #sort-dropdown {
    position: relative;
    z-index: 100; /* 증가된 z-index 값 */
  }

  /* 드롭다운 메뉴에 더 강력한 스타일 적용 */
  #sort-dropdown .absolute {
    z-index: 9999 !important; /* 최우선 z-index 적용 */
    position: fixed; /* fixed 포지션으로 변경 */
    transform-origin: top right;
    width: 12rem; /* 너비 설정 */
  }

  /* 검색 및 정렬 섹션 컨테이너에도 높은 z-index 적용 */
  .flex.flex-col.md\:flex-row {
    position: relative;
    z-index: 100;
  }

  /* 그리드 요소들은 낮은 z-index 적용 */
  .grid {
    position: relative;
    z-index: 1; /* 더 낮은 z-index 적용 */
  }

  .grid > div {
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    z-index: 1;
  }

  /* 애니메이션 효과 */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 느린 바운스 애니메이션 */
  .animate-bounce-slow {
    animation: bounce 3s infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-5%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }

  /* 카드 호버 효과 */
  .grid > div {
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }
  .grid > div:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* 로딩 애니메이션 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
