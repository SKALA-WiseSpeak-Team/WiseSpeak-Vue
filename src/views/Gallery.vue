<script setup lang="ts">
  import MainLayout from '../components/Layout/MainLayout.vue'

  const images = [
    {
      id: 1,
      title: '이미지 1',
      description: '아름다운 풍경',
      url: 'https://picsum.photos/800/600?random=1'
    },
    {
      id: 2,
      title: '이미지 2',
      description: '도시의 밤',
      url: 'https://picsum.photos/800/600?random=2'
    },
    {
      id: 3,
      title: '이미지 3',
      description: '자연의 아름다움',
      url: 'https://picsum.photos/800/600?random=3'
    },
    {
      id: 4,
      title: '이미지 4',
      description: '현대적인 건축물',
      url: 'https://picsum.photos/800/600?random=4'
    },
    {
      id: 5,
      title: '이미지 5',
      description: '평화로운 순간',
      url: 'https://picsum.photos/800/600?random=5'
    },
    {
      id: 6,
      title: '이미지 6',
      description: '도시의 활기',
      url: 'https://picsum.photos/800/600?random=6'
    }
  ]
</script>

<template>
  <MainLayout>
    <div class="py-12 bg-gray-100 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            갤러리
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            아름다운 순간들을 담은 갤러리입니다
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="image in images"
            :key="image.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <img
              :src="image.url"
              :alt="image.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ image.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ image.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
