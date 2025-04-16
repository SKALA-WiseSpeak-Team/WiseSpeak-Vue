<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import {
    useVisibilityObserver,
    useElementsVisibilityObserver
  } from '../composables/useIntersectionObserver';

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

  const images = [
    {
      id: 1,
      title: '이미지 1',
      description: '아름다운 풍경',
      url: 'https://picsum.photos/800/600?random=1',
      createdAt: '2024-04-10',
      pageCount: 24
    },
    {
      id: 2,
      title: '이미지 2',
      description: '도시의 밤',
      url: 'https://picsum.photos/800/600?random=2',
      createdAt: '2024-04-12',
      pageCount: 18
    },
    {
      id: 3,
      title: '이미지 3',
      description: '자연의 아름다움',
      url: 'https://picsum.photos/800/600?random=3',
      createdAt: '2024-03-25',
      pageCount: 32
    },
    {
      id: 4,
      title: '이미지 4',
      description: '현대적인 건축물',
      url: 'https://picsum.photos/800/600?random=4',
      createdAt: '2024-04-05',
      pageCount: 15
    },
    {
      id: 5,
      title: '이미지 5',
      description: '평화로운 순간',
      url: 'https://picsum.photos/800/600?random=5',
      createdAt: '2024-03-20',
      pageCount: 28
    },
    {
      id: 6,
      title: '이미지 6',
      description: '도시의 활기',
      url: 'https://picsum.photos/800/600?random=6',
      createdAt: '2024-04-15',
      pageCount: 22
    }
  ];

  const searchQuery = ref<string>('');
  const sortOption = ref<string>('newest'); // 기본 정렬은 최신순
  const isDropdownOpen = ref(false); // 드롭다운 열림 상태 관리

  const sortOptions = [
    { value: 'newest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'mostPages', label: '페이지 많은순' },
    { value: 'leastPages', label: '페이지 적은순' }
  ];

  const currentSortLabel = computed(() => {
    return (
      sortOptions.find(option => option.value === sortOption.value)?.label ||
      '정렬'
    );
  });

  const filteredImages = computed(() => {
    let result = [...images];

    // 검색 필터링
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        image =>
          image.title.toLowerCase().includes(query) ||
          image.description.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortOption.value) {
      case 'newest':
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'mostPages':
        return result.sort((a, b) => b.pageCount - a.pageCount);
      case 'leastPages':
        return result.sort((a, b) => a.pageCount - b.pageCount);
      default:
        return result;
    }
  });

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

  onMounted(() => {
    // 페이지 로드 시 헤더는 바로 표시
    setTimeout(() => {
      headerVisible.value = true;
    }, 100);
  });

  // 드롭다운 위치 계산 함수 추가
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
          강의 갤러리
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
              placeholder="강의 검색..."
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

      <!-- 검색 결과 없음 메시지 -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 transform translate-y-8"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform translate-y-8"
      >
        <div
          v-if="filteredImages.length === 0"
          class="text-center py-20 flex flex-col items-center justify-center border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
        >
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
            검색 결과가 없습니다.
          </p>
          <p class="text-gray-500 dark:text-gray-500 mt-2">
            다른 검색어로 시도해보세요.
          </p>
        </div>
      </Transition>

      <!-- 이미지 그리드 -->
      <!-- 이미지 그리드 부분 수정 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="(image, index) in filteredImages"
          :key="image.id"
          :to="`/lecture/${image.id}`"
          class="block"
        >
          <div
            :ref="el => setCardRef(el, index)"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 cursor-pointer"
            :class="{
              'opacity-100 translate-y-0': cardVisible[index],
              'opacity-0 translate-y-16': !cardVisible[index]
            }"
          >
            <div class="h-48 overflow-hidden">
              <img
                :src="image.url"
                :alt="image.title"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div class="p-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ image.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-3">
                {{ image.description }}
              </p>
              <div
                class="flex justify-between text-sm text-gray-500 dark:text-gray-400"
              >
                <span>{{ image.createdAt }}</span>
                <span>{{ image.pageCount }}페이지</span>
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
</style>
