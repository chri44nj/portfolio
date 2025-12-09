<script setup lang="ts">
const props = defineProps<{
  id: string;
  name: string;
  value: string;
  label: string;
  modelValue: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="flex items-center justify-center z-100">
    <label :for="id" class="flex flex-col gap-2 items-center cursor-pointer">
      <span class="font-medium">{{ label }}</span>

      <div class="radio-wrapper">
        <input
          :id="id"
          type="radio"
          :name="name"
          :value="value"
          :checked="modelValue === value"
          class="radio-input"
          @change="emit('update:modelValue', value)"
        />

        <div class="radio-box">
          <Icon name="material-symbols:check-rounded" class="radio-check" />
        </div>
      </div>
    </label>
  </div>
</template>

<style scoped>
.radio-wrapper {
  position: relative;
  display: inline-block;
}

.radio-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}

.radio-box {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-matteblack);
  background: var(--color-offwhite);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-check {
  font-size: 1.5rem;
  color: var(--color-matteblack);
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

.radio-input:checked + .radio-box .radio-check {
  opacity: 1;
  transform: scale(1);
}

.radio-wrapper:hover .radio-box {
  border-color: var(--color-baseparchment);
  background: var(--color-lightparchment);
}

.radio-input:focus + .radio-box {
  outline: 2px solid var(--color-baseparchment);
  outline-offset: 2px;
}

.radio-input:checked + .radio-box {
  background: var(--color-baseparchment);
  border-color: var(--color-darkparchment);
}
</style>
