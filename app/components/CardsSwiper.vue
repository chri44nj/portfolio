<script setup lang="ts">
import { useCardStore } from "~/store/useCardStore";
import type { Cards } from "~~/shared/types";
const cardStore = useCardStore();

defineProps<{
  cards?: Cards[];
}>();

const emit = defineEmits(["toggle-select-card"]);

const handleClick = (id: string) => {
  emit("toggle-select-card", id);
};
</script>

<template>
  <div class="flex items-center gap-6">
    <div v-for="card in cards" :key="card.id" tabindex="0">
      <div
        class="relative transition-all duration-200 min-w-[200px] cursor-default"
        :class="{
          'opacity-50 hover:opacity-100': !cardStore.isCardSelected(card.id),
          'opacity-100   transform scale-105': cardStore.isCardSelected(
            card.id
          ),
        }"
        @click="handleClick(card.id)"
        @keydown.space.prevent="handleClick(card.id)"
        @keydown.enter.prevent="handleClick(card.id)"
      >
        <img
          :src="card.imgSrc"
          alt="A card"
          width="200"
          height="300"
          class="rounded-lg"
          draggable="false"
        />
        <Icon
          v-if="card.icon"
          :name="card.icon"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-matteblack text-[3rem]"
        />
      </div>
      <p
        class="mt-4 text-center w-full transition-all duration-200 card-name opacity-50"
        :class="{
          'opacity-100': cardStore.isCardSelected(card.id),
        }"
      >
        {{ card.heading }}
      </p>
    </div>
  </div>
</template>
