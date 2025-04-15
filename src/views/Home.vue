<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const mounted = ref(false)

  onMounted(() => {
    mounted.value = true
  })

  // 샘플 강의 데이터
  const featuredLectures = [
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
  ]
</script>

<template>
  <!-- 히어로 섹션 -->
  <section class="relative py-20 md:py-32 overflow-hidden">
    <div
      class="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"
    ></div>
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl mx-auto text-center">
        <div class="flex justify-center mb-6">
          <img
            src="/logo.svg"
            alt="WiseSpeak Logo"
            width="80"
            height="80"
            class="rounded-md"
          />
        </div>
        <h1
          class="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white"
        >
          지식의 음성화, 대화로 학습하는 새로운 방식
        </h1>
        <p class="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8">
          WiseSpeak은 PDF 문서를 AI 기반 챗봇이 지원하는 인터랙티브 오디오
          강의로 변환합니다.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/gallery"
            class="bg-gradient-to-b from-indigo-500 to-indigo-600/80 text-white uppercase tracking-wider px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:from-indigo-500/90 hover:to-indigo-600/70 active:translate-y-0.5 active:shadow-sm"
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
  <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/30">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
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
        <div class="transition-all duration-300">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
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
        <div class="transition-all duration-300">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
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
        <div class="transition-all duration-300">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg h-full"
          >
            <div class="pt-6 px-6 text-center">
              <div
                class="mb-4 bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
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
  <section class="py-16 md:py-24 bg-white dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
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
          v-for="lecture in featuredLectures"
          :key="lecture.id"
          class="transition-all duration-300"
        >
          <a :href="`/lecture/${lecture.id}`" class="block">
            <div
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
            >
              <div class="aspect-[4/3] relative">
                <div
                  class="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center"
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

      <div class="text-center mt-12">
        <a
          href="/gallery"
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
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
  <section class="py-16 md:py-24 bg-indigo-600 dark:bg-indigo-800 text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          학습 경험을 변화시킬 준비가 되셨나요?
        </h2>
        <p class="text-lg md:text-xl mb-8 text-indigo-100 dark:text-indigo-200">
          오늘 첫 번째 인터랙티브 오디오 강의를 만들고 새로운 학습 방식을
          경험하세요
        </p>
        <a
          href="/create"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 uppercase tracking-wider transition-all duration-300 hover:shadow-lg"
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

  /* 로컬 변수 삭제하고 전역 테마 사용 */
</style>
