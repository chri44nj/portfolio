<script setup lang="ts">
import { useCardStore } from "~/store/useCardStore";
import type { Card } from "~~/shared/types";

defineProps<{
  cards?: Card[];
}>();

const cardStore = useCardStore();
const emit = defineEmits(["toggle-select-card"]);
const animatingCards = ref<Map<string, "forward" | "backward">>(new Map());
const previousSelectedIds = ref<string[]>([...cardStore.selectedCardIds]);
const flippedCards = ref<string[]>([]);

const handleClick = (id: string) => {
  emit("toggle-select-card", id);
  if (flippedCards.value.includes(id)) {
    flippedCards.value = flippedCards.value.filter((cardId) => cardId !== id);
  }
  if (import.meta.client && window.matchMedia("(max-width: 1024px)").matches) {
    flippedCards.value = flippedCards.value.filter((cardId) => cardId === id);
  }
};

const toggleFlip = (id: string) => {
  if (flippedCards.value.includes(id)) {
    flippedCards.value = flippedCards.value.filter((cardId) => cardId !== id);
  } else {
    if (
      import.meta.client &&
      window.matchMedia("(max-width: 1024px)").matches
    ) {
      flippedCards.value = [id];
    } else {
      flippedCards.value.push(id);
    }
  }
};

const hoverFlip = (id: string, isHovering: boolean) => {
  if (isHovering) {
    if (!flippedCards.value.includes(id)) {
      flippedCards.value.push(id);
    }
  } else {
    flippedCards.value = flippedCards.value.filter((cardId) => cardId !== id);
  }
};

watch(
  () => [...cardStore.selectedCardIds],
  (newIds) => {
    const oldIds = previousSelectedIds.value;
    const added = newIds.filter((id) => !oldIds.includes(id));
    const removed = oldIds.filter((id) => !newIds.includes(id));
    added.forEach((id) => {
      animatingCards.value.set(id, "forward");
      setTimeout(() => {
        if (animatingCards.value.get(id) === "forward") {
          animatingCards.value.delete(id);
        }
      }, 700);
    });
    removed.forEach((id) => {
      animatingCards.value.set(id, "backward");
      setTimeout(() => {
        if (animatingCards.value.get(id) === "backward") {
          animatingCards.value.delete(id);
        }
      }, 700);
    });
    previousSelectedIds.value = [...newIds];
  }
);

const getAnimationClass = (cardId: string) => {
  const direction = animatingCards.value.get(cardId);
  if (direction === "forward") return "rotate-forward";
  if (direction === "backward") return "rotate-backward";
  return "";
};

const formatTextContent = (text: string): string => {
  if (!text) return "";
  let formattedText = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  formattedText = formattedText.replace(
    /_(.*?)_/g,
    '<span class="underline">$1</span>'
  );
  return formattedText;
};
</script>
<template>
  <div class="flex items-center gap-4 md:gap-6">
    <div
      v-for="card in cards"
      :key="card.id"
      class="transition-all duration-200"
      :class="{
        'opacity-50 hover:opacity-100 ': !cardStore.isCardSelected(card.id),
      }"
    >
      <div
        class="relative cursor-default transition-all duration-200 group"
        :class="[
          cardStore.isCardSelected(card.id)
            ? 'opacity-100 transform scale-105'
            : '',
          !cardStore.isCardSelected(card.id) && !flippedCards.includes(card.id)
            ? 'hover:animate-pulse focus-visible:animate-pulse'
            : '',
        ]"
        tabindex="0"
        @click="handleClick(card.id)"
        @keydown.space.prevent="handleClick(card.id)"
        @keydown.enter.prevent="handleClick(card.id)"
        @mouseleave="!$device.isMobileOrTablet && hoverFlip(card.id, false)"
      >
        <div
          class="flip-card aspect-2/3 h-[250px] md:h-[300px] bg-transparent perspective-1000"
          :class="{
            flipped: flippedCards.includes(card.id),
            'hover-flip': !$device.isMobileOrTablet,
          }"
        >
          <div
            class="flip-card-inner relative w-full h-full text-center"
            :class="
              flippedCards.includes(card.id) ? 'duration-800' : 'duration-500'
            "
          >
            <div
              class="flip-card-front absolute w-full h-full backface-hidden p-2 bg-baseparchment rounded-xl flex items-center justify-center"
            >
              <div
                class="h-full w-full border-4 border-matteblack rounded-xl bg-lightparchment"
              />
              <Icon
                v-if="card.icon"
                :name="card.icon"
                class="absolute top-1/2 left-1/2 transform transition-all duration-200 -translate-x-1/2 -translate-y-1/2 text-[3rem]"
                :class="[
                  cardStore.isCardSelected(card.id)
                    ? cardStore.categoryColor
                    : 'text-matteblack',
                  getAnimationClass(card.id),
                ]"
              />
              <div
                class="absolute top-0 right-0 pt-4 pr-4 z-10"
                @click.stop="$device.isMobileOrTablet && toggleFlip(card.id)"
                @mouseenter="
                  !$device.isMobileOrTablet && hoverFlip(card.id, true)
                "
              >
                <Icon
                  name="material-symbols:refresh-rounded"
                  class="text-xl shrink-0 opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 text-matteblack transition-all duration-200"
                  :class="{
                    'group-hover:text-2xl group-focus-visible:text-2xl':
                      !cardStore.isCardSelected(card.id),
                  }"
                />
              </div>
            </div>
            <div
              class="flip-card-back absolute w-full h-full backface-hidden bg-lightparchment rounded-xl flex flex-col items-center justify-center p-4"
            >
              <div
                v-if="$device.isMobileOrTablet"
                class="absolute top-0 right-0 pt-4 pr-4 z-10"
                @click.stop="$device.isMobileOrTablet && toggleFlip(card.id)"
              >
                <Icon
                  name="material-symbols:refresh-rounded"
                  class="text-matteblack text-xl shrink-0 transform rotate-y-180"
                />
              </div>

              <Icon
                v-if="card.icon"
                :name="card.icon"
                class="absolute top-2 left-2 transition-all duration-200 text-xl"
                :class="[
                  cardStore.isCardSelected(card.id)
                    ? cardStore.categoryColor
                    : 'text-matteblack',
                  getAnimationClass(card.id),
                ]"
              />
              <p
                class="text-matteblack text-left text-xs md:text-base italic break-normal"
                v-html="formatTextContent(card.textBack)"
              />

              <Icon
                v-if="card.icon"
                :name="card.icon"
                class="absolute bottom-2 right-2 rotate-180 transition-all duration-200 text-xl"
                :class="[
                  cardStore.isCardSelected(card.id)
                    ? cardStore.categoryColor
                    : 'text-matteblack',
                  getAnimationClass(card.id),
                ]"
              />
            </div>
          </div>
        </div>
      </div>
      <p
        class="mt-4 text-center w-full transition-all duration-200 card-name text-sm md:text-base"
        :class="{
          'opacity-100': cardStore.isCardSelected(card.id),
        }"
      >
        {{ card.heading }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-inner {
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front {
  z-index: 2;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
