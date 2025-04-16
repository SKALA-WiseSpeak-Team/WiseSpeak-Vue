import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

interface UseElementsObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
  delay?: number // 요소 간 애니메이션 지연 시간(ms)
}

/**
 * 여러 요소의 가시성을 감지하고 순차적으로 애니메이션을 적용하는 훅
 * 
 * @param options IntersectionObserver 설정
 * @returns 요소들의 가시성 상태와 ref 설정 함수
 */
export function useElementsObserver(options: UseElementsObserverOptions = {}) {
  const elementsRef = ref<HTMLElement[]>([])
  const visibilityState = reactive<Record<number, boolean>>({})
  let observer: IntersectionObserver | null = null

  const setElementRef = (el: HTMLElement | null, index: number) => {
    if (el) {
      elementsRef.value[index] = el
      visibilityState[index] = false
      
      // 데이터셋에 인덱스 추가
      el.dataset.observerIndex = index.toString()
    }
  }

  onMounted(() => {
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.observerIndex || '0'
            )
            
            // 지연 시간이 설정된 경우 순차적으로 표시
            if (options.delay) {
              setTimeout(() => {
                visibilityState[index] = true
              }, index * options.delay)
            } else {
              visibilityState[index] = true
            }
            
            // 한 번 표시되면 관찰 중지
            observer?.unobserve(entry.target)
          }
        })
      }, {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null
      })

      // 모든 요소를 관찰
      setTimeout(() => {
        elementsRef.value.forEach(el => {
          if (el) observer?.observe(el)
        })
      }, 100) // DOM이 완전히 렌더링된 후 실행
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    setElementRef,
    visibilityState,
    elementsRef
  }
}