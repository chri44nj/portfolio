import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
export function useMatchFlow() {
  const cardStore = useCardStore();
  const uiStore = useUIStore();
  const handleStep = (direction: "next" | "previous") => {
    if (direction === "next") {
      if (uiStore.preferencesStep === 3) {
        uiStore.preferencesStep = 1;
      } else {
        uiStore.preferencesStep += 1;
      }
    } else {
      if (uiStore.preferencesStep === 1) {
        uiStore.preferencesStep = 3;
      } else {
        uiStore.preferencesStep -= 1;
      }
    }
  };
  const getCurrentCategoryPrefix = (): string => {
    switch (uiStore.preferencesStep) {
      case 1:
        return "skill-";
      case 2:
        return "personality-";
      case 3:
        return "bonus-";
      default:
        return "";
    }
  };
  const handleNextStep = () => {
    if (uiStore.flowStep === uiStore.flowTotalSteps) return;
    uiStore.flowStep++;
  };
  const handlePreviousStep = () => {
    if (uiStore.flowStep === 1) return;
    uiStore.flowStep--;
  };
  const beginMatch = (customBeginMatchFn?: () => void) => {
    if (customBeginMatchFn) {
      customBeginMatchFn();
    }
  };
  const handleMatchingComplete = () => {
    if (!uiStore.matchBegun) return;
    uiStore.matchDone = true;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      handleNextStep();
      return;
    }
    if (event.ctrlKey && event.key === "Backspace") {
      event.preventDefault();
      handlePreviousStep();
      return;
    }
    if (uiStore.flowStep === 1) return;
    if (event.ctrlKey && event.shiftKey) {
      const prefix = getCurrentCategoryPrefix();
      switch (event.key) {
        case "a":
        case "A":
          event.preventDefault();
          cardStore.selectAllInCategory(prefix);
          break;
        case "c":
        case "C":
          event.preventDefault();
          cardStore.clearAllInCategory(prefix);
          break;
      }
      return;
    }
    if (event.ctrlKey) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleStep("previous");
          break;
        case "ArrowRight":
          event.preventDefault();
          handleStep("next");
          break;
        case "c":
        case "C":
          event.preventDefault();
          cardStore.clearAllSelections();
          break;
        case "a":
        case "A":
          event.preventDefault();
          cardStore.selectAllCards();
          break;
      }
    }
  };
  const setupKeyboardListeners = () => {
    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  };

  return {
    handleStep,
    handlePreviousStep,
    handleNextStep,
    getCurrentCategoryPrefix,
    beginMatch,
    handleMatchingComplete,
    handleKeyDown,
    setupKeyboardListeners,
  };
}
