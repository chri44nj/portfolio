<script setup lang="ts">
import { set } from "animejs";
import { ref, onMounted } from "vue";
import { useCardStore } from "~/store/useCardStore";

const cardStore = useCardStore();

defineProps<{
  heading: string;
  subHeading?: string;
  maximum: number;
}>();

const fontsReady = ref(false);

onMounted(() => {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      fontsReady.value = true;
    });
  } else {
    // fallback for older browsers
    fontsReady.value = true;
  }
});
</script>

<template>
  <div class="text-center">
    <h2
      :class="[
        fontsReady ? 'font-special' : 'font-primary ',
        cardStore.categoryColor,
      ]"
    >
      {{ heading }}
    </h2>

    <p v-if="subHeading">{{ subHeading }}</p>
  </div>
</template>

<style scoped></style>
