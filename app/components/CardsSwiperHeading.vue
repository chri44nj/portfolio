<script setup lang="ts">
defineProps<{
  heading: string;
  subHeading?: string;
  maximum: number;
}>();
</script>

<template>
  <div class="text-center">
    <h2>{{ heading }}</h2>
    <p v-if="subHeading">{{ subHeading }}</p>
    <p class="text-baseyellow text-xl my-2">Vælg 1-{{ maximum }}</p>
  </div>
</template>

<style scoped></style>
