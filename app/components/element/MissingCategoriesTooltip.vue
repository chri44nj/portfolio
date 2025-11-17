<script setup>
import { useCardStore } from "~/store/useCardStore";
const cardStore = useCardStore();
</script>

<template>
  <div
    class="transition-color duration-1000 absolute bottom-full bg-darkred p-[2px] rounded text-sm"
  >
    <p class="p-4 bg-matteblack text-center rounded">
      Vælg <strong>minimum 1 kvalitet</strong> i hver kategori. Du mangler at
      vælge i
      <span
        v-for="(card, index) in cardStore.categoriesNotSelected"
        :key="card"
      >
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
  </div>
</template>
