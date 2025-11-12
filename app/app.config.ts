export default defineAppConfig({
  ui: {
    strategy: "merge",
    colors: {
      /*     primary: "matteblack",
      neutral: "offwhite", */
    },
    button: {
      slots: {
        base: [
          "disabled:opacity-25 aria-disabled:opacity-25",
          "transition-all",
        ],
        compoundVariants: [
          {
            color: "primary",
            variant: "solid",
            class:
              "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          },
          {
            color: "primary",
            variant: "outline",
            class:
              "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          },
        ],
      },
    },
  },
});
