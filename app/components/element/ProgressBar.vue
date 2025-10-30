<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";
const uiStore = useUIStore();
</script>

<template>
  <div class="flex items-center">
    <div
      class="rounded-full w-4 h-4 transition-all duration-200"
      :class="uiStore.flowStep >= 2 ? 'bg-basered' : 'bg-offwhite opacity-75'"
    />
    <div
      class="h-[1px] w-8 transition-all duration-200"
      :class="uiStore.flowStep >= 3 ? 'bg-basered' : 'bg-offwhite opacity-75'"
    />
    <div
      class="rounded-full w-4 h-4 transition-all duration-200"
      :class="uiStore.flowStep >= 3 ? 'bg-basered' : 'bg-offwhite opacity-75'"
    />
    <div
      class="h-[1px] w-8 transition-all duration-200"
      :class="uiStore.flowStep >= 4 ? 'bg-basered' : 'bg-offwhite opacity-75'"
    />

    <div
      class="rounded-full w-4 h-4 transition-all duration-200"
      :class="uiStore.flowStep >= 4 ? 'bg-basered' : 'bg-offwhite opacity-75'"
    />
  </div>
</template>

<style scoped></style>
