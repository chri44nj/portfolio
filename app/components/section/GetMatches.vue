<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";
import { inferiorProfiles } from "~/data/profiles";
const uiStore = useUIStore();

const { handleMatchingComplete } = useMatchFlow();
const handleOnComplete = () => {
  handleMatchingComplete();
};
</script>

<template>
  <section
    class="flex flex-col gap-4 items-center justify-center w-full h-full"
  >
    <Transition name="fade" mode="out-in">
      <ElementMatchLoading
        v-if="!uiStore.matchDone"
        :on-complete="handleOnComplete"
      />
      <div
        v-else
        class="flex flex-col items-center justify-center bg-baseparchment p-4 border border-matteblack h-[400px] relative rounded-xl aspect-2/3 text-matteblack"
      >
        <div class="flex flex-col items-center gap-1 left-2 top-2 absolute">
          <Icon
            name="material-symbols:star-rounded text-darkorange"
            class="text-xl"
          />
          <p class="text-xl">
            {{ inferiorProfiles.length }}
          </p>
        </div>
        <div class="flex flex-col items-center gap-1 right-2 bottom-2 absolute">
          <p class="text-xl rotate-180">
            {{ inferiorProfiles.length }}
          </p>
          <Icon
            name="material-symbols:star-rounded text-darkorange"
            class="text-xl rotate-180"
          />
        </div>
        <p class="text-center text-2xl">
          Matches
          <span class="block">
            {{
              uiStore.showSuperiorProfile
                ? "Kombineret til det ultimative match"
                : "Fundet"
            }}
          </span>
        </p>
      </div>
    </Transition>
  </section>
</template>
