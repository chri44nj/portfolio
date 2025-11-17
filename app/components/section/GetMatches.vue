<script lang="ts" setup>
import { useUIStore } from "~/store/useUIStore";

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
    <!-- Fireworks background layer -->

    <!-- Foreground UI -->
    <Transition name="fade" mode="out-in">
      <ElementMatchLoading
        v-if="!uiStore.matchDone"
        :on-complete="handleOnComplete"
      />
      <ElementRotateableCard v-else />
    </Transition>
  </section>
</template>
