<script lang="ts" setup>
import { inferiorProfiles } from "~/data/profiles";
import { useUIStore } from "~/store/useUIStore";
import { createAnimatable, utils } from "animejs";

const { handleNextStep } = useMatchFlow();
const handleClickNext = () => {
  handleNextStep();
};

const uiStore = useUIStore();

const cardRef = ref<HTMLElement | null>(null);
let animatableCard: any;
let bounds: DOMRect;

onMounted(() => {
  if (!cardRef.value) return;

  bounds = cardRef.value.getBoundingClientRect();
  const refreshBounds = () => (bounds = cardRef.value!.getBoundingClientRect());

  animatableCard = createAnimatable(cardRef.value, {
    x: 500,
    y: 500,
    rotateX: 500,
    rotateY: 500,
    ease: "out(3)",
  });

  const onMouseMove = (e: MouseEvent) => {
    const { width, height, left, top } = bounds;
    const hw = width / 2;
    const hh = height / 2;
    const x = utils.clamp(e.clientX - left - hw, -hw, hw);
    const y = utils.clamp(e.clientY - top - hh, -hh, hh);

    const tiltX = (y / hh) * -10;
    const tiltY = (x / hw) * 10;

    animatableCard.x(x * 0.1);
    animatableCard.y(y * 0.1);
    animatableCard.rotateX(tiltX);
    animatableCard.rotateY(tiltY);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", refreshBounds);

  onUnmounted(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", refreshBounds);
  });
});
</script>

<template>
  <div
    ref="cardRef"
    class="flex flex-col items-center justify-center p-4 border border-matteblack h-[400px] relative rounded-xl aspect-2/3 text-matteblack shadow-lg will-change-transform z-1 select-none"
    :class="
      uiStore.showSuperiorProfile ? 'bg-baseparchment' : 'bg-darkparchment'
    "
    @click="handleClickNext"
  >
    <div
      class="flex flex-col items-center gap-1 left-2 top-2 absolute text-matteblack"
    >
      <Icon name="material-symbols:star-rounded" class="text-2xl" />
      <p class="!text-xl/[1] font-bold">
        {{ uiStore.showSuperiorProfile ? "1" : inferiorProfiles.length }}
      </p>
    </div>
    <p
      class="font-special absolute -translate-y-1/2 top-1/2 text-[10rem] z-0"
      :class="
        uiStore.showSuperiorProfile ? 'text-offwhite/50' : 'text-matteblack/50'
      "
    >
      {{ uiStore.showSuperiorProfile ? "1" : inferiorProfiles.length }}
    </p>
    <div
      class="flex flex-col items-center gap-1 right-2 bottom-2 absolute text-matteblack"
    >
      <p class="!text-xl/[1] font-bold rotate-180">
        {{ uiStore.showSuperiorProfile ? "1" : inferiorProfiles.length }}
      </p>
      <Icon name="material-symbols:star-rounded" class="text-2xl rotate-180" />
    </div>

    <p class="text-center text-xl z-1 font-bold">
      {{ uiStore.showSuperiorProfile ? "Alle matches" : "Matches" }}
      <span
        :class="
          uiStore.showSuperiorProfile
            ? 'line-through decoration-offwhite decoration-4'
            : ''
        "
      >
        fundet
      </span>

      <span v-if="uiStore.showSuperiorProfile" class="block">
        <span class="text-offwhite font-satisfy">kombineret</span> til det
        ultimative match
      </span>
    </p>
  </div>
</template>

<style scoped>
div[ref="cardRef"] {
  transform-style: preserve-3d;
}
</style>
