<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { postLectures } from '../services/postLectures';
  import { useI18n } from '../i18n'; // i18n 훅 가져오기

  // i18n 설정
  const { t } = useI18n();

  // 상태 관리
  const step = ref(1);
  const file = ref<File | null>(null);
  const isDragging = ref(false);
  const uploadProgress = ref(0);
  const uploadError = ref('');
  const title = ref('');
  const description = ref('');
  const generationProgress = ref(0);
  const isGenerating = ref(false);
  const isComplete = ref(false);
  const generatedLectureId = ref<string | null>(null);

  const fileInputRef = ref<HTMLInputElement | null>(null);

  // 이벤트 핸들러
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = () => {
    isDragging.value = false;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = false;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    uploadError.value = '';

    // PDF 파일 확인
    if (selectedFile.type !== 'application/pdf') {
      uploadError.value = t('create.errorPdfOnly');
      return;
    }

    // 파일 크기 확인 (최대 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      uploadError.value = t('create.errorFileSize');
      return;
    }

    file.value = selectedFile;

    // 업로드 진행 상태 시뮬레이션
    uploadProgress.value = 0;
    const interval = setInterval(() => {
      uploadProgress.value += 5;
      if (uploadProgress.value >= 100) {
        clearInterval(interval);
        uploadProgress.value = 100;
      }
    }, 100);
  };

  const handleFileInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      handleFileSelection(input.files[0]);
    }
  };

  const handleNextStep = () => {
    if (step.value === 1 && (!file.value || uploadProgress.value < 100)) {
      return;
    }

    if (step.value === 2 && !title.value.trim()) {
      return;
    }

    step.value += 1;
  };

  const handleGenerateLecture = async () => {
    if (!title.value.trim() || !file.value) {
      return;
    }

    // API 호출 시작 전 UI 상태 변경
    step.value = 3;
    isGenerating.value = true;
    generationProgress.value = 0;

    try {
      // 진행 상태 시뮬레이션
      const progressInterval = setInterval(() => {
        generationProgress.value += 2;
        if (generationProgress.value >= 100) {
          clearInterval(progressInterval);
        }
      }, 200);

      // API 호출
      const response = await postLectures({
        file: file.value,
        title: title.value,
        description: description.value || undefined
      });

      clearInterval(progressInterval);
      generationProgress.value = 100;
      isGenerating.value = false;
      isComplete.value = true;
      generatedLectureId.value = response.lectureId;
    } catch (error) {
      console.error('Error generating lecture:', error);
      uploadError.value = t('create.errorGenerating');
      isGenerating.value = false;
      generationProgress.value = 0;
    }
  };

  const handlePrevStep = () => {
    if (step.value > 1) {
      step.value -= 1;
    }
  };

  const removeFile = () => {
    file.value = null;
    uploadProgress.value = 0;
  };

  // 계산된 속성
  const currentProgressStatus = computed(() => {
    if (generationProgress.value < 30) return t('create.analyzingPDF');
    if (generationProgress.value < 60) return t('create.generatingAudio');
    if (generationProgress.value < 90) return t('create.preparingInteractive');
    return t('create.finalizing');
  });

  const buttonDisabled = computed(() => {
    if (step.value === 1) return !file.value || uploadProgress.value < 100;
    if (step.value === 2) return !title.value.trim();
    return false;
  });
</script>

<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 헤더 섹션 -->
      <div class="mb-8 text-center">
        <h1
          class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {{ t('create.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('create.description') }}
        </p>
      </div>

      <!-- 단계 표시기 -->
      <div class="flex justify-center mb-8">
        <div class="flex items-center">
          <template v-for="s in 3" :key="s">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-blue-600 text-white': s === step,
                'bg-blue-500 text-white': s < step,
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300':
                  s > step
              }"
            >
              <svg
                v-if="s < step"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span v-else>{{ s }}</span>
            </div>
            <div
              v-if="s < 3"
              class="w-16 h-1"
              :class="{
                'bg-blue-500': s < step,
                'bg-gray-200 dark:bg-gray-700': s >= step
              }"
            ></div>
          </template>
        </div>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <!-- 1단계: 파일 업로드 -->
          <div
            v-if="step === 1"
            class="transition-all duration-300 opacity-100"
          >
            <h2
              class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white"
            >
              {{ t('create.uploadPDF') }}
            </h2>

            <div
              class="p-12 text-center border-2 border-dashed rounded-lg"
              :class="[
                isDragging
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-700'
              ]"
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
            >
              <div class="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <h3 class="text-xl mb-2 text-gray-900 dark:text-white">
                {{ t('create.dragDrop') }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-6">
                {{ t('create.orClick') }}
              </p>

              <input
                type="file"
                ref="fileInputRef"
                @change="handleFileInputChange"
                accept=".pdf"
                class="hidden"
              />

              <button
                @click="fileInputRef?.click()"
                class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ t('create.selectPDF') }}
              </button>

              <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
                {{ t('create.maxFileSize100') }}
              </p>
            </div>

            <div v-if="file" class="mt-6">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span class="font-medium text-gray-900 dark:text-white">{{
                    file.name
                  }}</span>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ (file.size / (1024 * 1024)).toFixed(2) }} MB
                </span>
              </div>

              <div class="mb-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${uploadProgress}%` }"
                ></div>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">
                  {{ uploadProgress }}% {{ t('create.uploaded') }}
                </span>
                <button
                  @click="removeFile"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  {{ t('create.remove') }}
                </button>
              </div>
            </div>

            <div
              v-if="uploadError"
              class="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {{ uploadError }}
            </div>
          </div>

          <!-- 2단계: 강의 정보 -->
          <div
            v-if="step === 2"
            class="transition-all duration-300 opacity-100"
          >
            <h2
              class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white"
            >
              {{ t('create.lectureInfo') }}
            </h2>

            <div class="space-y-6">
              <div>
                <label
                  for="title"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {{ t('create.lectureTitle') }}
                </label>
                <input
                  id="title"
                  v-model="title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  :placeholder="t('create.titlePlaceholder')"
                />
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {{ t('create.description') }}
                </label>
                <textarea
                  id="description"
                  v-model="description"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
                  :placeholder="t('create.descriptionPlaceholder')"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 3단계: 강의 생성 중 -->
          <div
            v-if="step === 3"
            class="transition-all duration-300 opacity-100 text-center"
          >
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {{ t('create.generating') }}
            </h2>

            <div v-if="isGenerating" class="space-y-8">
              <div class="relative pt-8">
                <div
                  class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin mx-auto"
                ></div>
              </div>

              <div>
                <div class="mb-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${generationProgress}%` }"
                  ></div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ currentProgressStatus }}
                </p>
              </div>
            </div>

            <div v-if="isComplete" class="space-y-6">
              <div
                class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ t('create.success') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {{ t('create.successMessage').replace('[title]', title) }}
              </p>

              <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <router-link :to="`/lecture/${generatedLectureId}`">
                  <button
                    class="w-full sm:w-auto py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {{ t('create.viewLecture') }}
                  </button>
                </router-link>
                <router-link to="/gallery">
                  <button
                    class="w-full sm:w-auto py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{ t('create.returnToGallery') }}
                  </button>
                </router-link>
              </div>
            </div>
          </div>

          <!-- 네비게이션 버튼 -->
          <div
            v-if="step < 3 || (step === 3 && !isGenerating && !isComplete)"
            class="flex justify-between mt-8"
          >
            <button
              @click="handlePrevStep"
              :disabled="step === 1"
              class="py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {{ t('create.back') }}
            </button>

            <div v-if="step === 2" class="space-x-3 flex">
              <button
                @click="handleGenerateLecture"
                :disabled="!title.trim() || !file"
                class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-blue-400"
              >
                {{ t('create.generateLecture') }}
              </button>
            </div>
            <button
              v-else
              @click="handleNextStep"
              :disabled="buttonDisabled"
              class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-blue-400"
            >
              {{ t('create.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
