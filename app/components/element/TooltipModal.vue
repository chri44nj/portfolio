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
  <UModal
    title="Navigationshjælp"
    description="Hurtig hjælp til navigation for brugeren."
  >
    <UButton
      icon="material-symbols:question-mark-rounded"
      variant="outline"
      @click="showingTips = !showingTips"
    />
    <template #content>
      <section class="p-8 flex flex-col gap-8 overflow-auto">
        <div class="flex flex-col gap-4">
          <Transition name="fade" mode="out-in">
            <div v-if="uiStore.flowStep === 2" class="text-center">
              <h4 class="text-center mb-2 !text-xl">Vælg kvaliteter</h4>
              <p class="text-sm">
                Vælg <strong>minimum 1 kvalitet</strong> (og så mange du vil)
                fra hver af de 3 kategorier af kort, der bedst repræsenterer
                <strong>din næste drømmekollega</strong>.
              </p>
            </div>
            <div v-else-if="uiStore.flowStep === 3" class="text-center">
              <h4 class="text-center mb-2 !text-xl">Bekræft kvaliteter</h4>
              <p class="text-sm">
                Gennemse <strong>dine valgte kvaliteter</strong> og bekræft, at
                det er dem du leder efter i
                <strong>din næste drømmekollega</strong> ved at klikke på
                <strong>match</strong>.
              </p>
            </div>
            <div v-else-if="uiStore.flowStep === 4" class="text-center">
              <h4 class="text-center mb-2 !text-xl">Find matches</h4>
              <p class="text-sm">
                Læn dig tilbage imens vores superavancerede algoritme
                <strong>matcher dig med en række kandidater</strong>, baseret på
                <strong>dine valgte kvaliteter</strong>.
              </p>
            </div>
            <div v-else-if="uiStore.flowStep === 5" class="text-center">
              <h4 class="text-center mb-2 !text-xl">
                Lav det ultimative match
              </h4>
              <p class="text-sm">
                {{ $device.isMobileOrTablet ? "Tryk" : "Klik" }} og hold på
                knappen, for at <strong>skabe den ultimative kandidat</strong>,
                ud af de bedste kvaliteter fra <strong>dine matches</strong>.
              </p>
            </div>
          </Transition>
        </div>
        <div v-if="!$device.isMobileOrTablet">
          <h4 class="text-center mb-2 !text-xl">Tastaturgenveje</h4>
          <div class="flex flex-col gap-4">
            <ElementKeyboardControl
              :controls="keyboardShortcut1"
              text="Tidligere/næste kategori"
            />
            <ElementKeyboardControl
              :controls="keyboardShortcut2"
              text="Vælg alle kvaliteter"
            />
            <ElementKeyboardControl
              :controls="keyboardShortcut3"
              text="Vælg alle kvaliteter i kategorien"
            />
            <ElementKeyboardControl
              :controls="keyboardShortcut4"
              text="Ryd valgte kvaliteter"
            />
            <ElementKeyboardControl
              :controls="keyboardShortcut5"
              text="Ryd valgte kvaliteter i kategorien"
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
        </div>
      </section>
    </template>
  </UModal>
</template>

<style scoped></style>
