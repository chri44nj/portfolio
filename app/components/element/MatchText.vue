<script lang="ts" setup>
import { useCardStore } from "~/store/useCardStore";
import { computed } from "vue";

const props = defineProps<{
  textColor: "lightblue" | "basered" | "darkyellow";
  cardType: "skill" | "personality" | "bonus";
  textFirst: string;
  textSecond?: string;
  highlightedWord: string;
  textAltFirst: string;
  textAltSecond: string;
  highlightedAltWord?: string;
}>();

const emit = defineEmits(["hover-card", "leave-card", "select-card"]);
const cardStore = useCardStore();

const cards = computed(() => {
  switch (props.cardType) {
    case "skill":
      return cardStore.selectedSkillCards;
    case "personality":
      return cardStore.selectedPersonalityCards;
    case "bonus":
      return cardStore.selectedBonusCards;
    default:
      return [];
  }
});

const textColorClass = computed(() => {
  return `text-${props.textColor}`;
});

const hoverClasses = computed(() => {
  return {
    "hover:text-lightblue": props.textColor === "lightblue",
    "hover:text-basered": props.textColor === "basered",
    "hover:text-darkyellow": props.textColor === "darkyellow",
  };
});

const handleHoverCard = (id: string) => {
  emit("hover-card", id);
};

const handleLeaveCard = (id: string) => {
  emit("leave-card", id);
};

const handleSelection = (id: string) => {
  emit("select-card", id);
};
</script>

<template>
  <div class="flex md:flex-row flex-col items-center gap-2 w-full max-w-[60ch]">
    <p class="md:order-1">
      <template v-if="cards.length">
        {{ textFirst }}
        <strong :class="textColorClass">{{ highlightedWord }} </strong>
        {{ textSecond }}
      </template>
      <template v-else>
        {{ textAltFirst }}
        <strong :class="textColorClass">{{ highlightedAltWord }}? </strong>
        &nbsp;{{ textAltSecond }}
      </template>

      <TransitionGroup name="text" appear>
        <span
          v-for="(card, index) in cards"
          :key="card.id"
          class="transition-colors duration-200 cursor-default"
          :class="hoverClasses"
          @mouseenter="handleHoverCard(card.id)"
          @mouseleave="handleLeaveCard(card.id)"
          @click="handleSelection(card.id)"
        >
          {{
            index === cards.length - 1 && cards.length > 1
              ? `og ${card.text}.`
              : index === cards.length - 1 && cards.length === 1
              ? ` ${card.text}.`
              : index === cards.length - 2
              ? ` ${card.text} `
              : ` ${card.text}, `
          }}
        </span>
      </TransitionGroup>
    </p>
    <div
      class="flex items-center w-full md:w-fit transition-all duration-200"
      :class="cards.length ? 'opacity-100' : 'opacity-50'"
    >
      <div class="md:hidden w-full h-[1px] bg-offwhite" />
      <div class="w-5 md:w-6 mx-2 md:mx-0 flex items-center">
        <Transition name="icon"
          ><Icon
            v-if="cards.length"
            class="shrink-0 text-xl md:text-2xl"
            :name="'material-symbols:check-circle-rounded'"
          />
          <Icon
            v-else
            class="shrink-0 text-xl md:text-2xl"
            :name="'material-symbols:cancel-rounded'"
          />
        </Transition>
      </div>
      <div class="md:hidden w-full h-[1px] bg-offwhite" />
    </div>
  </div>
</template>
