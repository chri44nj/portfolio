<script setup lang="ts">
import type { ControlItem } from "~~/shared/types";

defineProps<{
  controls: ControlItem[];
  height?: string;
  text?: string;
}>();
</script>

<template>
  <div
    class="flex items-center justify-between w-full flex-col md:flex-row gap-2"
  >
    <div class="flex items-center gap-2 h-8">
      <template v-for="(control, index) in controls" :key="index">
        <!-- For regular elements (text or icon) with background -->
        <div
          v-if="control.type === 'text' || control.type === 'icon'"
          class="px-2 rounded flex items-center bg-whitesilver text-matteblack"
          :class="[height || 'h-full', control.customClass]"
        >
          <!-- Text content -->
          <template v-if="control.type === 'text'">
            {{ control.content }}
          </template>

          <!-- Icon content -->
          <Icon v-else-if="control.type === 'icon'" :name="control.content" />
        </div>

        <!-- For separator (no background) -->
        <span
          v-else-if="control.type === 'separator'"
          :class="control.customClass"
        >
          {{ control.content }}
        </span>
      </template>
    </div>

    <p v-if="text">{{ text }}</p>
  </div>
</template>
