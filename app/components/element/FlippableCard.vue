<script setup lang="ts">
const props = defineProps<{
  hideTitle?: boolean;
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
    <div
      class="flip-card aspect-2/3 border rounded-xl border-matteblack h-[250px] md:h-[300px] bg-transparent perspective-1000 relative group cursor-pointer group z-1"
      :class="{ flipped }"
      tabindex="0"
      @mouseleave="handleMouseLeave"
    >
      <div
        class="flip-card-inner relative w-full h-full text-center transition-transform duration-700 transform-style-3d"
      >
        <div
          class="flip-card-front absolute w-full h-full backface-hidden rounded-xl bg-baseparchment flex items-center justify-center"
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
            class="absolute top-0 right-0 pt-2 pr-2 opacity-50 group-hover:opacity-100 transition-all duration-200"
            @mouseenter="handleMouseEnter"
            @click.stop="$device.isMobileOrTablet && toggleFlip()"
          >
            <Icon
              name="material-symbols:refresh-rounded"
              class="text-xl opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 text-matteblack"
            />
          </div>
        </div>

        <!-- Back side -->
        <div
          class="flip-card-back absolute w-full h-full backface-hidden rounded-xl bg-lightparchment p-4 flex flex-col justify-between transform rotate-y-180"
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
      class="mt-4 text-center w-full transition-all duration-300 card-name text-sm md:text-base"
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
</style>
