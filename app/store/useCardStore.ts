import { skillCards, personalityCards, bonusCards } from "~/data/cards";
import { useUIStore } from "./useUIStore";

export const useCardStore = defineStore(
  "cardStore",
  () => {
    const uiStore = useUIStore();
    const allCards = [...skillCards, ...personalityCards, ...bonusCards];
    const selectedCardIds = ref<string[]>([]);

    const selectedSkillCards = computed(() => {
      return skillCards.filter((card) =>
        selectedCardIds.value.includes(card.id)
      );
    });

    const selectedPersonalityCards = computed(() => {
      return personalityCards.filter((card) =>
        selectedCardIds.value.includes(card.id)
      );
    });

    const selectedBonusCards = computed(() => {
      return bonusCards.filter((card) =>
        selectedCardIds.value.includes(card.id)
      );
    });

    const categoriesNotSelected = computed(() => {
      const notSelected: string[] = [];

      if (selectedSkillCards.value.length === 0) {
        notSelected.push("kompetencer");
      }
      if (selectedPersonalityCards.value.length === 0) {
        notSelected.push("personlighed");
      }
      if (selectedBonusCards.value.length === 0) {
        notSelected.push("bonusser");
      }

      return notSelected;
    });

    const allCategoriesSelected = computed(() => {
      return (
        selectedSkillCards.value.length > 0 &&
        selectedPersonalityCards.value.length > 0 &&
        selectedBonusCards.value.length > 0
      );
    });

    const isCardSelected = (id: string) => selectedCardIds.value.includes(id);
    const selectedCardCount = computed(() => selectedCardIds.value.length);
    const amountOfCards = computed(() => allCards.length);
    const currentCategoryCards = computed(() => {
      const step = uiStore.preferencesStep;
      switch (step) {
        case 1:
          return skillCards;
        case 2:
          return personalityCards;
        case 3:
          return bonusCards;
        default:
          return [];
      }
    });
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
    const currentCategoryHasSelection = computed(() => {
      const step = uiStore.preferencesStep;
      switch (step) {
        case 1:
          return categoryCount("skill") > 0;
        case 2:
          return categoryCount("personality") > 0;
        case 3:
          return categoryCount("bonus") > 0;
        default:
          return false;
      }
    });
    const nextCategoryHasNoSelection = computed(() => {
      const currentStep = uiStore.preferencesStep;
      const nextStep = currentStep === 3 ? 1 : currentStep + 1;

      switch (nextStep) {
        case 1:
          return categoryCount("skill") === 0;
        case 2:
          return categoryCount("personality") === 0;
        case 3:
          return categoryCount("bonus") === 0;
        default:
          return false;
      }
    });

    const previousCategoryHasNoSelection = computed(() => {
      const currentStep = uiStore.preferencesStep;
      const prevStep = currentStep === 1 ? 3 : currentStep - 1;

      switch (prevStep) {
        case 1:
          return categoryCount("skill") === 0;
        case 2:
          return categoryCount("personality") === 0;
        case 3:
          return categoryCount("bonus") === 0;
        default:
          return false;
      }
    });
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

    const categoryColor = computed(() => {
      switch (uiStore.preferencesStep) {
        case 1:
          return "text-lightblue";
        case 2:
          return "text-basered";
        case 3:
          return "text-darkyellow";
        default:
          return "text-white";
      }
    });

    return {
      allCards,
      isCardSelected,
      selectedCardCount,
      amountOfCards,
      currentCategoryCards,
      categoryCount,
      currentCategoryHasSelection,
      previousCategoryHasNoSelection,
      nextCategoryHasNoSelection,
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
      selectedSkillCards,
      selectedPersonalityCards,
      selectedBonusCards,
      categoriesNotSelected,
      allCategoriesSelected,
      categoryColor,
    };
  },
  {
    persist: true,
  }
);
