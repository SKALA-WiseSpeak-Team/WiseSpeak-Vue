<script setup lang="ts">
  import { reactive, onMounted, onBeforeUnmount } from 'vue';
  import {
    useVisibilityObserver,
    useElementsVisibilityObserver,
    useParallaxEffect
  } from '../composables/useIntersectionObserver';

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

  // 샘플 강의 데이터
  const featuredLectures = reactive([
    {
      id: 1,
      title: '고대 로마 건축의 비밀',
      description: '고대 로마의 건축 기술과 공학적 경이로움을 탐구합니다'
    },
    {
      id: 2,
      title: '현대 물리학의 이해',
      description: '양자역학과 상대성 이론의 이해'
    },
    {
      id: 3,
      title: '철학의 기초',
      description: '기본적인 철학 개념과 사상가들'
    }
  ]);

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
          지식의 음성화,<br />
          대화로 학습하는 새로운 방식
        </h1>
        <p
          class="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 transition-all duration-1000 delay-500"
          :class="{
            'translate-y-0 opacity-100': heroVisible,
            'translate-y-10 opacity-0': !heroVisible
          }"
        >
          WiseSpeak은 PDF 문서를 AI 기반 챗봇이 지원하는 인터랙티브 오디오
          강의로 변환합니다.
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
            강의 찾기
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
            강의 만들기
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
          WiseSpeak 작동 방식
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          PDF 문서를 세 가지 간단한 단계로 인터랙티브 오디오 강의로 변환하세요
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
              <h3 class="text-xl font-semibold mb-2">PDF 업로드</h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                처리를 위해 PDF 문서를 안전한 플랫폼에 업로드하세요
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
              <h3 class="text-xl font-semibold mb-2">AI 분석</h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                AI가 문서의 각 페이지에서 핵심 정보를 분석하고 추출합니다
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
              <h3 class="text-xl font-semibold mb-2">오디오 생성</h3>
              <p class="text-gray-500 dark:text-gray-400 pb-6">
                선택한 음성으로 각 페이지에 대한 고품질 오디오 강의를 생성합니다
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
          추천 강의
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          사용자들이 만든 인기 강의를 탐색해보세요
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(lecture, index) in featuredLectures"
          :key="lecture.id"
          :ref="el => setLectureItemRef(el, index)"
          class="transition-all duration-700"
          :style="`transition-delay: ${index * 150}ms`"
          :class="{
            'translate-y-0 opacity-100': lectureItemsVisible[index],
            'translate-y-24 opacity-0': !lectureItemsVisible[index]
          }"
        >
          <a :href="`/lecture/${lecture.id}`" class="block">
            <div
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105"
            >
              <div class="aspect-[4/3] relative overflow-hidden">
                <div
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
                    <span class="text-xs">인터랙티브</span>
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
                  <span>12 페이지</span>
                  <span>2025년 4월 10일</span>
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
          모든 강의 보기
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
          학습 경험을 변화시킬 준비가 되셨나요?
        </h2>
        <p class="text-lg md:text-xl mb-8 text-indigo-100 dark:text-indigo-200">
          오늘 첫 번째 인터랙티브 오디오 강의를 만들고 새로운 학습 방식을
          경험하세요
        </p>
        <a
          href="/create"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:scale-105 animate-pulse-slow"
        >
          첫 번째 강의 만들기
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
