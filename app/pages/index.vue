<script lang="ts" setup>
import { skillCards, personalityCards, bonusCards } from "~/data/cards";
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
import type { ControlItem } from "~~/shared/types";
useHead({
  title: "Det Rigtige Match",
});

const cardStore = useCardStore();
const uiStore = useUIStore();
const showingTips = ref(false);
const step = ref(1);
const totalSteps = 3;
const hoverCardCount = ref(false);
const scrollContainerRef = ref<HTMLElement | null>(null);
const { hasDragged } = useDragScroll(scrollContainerRef);

const handleStep = (direction: "next" | "previous") => {
  if (direction === "next") {
    if (step.value === 3) {
      step.value = 1;
    } else {
      step.value += 1;
    }
  } else {
    if (step.value === 1) {
      step.value = 3;
    } else {
      step.value -= 1;
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

const getCurrentCategoryPrefix = (): string => {
  switch (step.value) {
    case 1:
      return "skill-";
    case 2:
      return "personality-";
    case 3:
      return "bonus-";
    default:
      return "";
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (!uiStore.hasBegun) return;

  if (event.ctrlKey && event.shiftKey) {
    const prefix = getCurrentCategoryPrefix();

    switch (event.key) {
      case "a":
      case "A":
        event.preventDefault();
        cardStore.selectAllInCategory(prefix);
        break;
      case "c":
      case "C":
        event.preventDefault();
        cardStore.clearAllInCategory(prefix);
        break;
    }
    return;
  }

  if (event.ctrlKey) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        handleStep("previous");
        break;
      case "ArrowRight":
        event.preventDefault();
        handleStep("next");
        break;
      case "c":
      case "C":
        event.preventDefault();
        cardStore.clearAllSelections();
        break;
      case "a":
      case "A":
        event.preventDefault();
        cardStore.selectAllCards();
        break;
    }
  }
};

const keyboardShortcut1: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "icon",
    content: "material-symbols:arrow-back-rounded",
  },
  { type: "separator", content: "/" },
  {
    type: "icon",
    content: "material-symbols:arrow-forward-rounded",
  },
];

const keyboardShortcut2: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "A",
  },
];

const keyboardShortcut3: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  { type: "text", content: "Shift" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "A",
  },
];

const keyboardShortcut4: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "C",
  },
];

const keyboardShortcut5: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  { type: "text", content: "Shift" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "C",
  },
];

const keyboardShortcut6: ControlItem[] = [
  { type: "text", content: "Shift" },
  { type: "separator", content: "+" },
  {
    type: "separator",
    content: "Scroll",
  },
];

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full grow">
    <Transition name="fade" mode="out-in">
      <section v-if="!uiStore.hasBegun" class="text-center">
        <h1 class="mb-4">Det Rigtige Match</h1>
        <UButton
          :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Start'"
          size="xl"
          icon="material-symbols:star-rate-rounded"
          block
          @click="uiStore.hasBegun = true"
        />
      </section>
      <section
        v-else-if="uiStore.hasBegun && !uiStore.isPreviewing"
        class="flex flex-col items-center text-center w-full"
      >
        <div>
          <p>Trin {{ step }} af {{ totalSteps }}</p>
          <Transition name="fade" mode="out-in">
            <CardsSwiperHeading
              v-if="step === 1"
              heading="Færdigheder"
              sub-heading=""
              :maximum="skillCards.length"
            />
            <CardsSwiperHeading
              v-else-if="step === 2"
              heading="Karaktertræk"
              sub-heading=""
              :maximum="personalityCards.length"
            />
            <CardsSwiperHeading
              v-else-if="step === 3"
              heading="Bonusser"
              sub-heading=""
              :maximum="bonusCards.length"
            />
          </Transition>
        </div>
        <div
          ref="scrollContainerRef"
          class="w-full overflow-auto p-8 hide-scrollbar"
        >
          <div class="min-w-min flex justify-center">
            <Transition name="bounce" mode="out-in" appear>
              <CardsSwiper
                v-if="step === 1"
                :cards="skillCards"
                @toggle-select-card="handleSelection"
              />
              <CardsSwiper
                v-else-if="step === 2"
                :cards="personalityCards"
                @toggle-select-card="handleSelection"
              />
              <CardsSwiper
                v-else-if="step === 3"
                :cards="bonusCards"
                @toggle-select-card="handleSelection"
              />
            </Transition>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4 w-full md:max-w-sm">
          <UButton
            icon="material-symbols:chevron-left-rounded"
            @click="handleStep('previous')"
          />
          <div
            class="grow"
            @mouseenter="hoverCardCount = true"
            @mouseleave="hoverCardCount = false"
          >
            <Transition name="slide-up" mode="out-in">
              <UButtonGroup
                v-if="hoverCardCount && cardStore.selectedCardCount > 0"
              >
                <UButton
                  label="Clear All"
                  block
                  @click="cardStore.clearAllSelections()"
                />
              </UButtonGroup>
              <p v-else class="w-full">
                <span
                  v-if="cardStore.selectedCardCount === cardStore.amountOfCards"
                  >Alle </span
                >{{ cardStore.selectedCardCount }} egenskaber valgt
              </p>
            </Transition>
          </div>
          <UButton
            icon="material-symbols:chevron-right-rounded"
            @click="handleStep('next')"
          />
        </div>
        <UButton
          class="absolute top-4 left-4 md:top-8 md:left-8"
          icon="material-symbols:arrow-back-rounded"
          @click="uiStore.hasBegun = false"
        />

        <UModal
          title="Tastaturgenveje"
          class="absolute top-4 right-4 md:top-8 md:right-8"
        >
          <UButton
            icon="material-symbols:question-mark-rounded"
            @click="showingTips = !showingTips"
          />
          <template #content>
            <section class="p-4 flex flex-col gap-4">
              <h4 class="text-center">Tastaturgenveje</h4>
              <KeyboardControl
                :controls="keyboardShortcut1"
                text="Tilbage/frem i kategorier"
              />
              <KeyboardControl
                :controls="keyboardShortcut2"
                text="Vælg alle egenskaber"
              />
              <KeyboardControl
                :controls="keyboardShortcut3"
                text="Vælg alle egenskaber i kategorien"
              />
              <KeyboardControl
                :controls="keyboardShortcut4"
                text="Ryd valgte egenskaber"
              />
              <KeyboardControl
                :controls="keyboardShortcut5"
                text="Ryd valgte egenskaber i kategorien"
              />
              <KeyboardControl
                :controls="keyboardShortcut6"
                text="Scroll horisontalt"
              />
            </section>
          </template>
        </UModal>
        <UButton
          class="absolute bottom-4 md:bottom-8"
          label="Fortsæt"
          size="xl"
          @click="uiStore.isPreviewing = true"
        />
      </section>
      <section
        v-else-if="uiStore.hasBegun && uiStore.isPreviewing"
        class="flex flex-col items-center text-center w-full gap-8"
      >
        <div>
          <h3 class="mb-4">Valgte egenskaber</h3>
          <div class="flex gap-4 flex-wrap justify-center">
            <TransitionGroup name="list" appear>
              <p
                v-for="card in cardStore.selectedCards"
                :key="card.id"
                class="text-[1.5rem] px-4 py-2 bg-basered rounded"
                @click="handleSelection(card.id)"
              >
                {{ card.heading }}
              </p>
            </TransitionGroup>
            <p v-if="cardStore.selectedCards.length === 0">
              Ingen egenskaber valgt; du må da have nogle krav til din kommende
              kollega?
            </p>
          </div>
        </div>
        <div v-if="cardStore.notSelectedCardIds.length">
          <h4 class="mb-4">Ikke valgt</h4>
          <div class="flex gap-4 flex-wrap justify-center">
            <TransitionGroup name="list" appear>
              <p
                v-for="card in cardStore.notSelectedCards"
                :key="card.id"
                class="text-[1.5rem] px-4 py-2 bg-basered rounded opacity-50 transition-all duration-200 hover:opacity-100"
                @click="handleSelection(card.id)"
              >
                {{ card.heading }}
              </p>
            </TransitionGroup>
          </div>
        </div>
        <div class="flex items-center gap-4 absolute bottom-4 md:bottom-8">
          <UButton
            label="Tilbage"
            variant="outline"
            size="xl"
            @click="uiStore.isPreviewing = false"
          />
          <UButton
            label="Match"
            size="xl"
            @click="uiStore.isPreviewing = false"
          />
        </div>
      </section>
    </Transition>
  </div>
</template>
