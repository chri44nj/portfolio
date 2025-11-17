<script lang="ts" setup>
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
import { superiorProfile, inferiorProfiles } from "~/data/profiles";

const scrollContainerRef = ref<HTMLElement | null>(null);
useDragScroll(scrollContainerRef);
const cardStore = useCardStore();
const uiStore = useUIStore();
const isHolding = ref(false);
const progress = ref(0);
let interval: number | null = null;
let interval2: number | null = null;

const handleHoldStart = () => {
  if (isHolding.value) return;

  // Clear the decay interval if user starts holding again
  if (interval2) {
    clearInterval(interval2);
    interval2 = null;
  }

  isHolding.value = true;
  // Don't reset progress - continue from current value

  const duration = 3000;
  const intervalTime = 20;
  const step = (intervalTime / duration) * 100;

  interval = window.setInterval(() => {
    progress.value += step;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval!);
      isHolding.value = false;
      handleHoldComplete();
    }
  }, intervalTime);
};

const handleHoldEnd = () => {
  if (progress.value >= 100) return; // Don't reset if completed

  isHolding.value = false;
  clearInterval(interval!);
  const duration = 1000;
  const intervalTime = 20;
  const step = (intervalTime / duration) * 100;

  interval2 = window.setInterval(() => {
    progress.value -= step;
    if (progress.value <= 0) {
      progress.value = 0;
      clearInterval(interval2!);
    }
  }, intervalTime);
};

const handleHoldComplete = () => {
  console.log("Hold complete! Combine triggered.");
  uiStore.showSuperiorProfile = true;
};

const calculateMatchPercentage = (profile: Profile) => {
  if (!cardStore.selectedCardIds.length) return 0;

  if (profile.id === "profile-1") return 100;

  const matchingCards = cardStore.selectedCardIds.filter((cardId) =>
    profile.cardMatches.includes(cardId)
  );

  const cardsNotMatched = profile.cardMatches.length - matchingCards.length;

  const percentageMatched = Math.max(
    0,
    (1 - cardsNotMatched / matchingCards.length) * 100
  );

  return Math.round(percentageMatched);
};

// Calculate dynamic styles based on progress
const getCardStyle = (index: number, total: number) => {
  const progressDecimal = progress.value / 100;

  // Shake intensity increases with progress
  const shakeIntensity = progressDecimal * 5;

  // Calculate movement - cards move toward center (desktop) or left (mobile)
  // Center index for desktop centering
  const centerIndex = (total - 1) / 2;
  const distanceFromCenter = index - centerIndex;

  // Card width is aspect-2/3 with h-[300px] = width ~200px
  // Gap between cards is 24px (gap-6)
  // Need to move each card: (cardWidth + gap) * distance from center
  const cardWidth = 200; // approximate width based on aspect ratio
  const gap = 24;
  const unitDistance = cardWidth + gap;

  // On desktop: move toward center, accounting for card width + gaps
  const movementDesktop = -distanceFromCenter * unitDistance * progressDecimal;

  // On mobile: stack all cards to the left position (first card's position)
  const movementMobile = -index * unitDistance * progressDecimal;

  return {
    transform: `translateX(var(--movement)) rotate(${
      Math.sin(Date.now() / 100 + index) * shakeIntensity
    }deg)`,
    "--movement-desktop": `${movementDesktop}px`,
    "--movement-mobile": `${movementMobile}px`,
    transition: "transform 0.1s ease-out",
  };
};
</script>

<template>
  <section
    class="flex flex-col gap-4 items-center justify-center w-full h-full"
  >
    <h2 class="text-center font-special text-darkorange">
      {{
        !uiStore.showSuperiorProfile ? `Dine matches` : "Dit ultimative match"
      }}
    </h2>
    <Transition name="bounce" mode="out-in">
      <div
        v-if="!uiStore.showSuperiorProfile"
        key="inferior"
        class="w-full flex flex-col gap-4 items-center"
      >
        <div
          ref="scrollContainerRef"
          class="w-full overflow-auto p-4 hide-scrollbar"
        >
          <div class="min-w-min flex justify-center gap-6">
            <ElementFlippableCard
              v-for="(profile, index) in inferiorProfiles"
              :key="profile.id"
              :style="getCardStyle(index, inferiorProfiles.length)"
              :hide-title="progress > 0"
              class="card-shake"
            >
              <template #back>
                <div
                  class="flex flex-col h-full w-full text-start text-matteblack"
                >
                  <p class="font-bold">Highlights</p>
                  <ul class="list-none flex flex-col gap-2 text-xs">
                    <li v-for="highlight in profile.highlights" class="">
                      <p>{{ highlight.title }}</p>
                      <div
                        class="w-full border"
                        :class="`border-${highlight.color}`"
                      >
                        <div
                          class="h-4"
                          :class="`bg-${highlight.color}`"
                          :style="{ width: `${highlight.value}%` }"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </template>

              <template #front-top-left>
                <Icon name="mdi:star" class="text-darkorange text-xl" />
                <p class="text-vertical text-matteblack font-bold">
                  {{ profile.firstName }}
                </p>
              </template>

              <template #front-center>
                <NuxtImg
                  src="/img/facecard.png"
                  alt="Superior Profile"
                  class="w-1/2"
                />
              </template>

              <template #front-bottom-right>
                <p class="text-vertical text-darkorange font-bold">
                  {{ profile.lastName }}
                </p>
                <Icon
                  name="mdi:star"
                  class="text-darkorange text-xl rotate-180"
                />
              </template>

              <template #title-beneath>
                <div class="text-sm">
                  <p>{{ profile.firstName }} {{ profile.lastName }}</p>
                  <p class="font-bold">
                    {{ `${calculateMatchPercentage(profile)}% match` }}
                  </p>
                </div>
              </template>
            </ElementFlippableCard>
          </div>
        </div>
      </div>

      <div
        v-else
        key="superior"
        class="w-full flex flex-col gap-4 items-center"
      >
        <div class="flex justify-center p-4">
          <div
            class="bg-gradient-to-br from-purple-200 to-pink-200 aspect-2/3 h-[300px] rounded-lg flex flex-col items-center justify-center text-matteblack shadow-xl text-center"
          >
            <div
              class="rounded-full bg-gradient-to-br from-purple-300 to-pink-300 mb-4 flex items-center justify-center overflow-hidden w-32 h-32"
            >
              <Icon name="mdi:account" class="text-8xl text-purple-600" />
            </div>
            <p class="font-bold text-2xl mb-1">{{ superiorProfile.name }}</p>
            <p class="text-lg text-gray-700">
              {{ calculateMatchPercentage(superiorProfile) }}% match
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <p v-if="!uiStore.showSuperiorProfile" class="text-center">
      {{ inferiorProfiles.length }} fine kandidater... Men hvad nu, hvis du
      kunne <strong class="text-darkorange animate-pulse">kombinere</strong> dem
      alle og skabe det
      <strong class="text-darkorange">ultimative match</strong> for dig?
    </p>
    <p v-else class="text-center text-lg">
      <strong>Boom!</strong> Alle dine ønskede kvaliteter, kombineret i én
      person.
    </p>
    <div
      v-if="!uiStore.showSuperiorProfile"
      class="fixed bottom-0 left-0 w-full z-10"
      @mousedown="handleHoldStart"
      @mouseup="handleHoldEnd"
      @mouseleave="handleHoldEnd"
      @touchstart.prevent="handleHoldStart"
      @touchend.prevent="handleHoldEnd"
    >
      <UButton
        size="xl"
        block
        class="fixed bottom-0 left-0 py-4 md:py-6 rounded-none overflow-hidden animate-pulse"
      >
        <div
          class="absolute top-0 left-0 h-full bg-darkorange transition-all duration-[0.02s] ease-linear"
          :style="{ width: progress + '%' }"
        ></div>
        <span class="relative z-10"
          >{{ $device.isMobileOrTablet ? "Tryk" : "Klik" }} og hold for at
          kombinere</span
        >
      </UButton>
    </div>
  </section>
</template>

<style scoped>
.card-shake {
  --movement: var(--movement-mobile);
}

@media (min-width: 768px) {
  .card-shake {
    --movement: var(--movement-desktop);
  }
}
</style>
