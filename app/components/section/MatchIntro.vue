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
  <section class="text-center">
    <UButton
      key="single-button"
      :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Find ud af det'"
      size="xl"
      block
      class="fixed bottom-0 left-0 py-4 md:py-6 z-10 rounded-none"
      @click="handleClickNext"
    />
    <h1>
      <span class="text-2xl">Det</span>
      <span class="font-secondary tracking-wide mx-4 animated-text"
        >Rigtige Match</span
      >
      <span class="text-2xl">for</span>

      <span class="mx-4"
        >{{
          route.params.username ? route.params.username : "din business"
        }}?</span
      >
    </h1>
  </section>
</template>

<style scoped></style>
