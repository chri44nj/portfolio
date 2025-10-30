<script lang="ts" setup>
import type { ControlItem } from "~~/shared/types";
import { useUIStore } from "~/store/useUIStore";
const uiStore = useUIStore();
const showingTips = ref(false);

const keyboardShortcut1: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "icon",
    content: "material-symbols:arrow-back-rounded",
  },
  { type: "separator", content: "/" },
  {
    type: "icon",
    content: "material-symbols:arrow-forward-rounded",
  },
];
const keyboardShortcut2: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "A",
  },
];
const keyboardShortcut3: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  { type: "text", content: "Shift" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "A",
  },
];
const keyboardShortcut4: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "C",
  },
];
const keyboardShortcut5: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  { type: "text", content: "Shift" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "C",
  },
];
const keyboardShortcut6: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "Enter",
  },
];
const keyboardShortcut7: ControlItem[] = [
  { type: "text", content: "Ctrl" },
  { type: "separator", content: "+" },
  {
    type: "text",
    content: "Backspace",
  },
];
</script>

<template>
  <UModal title="Tastaturgenveje">
    <UButton
      icon="material-symbols:question-mark-rounded"
      variant="outline"
      @click="showingTips = !showingTips"
    />
    <template #content>
      <section class="p-4 flex flex-col gap-4">
        <div v-if="!$device.isMobileOrTablet" class="flex flex-col gap-4">
          <h4 class="text-center">Tastaturgenveje</h4>
          <ElementKeyboardControl
            :controls="keyboardShortcut1"
            text="Tidligere/næste kategori"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut2"
            text="Vælg alle egenskaber"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut3"
            text="Vælg alle egenskaber i kategorien"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut4"
            text="Ryd valgte egenskaber"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut5"
            text="Ryd valgte egenskaber i kategorien"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut6"
            text="Fortsæt"
          />
          <ElementKeyboardControl
            :controls="keyboardShortcut7"
            text="Gå tilbage"
          />
        </div>
      </section>
    </template>
  </UModal>
</template>

<style scoped></style>
