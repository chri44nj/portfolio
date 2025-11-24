<script lang="ts" setup>
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
import { Fireworks } from "@fireworks-js/vue";

useHead({
  title: "Det Ultimative Match",
});
const cardStore = useCardStore();
const uiStore = useUIStore();
const { handlePreviousStep, handleNextStep, setupKeyboardListeners } =
  useMatchFlow();
setupKeyboardListeners();
const handleClickNext = () => {
  handleNextStep();
};

const handleClickDisabled = () => {
  if (!cardStore.allCategoriesSelected) {
    uiStore.showMissingCategoriesTooltip = true;
  }
};
const handleGlobalClick = () => {
  if (uiStore.showMissingCategoriesTooltip) {
    uiStore.showMissingCategoriesTooltip = false;
  }
};

const buttonLabelPrimary = computed(() => {
  if (uiStore.flowStep === 4) {
    return uiStore.showSuperiorProfile
      ? "Se dit ultimative match"
      : "Se matches";
  }
  if (uiStore.flowStep === 3) return "Match";
  return "Næste";
});

const showButtons = computed(() => {
  if (uiStore.flowStep > 1 && uiStore.flowStep < 5) {
    if (uiStore.flowStep === 4 && !uiStore.matchDone) {
      return false;
    } else return true;
  }

  return false;
});
const container = ref<HTMLElement | null>(null);

let fireworks: any = null;

onMounted(() => {
  if (container.value) {
    fireworks = new Fireworks(container.value, {
      autoresize: true,
      opacity: 0.4,
      intensity: 25,
      friction: 0.97,
      gravity: 1.4,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 4,
    });
  }
});

watch(
  () => uiStore.matchDone,
  (isDone) => {
    if (isDone && fireworks) {
      fireworks.start();
    } else {
      fireworks?.stop(true);
    }
  }
);

onMounted(() => {
  window.addEventListener("click", handleGlobalClick);

  onBeforeUnmount(() => {
    window.removeEventListener("click", handleGlobalClick);
    fireworks?.stop(true);
    fireworks = null;
  });
});
</script>
<template>
  <div
    class="flex flex-col items-center justify-center h-full py-[3.5rem] grow"
  >
    <Transition name="fade" mode="out-in">
      <SectionMatchIntro v-if="uiStore.flowStep === 1" />
      <SectionChoosePreferences v-else-if="uiStore.flowStep === 2" />
      <SectionPreviewPreferences v-else-if="uiStore.flowStep === 3" />
      <SectionGetMatches v-else-if="uiStore.flowStep === 4" />
      <SectionAllMatches v-else-if="uiStore.flowStep === 5" />
    </Transition>

    <div
      v-if="uiStore.flowStep > 1"
      class="fixed top-0 left-0 flex items-center justify-center w-full bg-matteblack/90 p-4 z-100"
    >
      <UButton
        variant="outline"
        icon="material-symbols:arrow-back-rounded"
        class="fixed top-4 left-4 opacity-50 md:hover:opacity-100"
        @click="handlePreviousStep"
      />
      <ElementProgressBar />
      <ElementTooltipModal
        class="fixed top-4 right-4 opacity-50 md:hover:opacity-100"
      />
    </div>

    <Transition name="icon" mode="out-in">
      <div
        v-if="showButtons"
        key="double-buttons"
        class="flex items-center gap-4 fixed bottom-0 left-0 w-full justify-center bg-matteblack/90 p-4 z-10"
      >
        <Transition name="bounce-in" mode="out-in">
          <ElementMissingCategoriesTooltip
            v-if="
              uiStore.showMissingCategoriesTooltip &&
              !cardStore.allCategoriesSelected
            "
          />
        </Transition>
        <UButton
          label="Tilbage"
          variant="outline"
          size="lg"
          class="px-8"
          @click="handlePreviousStep"
        />
        <UButton
          :label="buttonLabelPrimary"
          size="lg"
          class="px-8"
          :class="
            !cardStore.allCategoriesSelected
              ? 'opacity-25 cursor-not-allowed'
              : 'animate-pulse'
          "
          @click.stop="
            cardStore.allCategoriesSelected
              ? handleClickNext()
              : handleClickDisabled()
          "
        />
      </div>
    </Transition>

    <ClientOnly>
      <Fireworks
        v-if="uiStore.showSuperiorProfile"
        :autoresize="true"
        class="absolute inset-0 h-screen pointer-events-none z-0"
      />
    </ClientOnly>
  </div>
</template>
