import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import type { Ref, ComponentPublicInstance } from 'vue'

// Vue에서 ref에 전달되는 요소의 타입
type MaybeElement = Element | ComponentPublicInstance | null

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
}

interface UseElementsObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
  delay?: number // 요소 간 애니메이션 지연 시간(ms)
}

/**
 * 요소의 가시성을 감지하고 콜백을 실행하는 훅
 *
 * @param callback 교차 상태가 변경될 때 실행할 콜백 함수
 * @param options IntersectionObserver 설정
 * @returns 관찰할 요소에 할당할 ref와 관찰 중지 함수
 */
export function useIntersectionObserver<T extends Element>(
  callback: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const targetRef = ref<T | null>(null)
  let observer: IntersectionObserver | null = null

  // 관찰을 시작하는 함수
  const observe = () => {
    if (targetRef.value) {
      observer?.observe(targetRef.value)
    }
  }

  // 관찰을 중지하는 함수
  const unobserve = () => {
    if (targetRef.value && observer) {
      observer.unobserve(targetRef.value)
    }
  }

  // 관찰자 객체를 정리하는 함수
  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    // 브라우저가 IntersectionObserver API를 지원하는지 확인
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            callback(entry, observer!)
          })
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '0px',
          root: options.root || null
        }
      )

      observe()
    }
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    targetRef,
    observe,
    unobserve,
    cleanup
  }
}

/**
 * 요소가 화면에 나타났을 때 애니메이션을 실행하기 위한 훅
 *
 * @param options IntersectionObserver 설정
 * @param once 한 번만 실행할지 여부 (기본값: true)
 * @returns 관찰할 요소에 할당할 ref와 가시성 상태
 */
export function useVisibilityObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {},
  once = true
) {
  const targetRef = ref<T | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!targetRef.value) return

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // 한 번만 실행하는 경우 관찰 중지
            if (once) {
              observer?.unobserve(entry.target)
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null
      }
    )

    observer.observe(targetRef.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    targetRef,
    isVisible
  }
}

/**
 * Vue의 ref에서 실제 Element를 얻기 위한 도우미 함수
 */
function unwrapElement(el: MaybeElement): Element | null {
  if (el === null) return null

  // ComponentPublicInstance인 경우 $el을 반환
  if ('$el' in el) return el.$el

  // 이미 Element인 경우 그대로 반환
  return el
}

/**
 * 여러 요소의 가시성을 감지하는 훅
 */
export function useElementsVisibilityObserver(
  options: UseIntersectionObserverOptions & { delay?: number } = {}
) {
  const elementsMap = ref(new Map<number, Element>())
  const visibleState = ref<Record<number, boolean>>({})
  let observer: IntersectionObserver | null = null

  // 이 함수는 Vue에서 ref 콜백으로 사용되므로 MaybeElement 타입을 받아야 함
  const setElementRef = (el: MaybeElement, index: number) => {
    const element = unwrapElement(el)
    if (element) {
      elementsMap.value.set(index, element)
      // 초기 상태 설정
      if (!(index in visibleState.value)) {
        visibleState.value[index] = false
      }
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // data-index 속성에서 인덱스 가져오기
          const index = Number((entry.target as HTMLElement).dataset.index)

          if (entry.isIntersecting) {
            // 지연 표시가 설정된 경우
            if (options.delay) {
              setTimeout(() => {
                visibleState.value[index] = true
              }, index * options.delay)
            } else {
              visibleState.value[index] = true
            }

            // 한 번만 트리거
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null
      }
    )

    // DOM이 완전히 준비된 후 Observer 연결
    setTimeout(() => {
      elementsMap.value.forEach((element, index) => {
        if (element) {
          ;(element as HTMLElement).dataset.index = String(index)
          observer?.observe(element)
        }
      })
    }, 100)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    setElementRef,
    visibleState
  }
}

/**
 * 패럴랙스 효과를 위한 훅
 */
export function useParallaxEffect() {
  const setupParallax = () => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const parallaxElements = document.querySelectorAll('.parallax-bg')

      parallaxElements.forEach(el => {
        const speedFactor = el.getAttribute('data-speed') || '0.2'
        const yPos = -(scrollY * parseFloat(speedFactor))
        el.setAttribute('style', `transform: translateY(${yPos}px)`)
      })
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }

  return { setupParallax }
}
