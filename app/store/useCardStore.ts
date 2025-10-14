import { skillCards, personalityCards, bonusCards } from "~/data/cards";
export const useCardStore = defineStore(
  "cardStore",
  () => {
    const allCards = [...skillCards, ...personalityCards, ...bonusCards];
    const selectedCardIds = ref<string[]>([]);
    const isCardSelected = (id: string) => selectedCardIds.value.includes(id);
    const selectedCardCount = computed(() => selectedCardIds.value.length);
    const amountOfCards = computed(() => allCards.length);

    const notSelectedCards = computed(() => {
      return allCards.filter(
        (card) => !selectedCardIds.value.includes(card.id)
      );
    });

    const notSelectedCardIds = computed(() => {
      return allCards
        .map((card) => card.id)
        .filter((id) => !selectedCardIds.value.includes(id));
    });

    const categoryCount = (prefix: string) => {
      return selectedCardIds.value.filter((id) => id.startsWith(prefix)).length;
    };

    const selectedCards = computed(() => {
      return allCards.filter((card) => selectedCardIds.value.includes(card.id));
    });

    const selectedCardsByCategory = (prefix: string) => {
      const categoryIds = selectedCardIds.value.filter((id) =>
        id.startsWith(prefix)
      );
      return allCards.filter((card) => categoryIds.includes(card.id));
    };

    const notSelectedCardsByCategory = (prefix: string) => {
      return allCards.filter(
        (card) =>
          card.id.startsWith(prefix) && !selectedCardIds.value.includes(card.id)
      );
    };

    function toggleSelectCard(id: string) {
      const index = selectedCardIds.value.indexOf(id);
      if (index !== -1) {
        selectedCardIds.value = selectedCardIds.value.filter(
          (cardId) => cardId !== id
        );
      } else {
        selectedCardIds.value.push(id);
      }
    }

    function selectCard(id: string) {
      if (!isCardSelected(id)) {
        selectedCardIds.value.push(id);
      }
    }

    function deselectCard(id: string) {
      selectedCardIds.value = selectedCardIds.value.filter(
        (cardId) => cardId !== id
      );
    }

    function clearAllSelections() {
      selectedCardIds.value = [];
    }

    function selectAllCards() {
      selectedCardIds.value = allCards.map((card) => card.id);
    }

    function clearCategory(prefix: string) {
      selectedCardIds.value = selectedCardIds.value.filter(
        (id) => !id.startsWith(prefix)
      );
    }

    function selectAllInCategory(prefix: string) {
      const categoryCardIds = allCards
        .filter((card) => card.id.startsWith(prefix))
        .map((card) => card.id);
      const cardsToAdd = categoryCardIds.filter(
        (id) => !selectedCardIds.value.includes(id)
      );
      selectedCardIds.value = [...selectedCardIds.value, ...cardsToAdd];
    }

    function clearAllInCategory(prefix: string) {
      selectedCardIds.value = selectedCardIds.value.filter(
        (id) => !id.startsWith(prefix)
      );
    }

    return {
      allCards,
      isCardSelected,
      selectedCardCount,
      amountOfCards,
      categoryCount,
      selectedCards,
      selectedCardIds,
      selectedCardsByCategory,
      notSelectedCards,
      notSelectedCardIds,
      notSelectedCardsByCategory,
      toggleSelectCard,
      selectCard,
      deselectCard,
      clearAllSelections,
      selectAllCards,
      clearCategory,
      selectAllInCategory,
      clearAllInCategory,
    };
  },
  {
    persist: true,
  }
);
