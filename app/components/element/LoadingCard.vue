<script setup lang="ts">
const props = defineProps<{
  color: string;
  animationDone: boolean;
  isActive: boolean;
}>();

const animationElement = ref<HTMLElement>();
const shouldStop = ref(props.animationDone);
// Initialize as stopped (not animating) unless the card is already active
const isStopped = ref(!props.isActive || props.animationDone);

const backgroundColor = computed(() => {
  switch (props.color) {
    case "basered":
      return "bg-basered";
    case "lightblue":
      return "bg-lightblue";
    case "darkyellow":
      return "bg-darkyellow";
    case "offwhite":
    default:
      return "bg-offwhite";
  }
});

// Start animation when isActive becomes true
watch(
  () => props.isActive,
  (active) => {
    if (active && !shouldStop.value) {
      isStopped.value = false;
    }
  }
);

// Stop animation only when animationDone becomes true
watch(
  () => props.animationDone,
  (done) => {
    if (done) {
      shouldStop.value = true;
    }
  }
);

const onAnimationIteration = () => {
  if (shouldStop.value) {
    isStopped.value = true;
  }
};
</script>

<template>
  <div class="perspective">
    <div
      ref="animationElement"
      class="h-12 aspect-2/3 rounded transition-all duration-300 opacity-50"
      :class="[
        backgroundColor,
        !isStopped ? 'flipping' : 'flipping-stopped',
        animationDone && isStopped ? 'opacity-100' : '',
      ]"
      @animationiteration="onAnimationIteration"
    ></div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 120px;
}

.flipping {
  transform: rotate(0);
  animation: flip 1.5s infinite;
}

.flipping-stopped {
  transform: rotate(0);
  animation: none;
}

@keyframes flip {
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(180deg) rotateX(180deg);
  }
}
</style>
