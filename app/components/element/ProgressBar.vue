<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";
const uiStore = useUIStore();
const flowStepText = computed(() => {
  switch (uiStore.flowStep) {
    case 2:
      return "Vælg de egenskaber, du leder efter i en kandidat";
    case 3:
      return "Gennemse egenskaberne";
    case 4:
      return "Bliv matchet med de rigtige kandidater til jobbet";
    case 5:
      return "Hiv fat i den rigtige kandidat";
    default:
      return "";
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-2 text-center">
    <div class="flex items-center">
      <div
        class="rounded-full w-4 h-4 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 2 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 3 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="rounded-full w-4 h-4 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 3 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 4 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="rounded-full w-4 h-4 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 4 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="h-[1px] w-8 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 5 ? 'opacity-100' : 'opacity-25'"
      />
      <div
        class="rounded-full w-4 h-4 transition-all duration-200 bg-whitesilver"
        :class="uiStore.flowStep >= 5 ? 'opacity-100' : 'opacity-25'"
      />
    </div>
    <p class="px-12 text-sm opacity-75">{{ flowStepText }}</p>
  </div>
</template>

<style scoped></style>
