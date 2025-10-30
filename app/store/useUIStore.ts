export const useUIStore = defineStore(
  "uiStore",
  () => {
    const preferencesStep = ref(1);
    const preferencesTotalSteps = 3;
    const flowStep = ref(1);
    const flowTotalSteps = 4;
    const matchBegun = ref(false);
    const matchDone = ref(false);

    return {
      preferencesStep,
      preferencesTotalSteps,
      flowStep,
      flowTotalSteps,
      matchBegun,
      matchDone,
    };
  },
  {
    persist: {
      // Persister ikke preferencesStep
      pick: ["flowStep", "viewingCandidates"],
    },
  }
);
