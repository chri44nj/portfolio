<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";
import { useCardStore } from "~/store/useCardStore";
import { profiles } from "~/data/profiles";
const uiStore = useUIStore();
const cardStore = useCardStore();

const { handleMatchingComplete } = useMatchFlow();
const handleOnComplete = () => {
  handleMatchingComplete();
};
const calculateMatchPercentage = (profile) => {
  if (!cardStore.selectedCardIds.length) return 0;

  if (profile.id === "profile-1") return 100;

  const matchingCards = cardStore.selectedCardIds.filter((cardId) =>
    profile.cardMatches.includes(cardId)
  );

  const matchPercentage =
    (matchingCards.length / cardStore.selectedCardIds.length) * 100;

  return Math.round(matchPercentage);
};
</script>

<template>
  <section
    class="flex flex-col gap-4 items-center justify-center w-full h-full"
  >
    <Transition name="fade" mode="out-in">
      <ElementMatchLoading
        v-if="!uiStore.matchDone"
        :on-complete="handleOnComplete"
      />

      <div v-else class="w-full">
        <h2 class="text-center mb-8">Match fundet!</h2>
        <div
          class="flex flex-col md:flex-row gap-4 justify-center items-center w-full"
        >
          <div
            v-for="profile in profiles"
            :key="profile.id"
            class="bg-gray-200 aspect-2/3 rounded flex flex-col items-center justify-center text-matteblack shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            :class="profile.id === 'profile-1' ? 'h-[325px]' : 'h-[300px]'"
          >
            <div
              class="rounded-full bg-gray-300 mb-4 flex items-center justify-center overflow-hidden"
            >
              <Icon name="mdi:account" class="text-6xl text-gray-500" />
            </div>
            <p class="font-bold text-xl mb-1">{{ profile.name }}</p>
            <p class="text-sm text-gray-600">
              {{ calculateMatchPercentage(profile) }}% match
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped></style>
