import { animate, stagger, splitText } from "animejs";
import type { JSAnimation } from "animejs";
import type { Ref, WatchSource } from "vue";

export interface TextAnimationOptions {
  /**
   * The text element to animate
   */
  textRef: Ref<HTMLElement | null>;

  /**
   * Watch sources that trigger animation updates
   */
  watchSources: WatchSource[];

  /**
   * Condition function - animation runs when this returns true
   */
  shouldAnimate: () => boolean;

  /**
   * Get the original text content
   */
  getOriginalText: () => string;

  /**
   * Animation configuration (optional)
   */
  animationConfig?: {
    yOffset?: string;
    inDuration?: number;
    outDuration?: number;
    staggerDelay?: number;
    loopDelay?: number;
  };
}

export function useTextAnimation(options: TextAnimationOptions) {
  const {
    textRef,
    watchSources,
    shouldAnimate,
    getOriginalText,
    animationConfig = {},
  } = options;

  const {
    yOffset = "-0.5rem",
    inDuration = 200,
    outDuration = 400,
    staggerDelay = 30,
    loopDelay = 1000,
  } = animationConfig;

  const textAnimation = ref<JSAnimation | null>(null);
  const isAnimating = ref(false);

  const cleanupAnimation = () => {
    if (textAnimation.value) {
      textAnimation.value.complete();
      textAnimation.value = null;
    }

    if (textRef.value) {
      const originalText = getOriginalText();
      const hasBeenSplit = Array.from(textRef.value.childNodes).some(
        (node) => node.nodeType !== Node.TEXT_NODE
      );

      if (hasBeenSplit) {
        textRef.value.innerHTML = originalText;
      }
    }
  };

  const useDebounceFn = (fn: Function, delay: number) => {
    let timeout: number | null = null;

    return function (...args: any[]) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        fn(...args);
        timeout = null;
      }, delay);
    };
  };

  const debouncedUpdateAnimation = useDebounceFn(() => {
    isAnimating.value = false;
    updateTextAnimation();
  }, 100);

  const updateTextAnimation = () => {
    if (isAnimating.value) {
      debouncedUpdateAnimation();
      return;
    }

    isAnimating.value = true;
    cleanupAnimation();

    if (shouldAnimate() && textRef.value) {
      try {
        const { chars } = splitText(textRef.value, {
          words: false,
          chars: true,
        });

        if (chars && chars.length > 0) {
          textAnimation.value = animate(chars, {
            y: [
              { to: yOffset, ease: "inOutBounce", duration: inDuration },
              { to: 0, ease: "outBounce", duration: outDuration },
            ],
            delay: stagger(staggerDelay),
            ease: "inOutCirc",
            loopDelay,
            loop: true,
          });
        }
      } catch (error) {
        console.error("Error in text animation:", error);
      } finally {
        isAnimating.value = false;
      }
    } else {
      isAnimating.value = false;
    }
  };

  onBeforeUnmount(() => {
    cleanupAnimation();
  });

  onMounted(() => {
    nextTick(() => {
      updateTextAnimation();

      watch(watchSources, () => {
        nextTick(updateTextAnimation);
      });
    });
  });

  return {
    updateTextAnimation,
    cleanupAnimation,
    isAnimating,
  };
}
