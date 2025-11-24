<script lang="ts" setup>
import { useCardStore } from "~/store/useCardStore";
const { isMobileOrTablet } = useDevice();
const cardStore = useCardStore();

const handleSelection = (id: string) => {
  cardStore.toggleSelectCard(id);
  handleLeaveCard(id);
};

const hoveredCards = ref(new Map());

const handleHoverCard = (id: string) => {
  const newMap = new Map(hoveredCards.value);
  newMap.set(id, true);
  hoveredCards.value = newMap;
};

const handleLeaveCard = (id: string) => {
  const newMap = new Map(hoveredCards.value);
  newMap.delete(id);
  hoveredCards.value = newMap;
};
</script>

<template>
  <section
    class="grid md:grid-cols-2 gap-8 pt-2 md:gap-16 justify-center md:grow"
  >
    <div class="flex flex-col text-center md:text-start w-fit gap-4">
      <h3 class="text-center md:text-start !text-xl">Du søger</h3>
      <TransitionGroup name="fade" appear>
        <ElementMatchText
          key="1"
          text-color="lightblue"
          card-type="skill"
          text-first="En"
          text-second="kollega der"
          highlighted-word="kompetent"
          text-alt-first="En med solide"
          text-alt-second="Vælg minimum 1 kompetence."
          highlighted-alt-word="kompetencer"
          :hovered-cards="hoveredCards"
          class="mb-2"
          @hover-card="handleHoverCard"
          @leave-card="handleLeaveCard"
          @select-card="handleSelection"
        />

        <ElementMatchText
          key="2"
          text-color="basered"
          card-type="personality"
          text-first="En kontormakker med"
          text-second="der er"
          highlighted-word="personlighed"
          text-alt-first="En der har en fantastisk"
          text-alt-second="Vælg minimum 1 karaktertræk."
          highlighted-alt-word="personlighed"
          :hovered-cards="hoveredCards"
          class="mb-2"
          @hover-card="handleHoverCard"
          @leave-card="handleLeaveCard"
          @select-card="handleSelection"
        />

        <ElementMatchText
          key="3"
          text-color="darkyellow"
          card-type="bonus"
          text-first="En der som"
          highlighted-word="bonus"
          text-alt-first="En med fede quirks som"
          text-alt-second="Vælg minimum 1 bonus."
          highlighted-alt-word="bonus"
          :hovered-cards="hoveredCards"
          class="mb-2"
          @hover-card="handleHoverCard"
          @leave-card="handleLeaveCard"
          @select-card="handleSelection"
        />
      </TransitionGroup>
    </div>
    <div class="flex flex-col items-center text-center w-full gap-4 md:gap-8">
      <div>
        <h3 class="mb-4 !text-xl">Valgte &nbsp;kvaliteter</h3>
        <div class="flex gap-4 flex-wrap justify-center">
          <TransitionGroup name="list" appear>
            <div
              v-for="card in cardStore.selectedCards"
              :key="card.id"
              class="!md:text-[1.25rem] md:px-4 md:py-2 px-2 py-1 rounded cursor-default transition-all duration-200 hover:opacity-75"
              :class="[
                card.step === 1
                  ? 'bg-lightblue'
                  : card.step === 2
                  ? 'bg-basered'
                  : 'bg-darkyellow',
                hoveredCards.get(card.id) ? 'animate-pulse scale-110' : '',
              ]"
              @mouseenter="!isMobileOrTablet && handleHoverCard(card.id)"
              @mouseleave="!isMobileOrTablet && handleLeaveCard(card.id)"
              @click="handleSelection(card.id)"
            >
              {{ card.heading }}
            </div>
          </TransitionGroup>
          <p v-if="cardStore.selectedCards.length === 0">
            Vælg de kvaliteter, der bedst repræsenterer den kollega du søger og
            bliv hurtigt matchet med en række spændende kandidater!
          </p>
        </div>
      </div>
      <div v-if="cardStore.notSelectedCardIds.length">
        <p class="mb-4 !text-lg">
          Ikke valgt{{ cardStore.notSelectedCardIds.length > 1 ? "e" : "" }}
        </p>
        <div class="flex gap-4 flex-wrap justify-center">
          <TransitionGroup name="list" appear>
            <div
              v-for="card in cardStore.notSelectedCards"
              :key="card.id"
              class="!md:text-[1rem] md:px-4 md:py-2 px-2 py-1 rounded opacity-50 hover:opacity-75 transition-all duration-200 border-1 cursor-default"
              :class="
                card.step === 1
                  ? 'border-lightblue hover:bg-lightblue'
                  : card.step === 2
                  ? 'border-basered hover:bg-basered'
                  : 'border-darkyellow hover:bg-darkyellow'
              "
              @mouseenter="!isMobileOrTablet && handleHoverCard(card.id)"
              @mouseleave="!isMobileOrTablet && handleLeaveCard(card.id)"
              @click="handleSelection(card.id)"
            >
              {{ card.heading }}
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
