<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";
import { useCardStore } from "~/store/useCardStore";
const uiStore = useUIStore();
const cardStore = useCardStore();
const flowStepText = computed(() => {
  switch (uiStore.flowStep) {
    case 2:
      return "Vælg kvaliteterne du søger i en kandidat";
    case 3:
      return "Gennemse kvaliteterne";
    case 4:
      return "Find de bedste matches";
    case 5:
      return "Hiv fat i det ultimative match";
    default:
      return "";
  }
});

const handleClickFlowStep2 = () => {
  uiStore.matchDone = false;
  uiStore.matchBegun = false;
  uiStore.showSuperiorProfile = false;
  uiStore.flowStep = 2;
};

const handleClickFlowStep3 = () => {
  if (!cardStore.allCategoriesSelected) {
    uiStore.showMissingCategoriesTooltip = true;
    return;
  }
  uiStore.matchDone = false;
  uiStore.matchBegun = false;
  uiStore.showSuperiorProfile = false;
  uiStore.flowStep = 3;
};

const handleClickFlowStep4 = () => {
  if (!cardStore.allCategoriesSelected) {
    uiStore.showMissingCategoriesTooltip = true;
    return;
  }
  uiStore.flowStep = 4;
};

const handleClickFlowStep5 = () => {
  if (uiStore.matchDone) {
    uiStore.flowStep = 5;
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-3 text-center">
    <div class="flex items-center">
      <UButton
        class="rounded w-4 h-6 transition-all duration-200 bg-baseorange"
        :class="uiStore.flowStep >= 2 ? 'opacity-100' : 'opacity-25'"
        @click="handleClickFlowStep2"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-baseorange"
        :class="uiStore.flowStep >= 3 ? 'opacity-100' : 'opacity-25'"
      />
      <UButton
        class="rounded w-4 h-6 transition-all duration-200 bg-baseorange"
        :class="[
          !cardStore.allCategoriesSelected ? 'cursor-not-allowed' : '',
          uiStore.flowStep >= 3 ? 'opacity-100' : 'opacity-25',
        ]"
        @click.stop="handleClickFlowStep3"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-baseorange"
        :class="uiStore.flowStep >= 4 ? 'opacity-100' : 'opacity-25'"
      />
      <UButton
        class="rounded w-4 h-6 transition-all duration-200 bg-baseorange"
        :class="[
          !cardStore.allCategoriesSelected ? 'cursor-not-allowed' : '',
          uiStore.flowStep >= 4 ? 'opacity-100' : 'opacity-25',
        ]"
        @click.stop="handleClickFlowStep4"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-baseorange"
        :class="uiStore.flowStep >= 5 ? 'opacity-100' : 'opacity-25'"
      />
      <UButton
        class="rounded w-4 h-6 transition-all duration-200 bg-baseorange"
        :class="uiStore.flowStep >= 5 ? 'opacity-100' : 'opacity-25'"
        :disabled="!cardStore.allCategoriesSelected || !uiStore.matchDone"
        @click="handleClickFlowStep5"
      />
    </div>
    <p class="px-10 text-xs md:text-sm opacity-75">
      {{ flowStepText }}
    </p>
  </div>
</template>

<style scoped></style>
