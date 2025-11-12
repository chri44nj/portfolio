export const useUIStore = defineStore(
  "uiStore",
  () => {
    const preferencesStep = ref(1);
    const preferencesTotalSteps = 3;
    const flowStep = ref(1);
    const flowTotalSteps = 5;
    const matchBegun = ref(false);
    const matchDone = ref(false);
    const showSuperiorProfile = ref(false);
    const showMissingCategoriesTooltip = ref(false);

    return {
      preferencesStep,
      preferencesTotalSteps,
      flowStep,
      flowTotalSteps,
      matchBegun,
      matchDone,
      showSuperiorProfile,
      showMissingCategoriesTooltip,
    };
  },
  {
    persist: {
      // Persister ikke preferencesStep
      pick: ["flowStep", "matchBegun", "matchDone"],
    },
  }
);
