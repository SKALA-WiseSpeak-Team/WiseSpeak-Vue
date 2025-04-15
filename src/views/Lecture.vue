<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import MainLayout from '../components/Layout/MainLayout.vue'

  const route = useRoute()
  const lecture = ref({
    id: route.params.id,
    title: '웹 개발의 기초',
    instructor: '김강사',
    duration: '2시간 30분',
    level: '초급',
    description:
      '웹 개발의 기초를 배우는 강의입니다. HTML, CSS, JavaScript의 기본 개념부터 실전 프로젝트까지 다룹니다.',
    topics: [
      '웹의 기본 구조 이해하기',
      'HTML 태그와 시맨틱 마크업',
      'CSS 스타일링 기초',
      'JavaScript 프로그래밍 입문',
      '실전 미니 프로젝트'
    ],
    thumbnail: `https://picsum.photos/800/400?random=${route.params.id}`
  })

  const progress = ref(0)

  onMounted(() => {
    // 실제 애플리케이션에서는 API를 통해 강의 데이터를 가져올 수 있습니다
    progress.value = 35 // 예시 진도율
  })
</script>

<template>
  <MainLayout>
    <div class="py-12 bg-gray-100 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 강의 헤더 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
        >
          <img
            :src="lecture.thumbnail"
            :alt="lecture.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{ lecture.title }}
            </h1>
            <div class="flex flex-wrap gap-4 mb-6">
              <div class="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{{ lecture.instructor }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ lecture.duration }}</span>
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-300">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>{{ lecture.level }}</span>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ lecture.description }}
            </p>

            <!-- 진도율 -->
            <div class="mb-8">
              <div class="flex justify-between mb-2">
                <span
                  class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >진도율</span
                >
                <span
                  class="text-sm font-medium text-indigo-600 dark:text-indigo-400"
                  >{{ progress }}%</span
                >
              </div>
              <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
            </div>

            <!-- 학습 목차 -->
            <div>
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                학습 목차
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="(topic, index) in lecture.topics"
                  :key="index"
                  class="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <svg
                    class="w-5 h-5 mr-3 text-indigo-500 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{{ topic }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 수강 버튼 -->
        <div class="text-center">
          <button
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            수강 시작하기
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
