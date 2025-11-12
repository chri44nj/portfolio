<script setup lang="ts">
const props = defineProps<{
  color: string;
  animationDone: boolean;
  isActive: boolean;
}>();

const animationElement = ref<HTMLElement>();
const shouldStop = ref(props.animationDone);
const isStopped = ref(props.animationDone);

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

watch(
  () => props.animationDone,
  (done) => {
    shouldStop.value = done;
    if (done) isStopped.value = true;
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
      class="h-12 aspect-2/3 rounded transition-all duration-300"
      :class="[
        backgroundColor,
        props.isActive && !isStopped ? 'flipping' : 'flipping-stopped',
        !isStopped ? 'opacity-50' : 'opacity-100',
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
  animation: flip 2s infinite;
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
