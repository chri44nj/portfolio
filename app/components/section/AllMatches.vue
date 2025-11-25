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
const showTextPartOne = ref(false);
const showTextPartTwo = ref(false);
const showButtonHold = ref(false);
const showButtonMore = ref(false);
const showSuccessTextPartOne = ref(false);
const showSuccessTextPartTwo = ref(false);
const showSuccessTextPartThree = ref(false);

let holdStartTime: number | null = null;
let decayStartProgress = 0;
let animFrame: number | null = null;

const HOLD_DURATION = 5000; // ms
const DECAY_DURATION = 1000; // ms

const updateProgress = (timestamp: number) => {
  if (typeof window === "undefined") return;

  if (isHolding.value && holdStartTime !== null) {
    const elapsed = timestamp - holdStartTime;
    progress.value = Math.min((elapsed / HOLD_DURATION) * 100, 100);

    if (progress.value >= 100) {
      isHolding.value = false;
      holdStartTime = null;
      handleHoldComplete();
    }
  } else if (!isHolding.value && decayStartProgress > 0) {
    if (!holdStartTime) return; // prevent NaN or crash
    const elapsed = timestamp - holdStartTime;
    const fraction = elapsed / DECAY_DURATION;
    progress.value = Math.max(decayStartProgress * (1 - fraction), 0);

    if (progress.value <= 0) {
      decayStartProgress = 0;
      holdStartTime = null;
    }
  }

  animFrame = window.requestAnimationFrame(updateProgress);
};

const handleHoldStart = () => {
  if (isHolding.value) return;

  isHolding.value = true;
  if (typeof window !== "undefined") {
    holdStartTime = performance.now() - (progress.value / 100) * HOLD_DURATION;
  }
};

const handleHoldEnd = () => {
  if (progress.value >= 100) return;

  isHolding.value = false;
  decayStartProgress = progress.value;
  if (typeof window !== "undefined") {
    holdStartTime = performance.now();
  }
};

const handleHoldComplete = () => {
  console.log("Ultimate match created!");
  uiStore.showSuperiorProfile = true;
  requestAnimationFrame(() => {
    showSuccessTextPartOne.value = true;

    setTimeout(() => {
      showSuccessTextPartTwo.value = true;
      setTimeout(() => {
        showSuccessTextPartThree.value = true;
        setTimeout(() => {
          showButtonMore.value = true;
          uiStore.visitedUltimateMatch = true;
        }, 2000);
      }, 4000);
    }, 3000);
  });
};

const calculateMatchPercentage = (profile: Profile) => {
  // Always include altid-1 in the virtual selection
  const selected = new Set(cardStore.selectedCardIds);
  selected.add("altid-1");

  // Superior profile remains 100%
  if (profile.id === "profile-1") return 100;

  // Count how many of this profile's required cards are present in the selection
  const matchingCount = profile.cardMatches.filter((id) =>
    selected.has(id)
  ).length;

  // Use the profile's total required cards as denominator (avoid division by 0)
  const total = Math.max(1, profile.cardMatches.length);

  const rawPercent = Math.round((matchingCount / total) * 100);

  // Ensure no profile shows 0% (change this if you'd rather show 0)
  return Math.max(1, rawPercent);
};

// Calculate dynamic styles based on progress
const initialScrollPosition = ref(0);

const getCardStyle = (index: number, total: number) => {
  const progressDecimal = progress.value / 100;

  // Shake intensity increases with progress
  const shakeIntensity = progressDecimal * 5;

  // Calculate movement - cards move toward center OF THEIR CONTAINER
  const centerIndex = (total - 1) / 2;
  const distanceFromCenter = index - centerIndex;

  const cardWidth = 200;
  const gap = 24;
  const unitDistance = cardWidth + gap;

  // Move toward the center - but stop when cards meet (distance becomes 0)
  // On mobile, cards might over-converge, so we clamp the movement
  const maxMovement = Math.abs(distanceFromCenter) * unitDistance;
  const calculatedMovement =
    -distanceFromCenter * unitDistance * progressDecimal;

  // Clamp to prevent over-convergence
  const movement =
    distanceFromCenter > 0
      ? Math.max(calculatedMovement, -maxMovement) // Moving left
      : Math.min(calculatedMovement, maxMovement); // Moving right

  return {
    transform: `translateX(${movement}px) rotate(${
      Math.sin(Date.now() / 100 + index) * shakeIntensity
    }deg)`,
    transition: "transform 0.1s ease-out",
  };
};

watch(isHolding, (holding) => {
  if (!scrollContainerRef.value) return;

  const container = scrollContainerRef.value;

  if (holding) {
    // Save position and scroll to center
    initialScrollPosition.value = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const centerScroll = maxScroll / 2;
    container.scrollTo({ left: centerScroll, behavior: "smooth" });
  } else if (progress.value < 100) {
    // Scroll back to initial position (unless we completed)
    container.scrollTo({
      left: initialScrollPosition.value,
      behavior: "smooth",
    });
  }
});

const resetCardStyle = () => {
  // Cancel running rAF if present (SSR-safe)
  if (typeof window !== "undefined" && animFrame !== null) {
    window.cancelAnimationFrame(animFrame);
    animFrame = null;
  }

  isHolding.value = false;
  progress.value = 0;
  holdStartTime = null;
  decayStartProgress = 0;

  if (scrollContainerRef.value) {
    scrollContainerRef.value.scrollLeft = initialScrollPosition.value;
  }
};

onMounted(() => {
  animFrame = window.requestAnimationFrame(updateProgress);

  setTimeout(() => {
    showTextPartOne.value = true;
    setTimeout(() => {
      showTextPartTwo.value = true;
      setTimeout(() => {
        showButtonHold.value = true;
        if (!uiStore.visitedAllMatches) uiStore.visitedAllMatches = true;
      }, 1000);
    }, 2000);
  }, 1750);
});

onBeforeUnmount(() => {
  if (animFrame) cancelAnimationFrame(animFrame);
});
</script>

<template>
  <section
    class="flex flex-col gap-4 items-center justify-center w-full h-full"
  >
    <Transition name="bounce" mode="out-in">
      <h2
        v-if="!uiStore.showSuperiorProfile"
        class="text-center font-special z-1"
      >
        <ElementColorChangingText text="D" :change-color="progress >= 9" />
        <ElementColorChangingText text="i" :change-color="progress >= 18" />
        <ElementColorChangingText text="n" :change-color="progress >= 27" />
        <ElementColorChangingText text="e " :change-color="progress >= 36" />
        <ElementColorChangingText text="M" :change-color="progress >= 45" />
        <ElementColorChangingText text="a" :change-color="progress >= 54" />
        <ElementColorChangingText text="t" :change-color="progress >= 63" />
        <ElementColorChangingText text="c" :change-color="progress >= 72" />
        <ElementColorChangingText text="h" :change-color="progress >= 81" />
        <ElementColorChangingText text="e" :change-color="progress >= 90" />
        <ElementColorChangingText text="s" :change-color="progress >= 99" />
      </h2>
      <h2 v-else class="text-center font-special z-1 text-darkorange">
        Christian Valentin
      </h2>
    </Transition>
    <Transition name="bounce" mode="out-in">
      <div
        v-if="!uiStore.showSuperiorProfile"
        key="inferior"
        class="w-full flex flex-col gap-4 items-center overflow-hidden"
      >
        <div
          ref="scrollContainerRef"
          class="w-full overflow-auto p-4 hide-scrollbar"
        >
          <div class="min-w-min flex justify-center gap-6">
            <ElementFlippableCard
              v-for="(profile, index) in inferiorProfiles"
              :key="profile.id"
              :hide-title="isHolding"
              class="card-shake"
              :style="{
                zIndex: calculateMatchPercentage(profile),
                ...getCardStyle(index, inferiorProfiles.length),
              }"
            >
              <template #back>
                <div
                  class="flex flex-col h-full w-full text-start text-matteblack"
                >
                  <p class="font-bold">Highlights</p>
                  <ul
                    class="list-none flex flex-col gap-2 text-xs overflow-auto nice-scrollbar pb-1"
                  >
                    <li v-for="highlight in profile.highlights" class="">
                      <p>{{ highlight.title }}</p>
                      <div
                        class="w-full border"
                        :class="`border-${highlight.color}`"
                      >
                        <div
                          class="h-2"
                          :class="`bg-${highlight.color}`"
                          :style="{ width: `${highlight.value}%` }"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
              <template #title-top>
                <p>
                  {{ profile.firstName }}
                  <span class="font-bold">{{ profile.lastName }}</span>
                </p>
              </template>

              <template #front-top-left>
                <Icon
                  name="material-symbols:star-rounded"
                  class="text-matteblack text-xl"
                />
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
                <p class="text-vertical text-matteblack font-bold">
                  {{ profile.lastName }}
                </p>
                <Icon
                  name="material-symbols:star-rounded"
                  class="text-matteblack text-xl rotate-180"
                />
              </template>

              <template #title-beneath>
                <p class="font-bold text-sm">
                  {{ `${calculateMatchPercentage(profile)}% match` }}
                </p>
              </template>
            </ElementFlippableCard>
          </div>
        </div>
      </div>

      <ElementFlippableCard v-else :key="superiorProfile.id" :glow="true">
        <template #back>
          <div class="flex flex-col h-full w-full text-start text-matteblack">
            <p class="font-bold">Highlights</p>
            <ul
              class="list-none flex flex-col gap-2 text-xs overflow-auto nice-scrollbar pb-1"
            >
              <li v-for="highlight in superiorProfile.highlights" class="">
                <p>{{ highlight.title }}</p>
                <div class="w-full border" :class="`border-${highlight.color}`">
                  <div
                    class="h-2"
                    :class="`bg-${highlight.color}`"
                    :style="{ width: `${highlight.value}%` }"
                  />
                </div>
              </li>
            </ul>
          </div>
        </template>

        <template #front-top-left>
          <Icon
            name="material-symbols:star-rounded"
            class="text-darkorange text-xl cursor-pointer"
            @click="
              () => {
                uiStore.showSuperiorProfile = false;
                resetCardStyle();
              }
            "
          />
          <p class="text-vertical text-matteblack font-bold">
            {{ superiorProfile.firstName }}
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
            {{ superiorProfile.lastName }}
          </p>
          <Icon
            name="material-symbols:star-rounded"
            class="text-darkorange text-xl rotate-180"
          />
        </template>

        <template #title-beneath>
          <p class="font-bold">
            {{ `${calculateMatchPercentage(superiorProfile)}% match` }}
          </p>
        </template>
      </ElementFlippableCard>
    </Transition>

    <p
      v-if="!uiStore.showSuperiorProfile"
      class="text-center transition-opacity duration-2000"
      :class="
        showTextPartOne || uiStore.visitedAllMatches
          ? 'opacity-100'
          : 'opacity-0'
      "
    >
      {{ inferiorProfiles.length }} udemærkede matches...
      <span
        class="transition-opacity duration-2000"
        :class="
          showTextPartTwo || uiStore.visitedAllMatches
            ? 'opacity-100'
            : 'opacity-0'
        "
        >Men du er her for at finde dit
        <strong class="text-darkorange font-bold">ultimative match</strong>, er
        du ikke? Hvad hvis jeg fortalte dig, at du har evnen til
        <strong class="animate-pulse">kombinere dem alle</strong>
        og skabe netop det?</span
      >
    </p>
    <p
      v-else
      class="text-center z-1 transition-opacity duration-3000"
      :class="
        showSuccessTextPartOne || uiStore.visitedUltimateMatch
          ? 'opacity-100'
          : 'opacity-0'
      "
    >
      Sweet mother of... Det lykkedes dig!
      <span
        class="transition-opacity duration-2000"
        :class="
          showSuccessTextPartTwo || uiStore.visitedUltimateMatch
            ? 'opacity-100'
            : 'opacity-0'
        "
        >Bare mellem os to, så har jeg i årenes løb kaldt mange for
        <span class="font-bold">The Chosen One</span>, men du lever i sandhed op
        til titlen! Alle dine ønskede kvaliteter, kombineret i én person - et
        sandt 100% match. A once in a lifetime opportunity.
      </span>

      <strong
        class="transition-opacity duration-2000 text-darkorange"
        :class="
          showSuccessTextPartThree || uiStore.visitedUltimateMatch
            ? 'opacity-100'
            : 'opacity-0'
        "
      >
        <NuxtLink
          to="https://www.linkedin.com/in/christian-valentin-262206226/"
          target="_blank"
          >Dit ultimative match!</NuxtLink
        ></strong
      >
    </p>
    <div
      v-if="!uiStore.showSuperiorProfile"
      class="fixed left-0 w-full z-10 transition-[bottom] ease-in-out duration-3500"
      :class="
        showButtonHold || uiStore.visitedAllMatches
          ? 'bottom-0'
          : '-bottom-full'
      "
      @mousedown="handleHoldStart"
      @mouseup="handleHoldEnd"
      @mouseleave="handleHoldEnd"
      @touchstart="handleHoldStart"
      @touchend="handleHoldEnd"
      @touchcancel="handleHoldEnd"
    >
      <UButton
        size="lg"
        block
        class="absolute bottom-0 left-0 py-4 md:py-6 rounded-none overflow-hidden select-none"
        :class="isHolding ? '' : 'animate-pulse'"
      >
        <div
          class="absolute top-0 left-0 h-full bg-baseorange transition-all ease-linear pointer-events-none"
          :style="{
            width: progress + '%',
            transitionDuration: isHolding ? '100ms' : '0ms',
          }"
        ></div>
        <Transition name="bounce" mode="out-in">
          <span v-if="!isHolding" class="relative z-10 pointer-events-none"
            >{{ $device.isMobileOrTablet ? "Tryk" : "Klik" }} og hold</span
          >
          <span v-else class="relative z-10 pointer-events-none"
            >Kombinerer...</span
          >
        </Transition>
      </UButton>
    </div>
    <NuxtLink
      v-else-if="showButtonMore || uiStore.visitedUltimateMatch"
      to="/"
      class="fixed bottom-4 z-10 slide-and-tip"
    >
      <UButton size="lg" label="Vis mig mere!" />
    </NuxtLink>
  </section>
</template>

<style scoped>
.card-shake {
  --movement: var(--movement);
}

.slide-and-tip {
  animation: slideAndTip 6s ease-in-out forwards;
  transform-origin: bottom right;
}

@keyframes slideAndTip {
  0% {
    transform: translateX(-100vw) rotate(0deg);
  }

  40% {
    transform: rotate(50deg);
  }

  45% {
    transform: translateX(0);
  }

  80% {
    transform: translateX(0) rotate(0deg);
  }
}
</style>
