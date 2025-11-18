<script setup lang="ts">
import { useCardStore } from "~/store/useCardStore";

const props = defineProps<{
  onComplete: () => void;
}>();

const cardStore = useCardStore();
const loadingBegun = ref(false);
const loadingDone = ref(false);

// Define the stages configuration
const stages = [
  {
    key: "skill",
    label: "Kompetencer",
    color: "lightblue",
    statusTexts: [
      "Indlæser kompetencer...",
      "Analyserer kompetencer...",
      "Matcher kompetencer...",
      "Kompetencer matchet!",
    ],
    processingText: "Matcher kompetencer...",
  },
  {
    key: "personality",
    label: "Personlighed",
    color: "basered",
    statusTexts: [
      "Indlæser personlighed...",
      "Analyserer personlighed...",
      "Matcher personlighed...",
      "Personlighed matchet!",
    ],
    processingText: "Matcher personlighed...",
  },
  {
    key: "bonus",
    label: "Bonusser",
    color: "darkyellow",
    statusTexts: [
      "Indlæser bonusser...",
      "Analyserer bonusser...",
      "Matcher bonusser...",
      "Bonusser matchet!",
    ],
    processingText: "Matcher bonusser...",
  },
] as const;

type StageKey = (typeof stages)[number]["key"];

const progress = ref<Record<StageKey, number>>({
  skill: 0,
  personality: 0,
  bonus: 0,
});

const currentStageIndex = ref(0);

// Easing function for smooth progression (ease-in-out)
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Calculate loading times based on selected cards
const getStageTime = (categoryKey: StageKey) => {
  return 2500 + cardStore.selectedCardsByCategory(categoryKey).length * 200;
};

const animateStage = (stageIndex: number) => {
  if (stageIndex >= stages.length) {
    loadingDone.value = true;
    setTimeout(() => {
      props.onComplete();
    }, 1000);
    return;
  }

  const stage = stages[stageIndex];
  const stageTime = getStageTime(stage.key);
  const startTime = Date.now();
  currentStageIndex.value = stageIndex;

  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const linearProgress = Math.min(elapsed / stageTime, 1);

    // Apply easing and convert to 0-100 scale
    const easedProgress = easeInOutCubic(linearProgress);
    progress.value[stage.key] = Math.floor(easedProgress * 100);

    if (linearProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Ensure it ends at exactly 100
      progress.value[stage.key] = 100;
      // Start next stage after a delay
      setTimeout(() => animateStage(stageIndex + 1), 500);
    }
  };

  requestAnimationFrame(animate);
};
const currentStage = computed(() => stages[currentStageIndex.value]);
// Start the sequential animation
onMounted(() => {
  setTimeout(() => {
    loadingBegun.value = true;
    animateStage(0);
  }, 1500);
});
</script>

<template>
  <div class="w-full">
    <div class="flex flex-col items-center">
      <div class="flex flex-col items-center gap-2 mb-4 md:mb-8 w-full">
        <div class="flex items-center justify-center gap-2 w-full">
          <ElementLoadingCard
            v-for="(stage, index) in stages"
            :key="stage.key"
            :color="
              currentStageIndex >= index && loadingBegun
                ? stage.color
                : 'offwhite'
            "
            :animation-done="progress[stage.key] === 100"
            :is-active="currentStageIndex === index && loadingBegun"
          />
        </div>
      </div>

      <!-- Progress Bars -->
      <div
        v-for="(stage, index) in stages"
        :key="stage.key"
        class="mb-8 max-w-140 w-full transition-opacity duration-300"
        :class="{
          'opacity-50':
            (currentStageIndex < index && progress[stage.key] < 100) ||
            !loadingBegun,
        }"
      >
        <div class="flex flex-col gap-2 items-center">
          <div class="flex items-center justify-between w-full">
            <p class="font-medium">{{ stage.label }}</p>
            <div class="mt-1 text-xs text-right">
              {{ progress[stage.key] }}%
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded overflow-hidden">
            <div
              class="h-full transition-all duration-100 rounded"
              :class="`bg-${stage.color}`"
              :style="{ width: `${progress[stage.key]}%` }"
            />
          </div>
        </div>
      </div>
      <Transition name="icon">
        <p v-if="!loadingBegun" class="animate-pulse">Begynder...</p>
        <p v-else class="animate-pulse">{{ currentStage.processingText }}</p>
      </Transition>
    </div>
  </div>
</template>
