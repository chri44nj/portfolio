<script setup lang="ts">
interface Props {
  text: string;
  changeColor: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <span
    class="transition-colors duration-300"
    :class="props.changeColor ? 'text-basegreen' : ''"
  >
    {{ text }}
  </span>
</template>
