<script lang="ts" setup>
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
useHead({
  title: "Det Rigtige Match",
});
const cardStore = useCardStore();
const uiStore = useUIStore();

const { handlePreviousStep, handleNextStep, setupKeyboardListeners } =
  useMatchFlow();

const handleClickNext = () => {
  handleNextStep();
};

setupKeyboardListeners();
</script>
<template>
  <div
    class="flex flex-col items-center justify-center h-full my-[3.5rem] md:my-[4.5rem] grow"
  >
    <div
      v-if="uiStore.flowStep > 1"
      class="fixed top-0 left-0 flex items-center justify-between w-full bg-matteblack/90 p-4 md:p-8 z-10"
    >
      <UButton
        variant="outline"
        icon="material-symbols:arrow-back-rounded"
        @click="handlePreviousStep"
      />
      <ElementProgressBar />
      <ElementTooltipModal />
    </div>
    <Transition name="icon" mode="out-in">
      <div
        v-if="uiStore.flowStep > 1 && uiStore.flowStep < 4"
        key="double-buttons"
        class="flex items-center gap-4 fixed bottom-0 left-0 w-full justify-center bg-matteblack/90 p-4 md:p-8 z-10"
      >
        <UButton
          label="Tilbage"
          variant="outline"
          size="xl"
          class="px-8"
          @click="handlePreviousStep"
        />
        <UButton
          v-if="!uiStore.matchBegun"
          :disabled="!cardStore.allCategoriesSelected"
          :label="uiStore.flowStep === 3 ? 'Match' : 'Fortsæt'"
          size="xl"
          class="px-8"
          @click="handleClickNext"
        />
      </div>
    </Transition>
    <Transition name="fade" mode="out-in">
      <SectionMatchIntro v-if="uiStore.flowStep === 1" />
      <SectionChoosePreferences v-else-if="uiStore.flowStep === 2" />
      <SectionPreviewPreferences v-else-if="uiStore.flowStep === 3" />
      <SectionGetMatches v-else-if="uiStore.flowStep === 4" />
    </Transition>
  </div>
</template>
