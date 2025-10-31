<script lang="ts" setup>
import { animate, stagger, splitText } from "animejs";
import { skillCards, personalityCards, bonusCards } from "~/data/cards";
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
import type { JSAnimation } from "animejs";

const cardStore = useCardStore();
const uiStore = useUIStore();
const hoverCardCount = ref(false);
const scrollContainerRef = ref<HTMLElement | null>(null);
const animatedTextRef = ref<HTMLElement | null>(null);
const textAnimation = ref<JSAnimation | null>(null);
const { hasDragged } = useDragScroll(scrollContainerRef);
const isAnimating = ref(false);

const handleStep = (direction: "next" | "previous") => {
  if (direction === "next") {
    if (uiStore.preferencesStep === 3) {
      uiStore.preferencesStep = 1;
    } else {
      uiStore.preferencesStep += 1;
    }
  } else {
    if (uiStore.preferencesStep === 1) {
      uiStore.preferencesStep = 3;
    } else {
      uiStore.preferencesStep -= 1;
    }
  }
  setTimeout(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, 100);
};

const handleSelection = (id: string) => {
  if (hasDragged.value) return;
  cardStore.toggleSelectCard(id);
};

const cardType = computed(() => {
  switch (uiStore.preferencesStep) {
    case 1:
      return "kompetencer";
    case 2:
      return "karaktertræk";
    case 3:
      return "bonusser";
    default:
      return "";
  }
});

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

const cleanupAnimation = () => {
  if (textAnimation.value) {
    textAnimation.value.complete();
    textAnimation.value = null;
  }

  if (animatedTextRef.value) {
    const originalText = `Vælg 1-${cardStore.currentCategoryCards.length} ${cardType.value}`;

    const hasBeenSplit = Array.from(animatedTextRef.value.childNodes).some(
      (node) => node.nodeType !== Node.TEXT_NODE
    );

    if (hasBeenSplit) {
      animatedTextRef.value.innerHTML = originalText;
    }
  }
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

  if (!cardStore.currentCategoryHasSelection && animatedTextRef.value) {
    try {
      const { chars } = splitText(animatedTextRef.value, {
        words: false,
        chars: true,
      });

      if (chars && chars.length > 0) {
        textAnimation.value = animate(chars, {
          y: [
            { to: "-0.5rem", ease: "inOutBounce", duration: 200 },
            { to: 0, ease: "outBounce", duration: 400 },
          ],
          delay: stagger(30),
          ease: "inOutCirc",
          loopDelay: 1000,
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

    watch(
      [
        () => uiStore.preferencesStep,
        () => cardStore.currentCategoryHasSelection,
      ],
      () => {
        nextTick(updateTextAnimation);
      }
    );
  });
});
</script>

<template>
  <section class="flex flex-col items-center text-center w-full">
    <div>
      <p class="mb-2">
        Trin {{ uiStore.preferencesStep }} af
        {{ uiStore.preferencesTotalSteps }}
      </p>
      <Transition name="fade" mode="out-in">
        <ElementCardsSwiperHeading
          v-if="uiStore.preferencesStep === 1"
          heading="Kompetencer"
          sub-heading=""
          :maximum="skillCards.length"
        />
        <ElementCardsSwiperHeading
          v-else-if="uiStore.preferencesStep === 2"
          heading="Personlighed"
          sub-heading=""
          :maximum="personalityCards.length"
        />
        <ElementCardsSwiperHeading
          v-else-if="uiStore.preferencesStep === 3"
          heading="Bonusser"
          sub-heading=""
          :maximum="bonusCards.length"
        />
      </Transition>
    </div>
    <div
      ref="scrollContainerRef"
      class="w-full overflow-auto p-4 hide-scrollbar"
    >
      <div class="min-w-min flex justify-center">
        <Transition name="bounce" mode="out-in" appear>
          <ElementCardsSwiper
            v-if="uiStore.preferencesStep === 1"
            :cards="skillCards"
            @toggle-select-card="handleSelection"
          />
          <ElementCardsSwiper
            v-else-if="uiStore.preferencesStep === 2"
            :cards="personalityCards"
            @toggle-select-card="handleSelection"
          />
          <ElementCardsSwiper
            v-else-if="uiStore.preferencesStep === 3"
            :cards="bonusCards"
            @toggle-select-card="handleSelection"
          />
        </Transition>
      </div>
    </div>
    <div class="flex items-center mb-4 gap-2">
      <div
        class="w-5 md:w-6 flex items-center transition-all duration-200"
        :class="
          cardStore.currentCategoryHasSelection ? 'opacity-100' : 'opacity-50'
        "
      >
        <Transition name="icon"
          ><Icon
            v-if="cardStore.currentCategoryHasSelection"
            class="shrink-0 text-xl md:text-2xl"
            :name="'material-symbols:check-circle-rounded'"
          />
          <Icon
            v-else
            class="shrink-0 text-xl md:text-2xl"
            :name="'material-symbols:cancel-rounded'"
          />
        </Transition>
      </div>
      <p
        ref="animatedTextRef"
        class="md:text-xl animated-text"
        :class="cardStore.categoryColor"
      >
        Vælg 1-{{ cardStore.currentCategoryCards.length }} {{ cardType }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-4 w-full md:max-w-sm">
      <UButton
        icon="material-symbols:chevron-left-rounded"
        :variant="
          cardStore.previousCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'solid'
            : 'outline'
        "
        @click="handleStep('previous')"
      />
      <div
        class="grow overflow-hidden"
        @mouseenter="hoverCardCount = true"
        @mouseleave="hoverCardCount = false"
      >
        <Transition name="slide-up" mode="out-in">
          <UButtonGroup
            v-if="hoverCardCount && cardStore.selectedCardCount > 0"
            class="w-full"
          >
            <UButton
              label="Ryd valgte"
              variant="outline"
              block
              @click="cardStore.clearAllSelections()"
            />
          </UButtonGroup>
          <p v-else class="w-full cursor-default">
            <span v-if="cardStore.selectedCardCount === cardStore.amountOfCards"
              >Alle </span
            >{{ cardStore.selectedCardCount }}
            {{ cardStore.selectedCardCount === 1 ? "egenskab" : "egenskaber" }}
            valgt
          </p>
        </Transition>
      </div>
      <UButton
        icon="material-symbols:chevron-right-rounded"
        :variant="
          cardStore.nextCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'solid'
            : 'outline'
        "
        @click="handleStep('next')"
      />
    </div>
  </section>
</template>

<style scoped></style>
