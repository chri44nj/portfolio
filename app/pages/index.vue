<script lang="ts" setup>
const companyName = ref("");
</script>
<template>
  <div class="flex items-center justify-center flex-col text-center gap-4">
    <section
      class="min-h-screen py-[5rem] px-4 w-full flex flex-col gap-4 items-center justify-center"
    >
      <h1 class="font-special text-center text-baseparchment">
        <span class="relative">
          <span
            class="font-pacifico absolute left-0 -top-4 text-xs w-full text-offwhite text-nowrap"
          >
            er Christian Valentin</span
          >Dit
        </span>
        ultimative
        <span class="relative">
          match

          <span
            class="font-pacifico absolute -right-6 text-offwhite transform top-1/2 h1-size -translate-y-1/2"
            >?</span
          >
        </span>
      </h1>
      <div class="aspect-video w-full max-w-4xl px-4">
        <iframe
          class="w-full h-full"
          src="https://www.youtube.com/embed/LI2XIK7mKl8"
          allowfullscreen
        ></iframe>
      </div>
      <p class="text-xs">
        En ny video er under produktion. I mellemtiden byder jeg dig denne
        placeholder, jeg lavede for et par år siden :)
      </p>
    </section>
    <section
      class="min-h-screen bg-darkparchment flex flex-col items-center justify-center gap-4 w-full text-matteblack"
    >
      <h2>Under konstruktion</h2>
      <p class="!text-lg">
        Denne side er snart kodet færdig. <br />
        Kom snart tilbage og tjek i mellemtiden om vi er et match:
      </p>
      <UInput
        type="text"
        placeholder="Virksomhedsnavn..."
        class="!text-offwhite"
        v-model="companyName"
      />
      <NuxtLink :to="`/match/${companyName}`"
        ><UButton
          label="Find dit ultimative match"
          :disabled="!companyName"
          :class="companyName ? 'animate-pulse' : ''"
      /></NuxtLink>
    </section>
    <section class="min-h-screen w-full"></section>
    <section class="min-h-screen bg-baseparchment w-full"></section>
  </div>
</template>

<style></style>
