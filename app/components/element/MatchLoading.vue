<script setup lang="ts">
import { inferiorProfiles } from "~/data/profiles";
import { useCardStore } from "~/store/useCardStore";

const props = defineProps<{
  onComplete: () => void;
}>();

const cardStore = useCardStore();
const loadingBegun = ref(false);
const loadingDone = ref(false);

const stages = [
  {
    key: "skill",
    label: "Kompetencer",
    color: "lightblue",
    processingText: "kompetencer",
  },
  {
    key: "personality",
    label: "Personlighed",
    color: "basered",
    processingText: "personlighed",
  },
  {
    key: "bonus",
    label: "Bonusser",
    color: "darkyellow",
    processingText: "bonusser",
  },
] as const;

type StageKey = (typeof stages)[number]["key"];

const progress = ref<Record<StageKey, number>>({
  skill: 0,
  personality: 0,
  bonus: 0,
});

const currentStageIndex = ref(0);

const stoppedResolvers: Record<number, ((val?: any) => void) | null> = {};
const STOP_FALLBACK_TIMEOUT = 2000;

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const getStageTime = (categoryKey: StageKey) => {
  return 2500 + cardStore.selectedCardsByCategory(categoryKey).length * 200;
};

const waitForCardStopped = (index: number) => {
  return new Promise((resolve) => {
    stoppedResolvers[index] = resolve;
    const t = setTimeout(() => {
      if (stoppedResolvers[index]) {
        stoppedResolvers[index]?.();
        stoppedResolvers[index] = null;
      }
      clearTimeout(t);
    }, STOP_FALLBACK_TIMEOUT);
  });
};

const onCardStopped = (index: number) => {
  if (stoppedResolvers[index]) {
    stoppedResolvers[index]?.();
    stoppedResolvers[index] = null;
  }
};

const animateStage = async (stageIndex: number) => {
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

    const easedProgress = easeInOutCubic(linearProgress);
    progress.value[stage.key] = easedProgress * 100;

    if (linearProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      progress.value[stage.key] = 100;
      waitForCardStopped(stageIndex).then(() => {
        animateStage(stageIndex + 1);
      });
    }
  };

  requestAnimationFrame(animate);
};
const currentStage = computed(() => stages[currentStageIndex.value]);
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
            @stopped="onCardStopped(index)"
          />
        </div>
      </div>

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
              {{ Math.floor(progress[stage.key]) }}%
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded overflow-hidden">
            <div
              class="h-full transition-[width] duration-75 ease-out rounded"
              :class="`bg-${stage.color}`"
              :style="{ width: progress[stage.key] + '%' }"
            />
          </div>
        </div>
      </div>
      <Transition name="icon">
        <p v-if="!loadingBegun" class="animate-pulse">Begynder...</p>
        <p v-else-if="!loadingDone" class="animate-pulse">
          Matcher
          <span :class="`text-${currentStage?.color} font-bold`">{{
            currentStage?.processingText
          }}</span
          >...
        </p>
        <p v-else>{{ inferiorProfiles.length }} matches fundet!</p>
      </Transition>
    </div>
  </div>
</template>
