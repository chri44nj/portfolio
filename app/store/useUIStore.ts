export const useUIStore = defineStore(
  "uiStore",
  () => {
    const hasBegun = ref(false);
    const isPreviewing = ref(false);

    return {
      hasBegun,
      isPreviewing,
    };
  },
  {
    persist: true,
  }
);
