<script lang="ts" setup>
import { animate, stagger, splitText } from "animejs";
import { useCardStore } from "~/store/useCardStore";
const cardStore = useCardStore();
const { handleNextStep } = useMatchFlow();
const route = useRoute();

const handleClickNext = () => {
  handleNextStep();
};

onMounted(() => {
  const { chars } = splitText(".animated-text", { words: false, chars: true });
  animate(chars, {
    y: [
      { to: "-0.5rem", ease: "inOutBounce", duration: 200 },
      { to: 0, ease: "outBounce", duration: 400 },
    ],

    delay: stagger(30),
    ease: "inOutCirc",
    loopDelay: 1000,
    loop: true,
  });
});
</script>

<template>
  <section class="text-center flex flex-col items-center gap-4">
    <h1 class="flex flex-col">
      <span class="text-2xl font-primary font-normal">Det</span>
      <span
        class="font-special tracking-wide mx-4 animated-text whitespace-nowrap text-darkorange"
        >Ultimative Match</span
      >
      <span class="text-2xl font-primary font-normal">for</span>
      <span class="mx-4 font-special tracking-wide font-special"
        >{{ route.params.username ? route.params.username : "dig" }}?</span
      >
    </h1>
    <p>
      Vælg de <strong>kvaliteter, du drømmer om</strong> i din næste kollega og
      bliv lynhurtigt introduceret til det <strong>ultimative match</strong>,
      baseret på <strong>dine præferencer</strong>.
    </p>
    <UButton
      key="single-button"
      :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Start'"
      size="xl"
      block
      class="fixed bottom-0 left-0 py-4 md:py-6 z-10 rounded-none animate-pulse"
      @click="handleClickNext"
    />
  </section>
</template>

<style scoped></style>
