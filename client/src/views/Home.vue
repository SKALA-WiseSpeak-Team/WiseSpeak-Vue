<script setup lang="ts">
  import {
    reactive,
    onMounted,
    onBeforeUnmount,
    ref,
    watch,
    computed
  } from 'vue';
  import {
    useVisibilityObserver,
    useElementsVisibilityObserver,
    useParallaxEffect
  } from '../composables/useIntersectionObserver';
  import { useI18n } from '../i18n'; // i18n 훅 가져오기

  import PdfThumbnail from '../components/common/PdfThumbnail.vue';
  import { getLectures, type Lecture } from '../services/getLectures';

  // i18n 설정
  const { t, currentLanguage } = useI18n();

  // 섹션별 가시성
  const { targetRef: heroRef, isVisible: heroVisible } =
    useVisibilityObserver<HTMLElement>();
  const { targetRef: featuresRef, isVisible: featuresVisible } =
    useVisibilityObserver<HTMLElement>();
  const { targetRef: lecturesRef, isVisible: lecturesVisible } =
    useVisibilityObserver<HTMLElement>();
  const { targetRef: ctaRef, isVisible: ctaVisible } =
    useVisibilityObserver<HTMLElement>();

  // 특징 아이템 가시성
  const {
    setElementRef: setFeatureItemRef,
    visibleState: featureItemsVisible
  } = useElementsVisibilityObserver({ delay: 150 });

  // 강의 아이템 가시성
  const {
    setElementRef: setLectureItemRef,
    visibleState: lectureItemsVisible
  } = useElementsVisibilityObserver({ delay: 150 });

  // 패럴랙스 효과
  const { setupParallax } = useParallaxEffect();

  const allLectures = ref<Lecture[]>([]);
  const featuredLectures = ref<Lecture[]>([]);
  const showAll = ref(false);

  onMounted(async () => {
    const response = await getLectures();
    allLectures.value = response.data;
    featuredLectures.value = allLectures.value.slice(0, 3);
    console.log(featuredLectures);
  });

  const handleThumbnailLoaded = (id: string) => {
    console.log(`Thumbnail loaded for lecture ${id}`);
  };

  const handleThumbnailError = (id: string) => {
    console.error(`Failed to load thumbnail for lecture ${id}`);
  };

  onMounted(() => {
    // 페이지 로드시 기본적으로 히어로 섹션은 보이도록 설정
    if (!heroVisible.value) {
      setTimeout(() => {
        heroVisible.value = true;
      }, 100);
    }

    // 패럴랙스 효과 설정
    const cleanup = setupParallax();

    // 컴포넌트가 언마운트될 때 정리
    onBeforeUnmount(cleanup);
  });

  // 날짜 형식 변환 함수
  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 언어에 따라 다른 날짜 형식 반환
    switch (currentLanguage.value) {
      case 'ko':
        return `${year}년 ${month}월 ${day}일`;
      case 'ja':
        return `${year}年 ${month}月 ${day}日`;
      case 'zh':
        return `${year}年 ${month}月 ${day}日`;
      case 'fr':
        return `${day}/${month}/${year}`;
      case 'de':
        return `${day}.${month}.${year}`;
      default:
        return `${month}/${day}/${year}`;
    }
  }
</script>

<template>
  <!-- 히어로 섹션 -->
  <section
    ref="heroRef"
    class="relative py-20 md:py-32 overflow-hidden"
    :class="{ 'animate-hero': heroVisible }"
  >
    <div
      class="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 parallax-bg"
      data-speed="0.15"
    ></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl mx-auto text-center">
        <div
          class="flex justify-center mb-6 transition-transform duration-1000 transform"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible
          }"
        >
          <img
            src="/logo.svg"
            alt="WiseSpeak Logo"
            width="80"
            height="80"
            class="rounded-md animate-float"
          />
        </div>
        <h1
          class="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white transition-all duration-1000 delay-300"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible
          }"
        >
          {{ t('home.hero.title') }}
        </h1>
        <p
          class="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 transition-all duration-1000 delay-500"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible
          }"
        >
          {{ t('home.hero.description') }}
        </p>
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible
          }"
        >
          <a
            href="/gallery"
            class="bg-gradient-to-b from-indigo-500 to-indigo-600/80 text-white uppercase tracking-wider px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:from-indigo-500/90 hover:to-indigo-600/70 active:translate-y-0.5 active:shadow-sm animate-pulse-slow"
          >
            {{ t('home.hero.findLecture') }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
          <a
            href="/create"
            class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
          >
            {{ t('home.hero.createLecture') }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 특징 섹션 -->
  <section
    ref="featuresRef"
    class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/30 overflow-hidden"
    :class="{ 'animate-reveal': featuresVisible }"
  >
    <div class="container mx-auto px-4">
      <div
        class="text-center mb-16 transition-all duration-1000"
        :class="{
          'translate-y-0 opacity-100': featuresVisible,
          'translate-y-20 opacity-0': !featuresVisible
        }"
      >
        <h2
          class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          {{ t('home.features.title') }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('home.features.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 특징 1 -->
        <div
          :ref="el => setFeatureItemRef(el, 0)"
          class="transition-all duration-700"
          :class="{
            'translate-y-0 opacity-100': featureItemsVisible[0],
            'translate-y-24 opacity-0': !featureItemsVisible[0]
          }"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full transform hover:scale-105 transition-all duration-500"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-bounce-slow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-indigo-500 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">
                {{ t('home.feature.upload.title') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                {{ t('home.feature.upload.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 특징 2 -->
        <div
          :ref="el => setFeatureItemRef(el, 1)"
          class="transition-all duration-700 delay-150"
          :class="{
            'translate-y-0 opacity-100': featureItemsVisible[1],
            'translate-y-24 opacity-0': !featureItemsVisible[1]
          }"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full transform hover:scale-105 transition-all duration-500"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-pulse-slow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-indigo-500 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">
                {{ t('home.feature.analyze.title') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                {{ t('home.feature.analyze.description') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 특징 3 -->
        <div
          :ref="el => setFeatureItemRef(el, 2)"
          class="transition-all duration-700 delay-300"
          :class="{
            'translate-y-0 opacity-100': featureItemsVisible[2],
            'translate-y-24 opacity-0': !featureItemsVisible[2]
          }"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full transform hover:scale-105 transition-all duration-500"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-spin-slow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-indigo-500 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">
                {{ t('home.feature.generate.title') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                {{ t('home.feature.generate.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 추천 강의 섹션 -->
  <section
    ref="lecturesRef"
    class="py-16 md:py-24 bg-white dark:bg-gray-900 overflow-hidden"
  >
    <div class="container mx-auto px-4">
      <div
        class="text-center mb-16 transition-all duration-1000"
        :class="{
          'translate-y-0 opacity-100': lecturesVisible,
          'translate-y-20 opacity-0': !lecturesVisible
        }"
      >
        <h2
          class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          {{ t('home.lectures.title') }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('home.lectures.description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(lecture, index) in showAll ? allLectures : featuredLectures"
          :key="lecture.id"
        >
          <a :href="`/lecture/${lecture.id}`" class="block">
            <div
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105"
            >
              <div class="aspect-[4/3] relative overflow-hidden">
                <!-- PDF 썸네일 -->
                <PdfThumbnail
                  v-if="lecture.pdf_url"
                  :pdfUrl="lecture.pdf_url"
                  :page-number="1"
                  :width="400"
                  :height="192"
                  @loaded="handleThumbnailLoaded(lecture.id)"
                  @error="handleThumbnailError(lecture.id)"
                />
                <!-- Fallback if pdf_url is not available -->
                <div
                  v-else
                  class="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                >
                  <div class="flex items-center text-white gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span class="text-xs">{{
                      t('home.lectures.interactive')
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="pt-6 px-6 pb-6">
                <h3 class="text-xl font-semibold mb-2">
                  {{ lecture.title }}
                </h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {{ lecture.description }}
                </p>
                <div
                  class="flex justify-between text-xs text-gray-500 dark:text-gray-400"
                >
                  <span
                    >{{ lecture.total_pages }}
                    {{ t('home.lectures.pages') }}</span
                  >
                  <span>{{ formatDate(lecture.created_at) }}</span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div
        class="text-center mt-12 transition-all duration-1000 delay-500"
        :class="{
          'translate-y-0 opacity-100': lecturesVisible,
          'translate-y-10 opacity-0': !lecturesVisible
        }"
      >
        <a
          href="/gallery"
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-transform duration-300"
        >
          {{ t('home.lectures.viewAll') }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  </section>

  <!-- CTA 섹션 -->
  <section
    ref="ctaRef"
    class="py-16 md:py-24 bg-indigo-600 dark:bg-indigo-800 text-white relative overflow-hidden"
  >
    <!-- 배경 애니메이션 효과 -->
    <div class="absolute inset-0">
      <div v-if="ctaVisible" class="absolute inset-0">
        <div v-for="i in 10" :key="i" class="floating-bubble"></div>
      </div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div
        class="max-w-3xl mx-auto text-center transform transition-all duration-1000"
        :class="{
          'translate-y-0 opacity-100': ctaVisible,
          'translate-y-24 opacity-0': !ctaVisible
        }"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-lg md:text-xl mb-8 text-indigo-100 dark:text-indigo-200">
          {{ t('home.cta.description') }}
        </p>
        <a
          href="/create"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:scale-105 animate-pulse-slow"
        >
          {{ t('home.cta.button') }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 로고 애니메이션 */
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-10px);
    }
    100% {
      transform: translatey(0px);
    }
  }

  /* 히어로 애니메이션 */
  .animate-hero {
    animation: fadeIn 1.2s ease-in-out;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  /* 느린 펄스 애니메이션 */
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* 느린 바운스 애니메이션 */
  .animate-bounce-slow {
    animation: bounce 5s infinite;
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

  /* 느린 회전 애니메이션 */
  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* 나타나는 효과 애니메이션 */
  .animate-reveal {
    animation: reveal 0.8s ease-out;
  }

  @keyframes reveal {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 배경 부유 버블 */
  .floating-bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }

  .floating-bubble:nth-child(1) {
    width: 100px;
    height: 100px;
    left: 10%;
    top: 20%;
    animation: float-bubble 15s linear infinite;
  }

  .floating-bubble:nth-child(2) {
    width: 150px;
    height: 150px;
    right: 20%;
    top: 40%;
    animation: float-bubble 25s linear infinite;
    animation-delay: -5s;
  }

  .floating-bubble:nth-child(3) {
    width: 80px;
    height: 80px;
    left: 30%;
    bottom: 30%;
    animation: float-bubble 20s linear infinite;
    animation-delay: -10s;
  }

  .floating-bubble:nth-child(4) {
    width: 120px;
    height: 120px;
    right: 15%;
    bottom: 20%;
    animation: float-bubble 18s linear infinite;
    animation-delay: -2s;
  }

  .floating-bubble:nth-child(5) {
    width: 60px;
    height: 60px;
    left: 50%;
    top: 10%;
    animation: float-bubble 12s linear infinite;
    animation-delay: -7s;
  }

  .floating-bubble:nth-child(6) {
    width: 200px;
    height: 200px;
    right: 5%;
    top: 5%;
    animation: float-bubble 30s linear infinite;
    animation-delay: -15s;
  }

  .floating-bubble:nth-child(7) {
    width: 70px;
    height: 70px;
    left: 15%;
    bottom: 15%;
    animation: float-bubble 22s linear infinite;
    animation-delay: -3s;
  }

  .floating-bubble:nth-child(8) {
    width: 90px;
    height: 90px;
    right: 30%;
    bottom: 10%;
    animation: float-bubble 16s linear infinite;
    animation-delay: -8s;
  }

  .floating-bubble:nth-child(9) {
    width: 110px;
    height: 110px;
    left: 45%;
    bottom: 40%;
    animation: float-bubble 24s linear infinite;
    animation-delay: -12s;
  }

  .floating-bubble:nth-child(10) {
    width: 50px;
    height: 50px;
    right: 40%;
    top: 30%;
    animation: float-bubble 14s linear infinite;
    animation-delay: -6s;
  }

  @keyframes float-bubble {
    0% {
      transform: translateY(0) translateX(0) scale(1) rotate(0);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-300px) translateX(100px) scale(1.5) rotate(360deg);
      opacity: 0;
    }
  }
</style>
