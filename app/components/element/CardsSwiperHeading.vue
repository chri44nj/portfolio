<script setup lang="ts">
import { useCardStore } from "~/store/useCardStore";
const cardStore = useCardStore();
defineProps<{
  heading: string;
  subHeading?: string;
  maximum: number;
}>();
</script>

<template>
  <div class="text-center">
    <h2 class="font-special" :class="cardStore.categoryColor">
      {{ heading }}
    </h2>
    <p v-if="subHeading">{{ subHeading }}</p>
  </div>
</template>

<style scoped></style>
