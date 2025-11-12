<script setup>
import { useCardStore } from "~/store/useCardStore";
const cardStore = useCardStore();
</script>

<template>
  <p
    class="p-4 bg-matteblack mx-4 text-center rounded ring transition-color duration-1000 absolute bottom-full ring-offwhite"
  >
    Vælg <strong>minimum 1 kvalitet</strong> i hver kategori. Du mangler at
    vælge i
    <span v-for="(card, index) in cardStore.categoriesNotSelected" :key="card">
      <span
        :class="
          card === 'kompetencer'
            ? 'text-lightblue'
            : card === 'personlighed'
            ? 'text-basered'
            : 'text-darkyellow'
        "
        >{{ card }} </span
      ><span>{{
        index === 0 && cardStore.categoriesNotSelected.length === 3
          ? ", "
          : index + 1 !== cardStore.categoriesNotSelected.length
          ? " og "
          : "."
      }}</span>
    </span>
  </p>
</template>
