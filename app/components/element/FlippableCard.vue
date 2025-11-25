<script setup lang="ts">
const props = defineProps<{
  hideTitle?: boolean;
  glow?: boolean;
}>();

const flipped = ref(false);
const toggleFlip = () => {
  flipped.value = !flipped.value;
};

// Handle mobile vs desktop hover/tap logic
const { isMobileOrTablet } = useDevice();

const handleMouseEnter = () => {
  if (!isMobileOrTablet) flipped.value = true;
};

const handleMouseLeave = () => {
  if (!isMobileOrTablet) flipped.value = false;
};
</script>

<template>
  <div>
    <p
      class="mb-2 text-center w-full transition-all duration-1000 card-name text-sm"
      :class="hideTitle ? '!text-transparent' : 'text-offwhite'"
    >
      <slot name="title-top"></slot>
    </p>
    <div
      class="flip-card aspect-2/3 rounded-xl h-[250px] md:h-[300px] bg-transparent perspective-1000 relative group cursor-pointer group z-1"
      :class="{ flipped, 'has-glow': glow }"
      tabindex="0"
      @mouseleave="handleMouseLeave"
    >
      <!-- Animated glow layers -->
      <div v-if="glow" class="glow-container">
        <div class="glow-layer glow-layer-1"></div>
        <div class="glow-layer glow-layer-2"></div>
        <div class="glow-layer glow-layer-3"></div>
      </div>

      <div
        class="flip-card-inner relative w-full h-full text-center transition-transform duration-700 transform-style-3d"
      >
        <div
          class="flip-card-front absolute w-full h-full backface-hidden rounded-xl bg-baseparchment flex items-center justify-center"
          :class="glow ? '' : 'border-matteblack border'"
        >
          <!-- Top-left slot -->
          <div class="flex flex-col items-center gap-1 absolute top-2 left-2">
            <slot name="front-top-left"></slot>
          </div>
          <!-- Center slot -->
          <div class="flex justify-center items-center text-center grow">
            <slot name="front-center"></slot>
          </div>

          <!-- Bottom-right slot -->
          <div
            class="flex flex-col items-center gap-1 absolute bottom-2 right-2"
          >
            <slot name="front-bottom-right"></slot>
          </div>
          <div
            class="absolute top-0 right-0 pt-2 pr-2 opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200"
            @mouseenter="handleMouseEnter"
            @click.stop="$device.isMobileOrTablet && toggleFlip()"
          >
            <Icon
              name="material-symbols:refresh-rounded"
              class="text-xl text-matteblack"
            />
          </div>
        </div>

        <!-- Back side -->
        <div
          class="flip-card-back absolute w-full h-full backface-hidden rounded-xl bg-lightparchment p-4 flex flex-col justify-between transform rotate-y-180"
          :class="glow ? '' : 'border-matteblack border'"
        >
          <div
            v-if="$device.isMobileOrTablet"
            class="absolute top-0 right-0 pt-2 pr-2 opacity-50 group-hover:opacity-100 transition-all duration-200"
            @click.stop="toggleFlip()"
          >
            <Icon
              name="material-symbols:refresh-rounded"
              class="text-xl opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 text-matteblack rotate-y-180"
            />
          </div>
          <slot name="back"></slot>
        </div>
      </div>
    </div>
    <p
      class="mt-2 text-center w-full transition-all duration-1000 card-name text-sm md:text-base"
      :class="hideTitle ? 'text-transparent' : 'text-offwhite'"
    >
      <slot name="title-beneath"></slot>
    </p>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front {
  z-index: 2;
}

/* Glow effect styles */
.glow-container {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  z-index: 0;
}

.glow-layer {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  filter: blur(30px);
  opacity: 0.7;
}

.glow-layer-1 {
  background: radial-gradient(
    ellipse 140% 100% at 50% 50%,
    rgba(217, 106, 46, 0.9) 0%,
    rgba(217, 106, 46, 0.6) 35%,
    transparent 70%
  );
  animation: glow-pulse-1 1.5s ease-in-out infinite;
}

.glow-layer-2 {
  background: radial-gradient(
    ellipse 130% 95% at 50% 50%,
    rgba(255, 130, 70, 0.8) 0%,
    rgba(217, 106, 46, 0.5) 40%,
    transparent 70%
  );
  animation: glow-pulse-2 1.5s ease-in-out infinite;
  animation-delay: -1s;
}

.glow-layer-3 {
  background: radial-gradient(
    ellipse 135% 98% at 50% 50%,
    rgba(217, 106, 46, 0.7) 0%,
    rgba(255, 140, 80, 0.4) 38%,
    transparent 68%
  );
  animation: glow-pulse-3 1.5s ease-in-out infinite;
  animation-delay: -2s;
}

@keyframes glow-pulse-1 {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.9;
  }
}

@keyframes glow-pulse-2 {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.85;
  }
}

@keyframes glow-pulse-3 {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.65;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Ensure glow appears behind the card */
.has-glow .flip-card-inner {
  position: relative;
  z-index: 1;
}
</style>
