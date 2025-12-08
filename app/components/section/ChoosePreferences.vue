<script lang="ts" setup>
import { skillCards, personalityCards, bonusCards } from "~/data/cards";
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
import { useMatchFlow } from "~/composables/useMatchFlow";
import { useTextAnimation } from "#imports";
import { card } from "#build/ui";

const cardStore = useCardStore();
const uiStore = useUIStore();
const { handleStep } = useMatchFlow();

const hoverCardCount = ref(false);
const animatedTextRef = ref<HTMLElement | null>(null);
const scrollContainerRef = ref<HTMLElement | null>(null);
const { hasDragged } = useDragScroll(scrollContainerRef);

const handleStepWithScroll = (direction: "next" | "previous") => {
  handleStep(direction);

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

const chosenAmountInCategory = computed(() => {
  switch (uiStore.preferencesStep) {
    case 1:
      return cardStore.selectedSkillCards.length;
    case 2:
      return cardStore.selectedPersonalityCards.length;
    case 3:
      return cardStore.selectedBonusCards.length;
    default:
      return 0;
  }
});

useTextAnimation({
  textRef: animatedTextRef,
  watchSources: [
    () => uiStore.preferencesStep,
    () => cardStore.currentCategoryHasSelection,
  ],
  shouldAnimate: () => !cardStore.currentCategoryHasSelection,
  getOriginalText: () =>
    `Vælg 1-${cardStore.currentCategoryCards.length} ${cardType.value} (${chosenAmountInCategory.value})`,
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
        <Transition name="icon">
          <Icon
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
        Vælg 1-{{ cardStore.currentCategoryCards.length }} {{ cardType }} ({{
          chosenAmountInCategory
        }})
      </p>
    </div>

    <div class="flex items-center justify-between gap-4 w-full md:max-w-sm">
      <UButton
        icon="material-symbols:chevron-left-rounded"
        :class="
          cardStore.previousCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'animate-pulse'
            : ''
        "
        :variant="
          cardStore.previousCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'solid'
            : 'outline'
        "
        @click="handleStepWithScroll('previous')"
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
            <span
              v-if="cardStore.selectedCardCount === cardStore.amountOfCards"
              class="text-baseparchment font-bold"
              >Alle </span
            >{{ cardStore.selectedCardCount }}
            {{ cardStore.selectedCardCount === 1 ? "kvalitet" : "kvaliteter" }}
            valgt
          </p>
        </Transition>
      </div>
      <UButton
        icon="material-symbols:chevron-right-rounded"
        :class="
          cardStore.nextCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'animate-pulse'
            : ''
        "
        :variant="
          cardStore.nextCategoryHasNoSelection &&
          cardStore.currentCategoryHasSelection
            ? 'solid'
            : 'outline'
        "
        @click="handleStepWithScroll('next')"
      />
    </div>
  </section>
</template>

<style scoped></style>
