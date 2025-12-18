<script lang="ts" setup>
const companyName = ref("");
const teamWorkChoice = ref<string | null>(null);

type Drop = {
  id: number;
  left: number;
  delay: number;
  duration: number;
};

const drops = ref<Drop[]>([]);
let rainTimer: ReturnType<typeof setInterval> | null = null;

function spawnDrop() {
  drops.value.push({
    id: Date.now() + Math.random(),
    left: Math.random() * 100,
    delay: Math.random(),
    duration: 1 + Math.random() * 2,
  });
}

watch(teamWorkChoice, (val) => {
  if (val === "no") {
    startRain();
  } else {
    stopRain();
  }
});

function startRain() {
  if (rainTimer) return;

  rainTimer = setInterval(() => {
    for (let i = 0; i < 6; i++) spawnDrop();
  }, 60);
}

function stopRain() {
  if (rainTimer) {
    clearInterval(rainTimer);
    rainTimer = null;
  }
}

const reset = () => {
  teamWorkChoice.value = null;
};
</script>

<template>
  <div class="flex items-center justify-center flex-col text-center">
    <!-- <ElementFullScreenSection>
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
    </ElementFullScreenSection> -->
    <ElementFullScreenSection>
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
      <div>
        <div class="flex items-center justify-center gap-2 text-baseparchment">
          <Icon name="material-symbols:handyman" />
          <p class="font-bold text-xl">Profilside under konstruktion</p>
          <Icon name="material-symbols:handyman" />
        </div>
        <p class="!text-lg">
          Denne side er næsten klar til produktion. Kom snart tilbage og tjek i
          mellemtiden om vi er et match:
        </p>
      </div>
      <UInput
        type="text"
        name="company-name"
        placeholder="Navn på din virksomhed..."
        class="!text-offwhite w-full max-w-80"
        v-model="companyName"
      />
      <NuxtLink :to="`/match/${companyName}`" class="w-full max-w-80"
        ><UButton
          :label="
            !companyName
              ? 'Indtast virksomhedsnavn'
              : 'Find dit ultimative match'
          "
          class="w-full justify-center"
          :disabled="!companyName"
          :class="companyName ? 'animate-pulse' : ''"
      /></NuxtLink>
    </ElementFullScreenSection>
    <ElementFullScreenSection
      class="relative overflow-hidden bg-baseparchment text-matteblack"
    >
      <Transition name="fade" mode="out-in">
        <h2 v-if="teamWorkChoice !== 'maybe'" class="z-100">
          Vil du være min kollega?
        </h2>
        <h2 v-else class="z-100">Min kollega vil du være, hmm?</h2>
      </Transition>

      <div class="flex items-center gap-4">
        <ElementRadioButton
          id="ja"
          name="samarbejde"
          value="yes"
          :label="teamWorkChoice === 'maybe' ? 'Do' : 'Ja'"
          v-model="teamWorkChoice"
          class="w-20"
        />

        <ElementRadioButton
          id="nej"
          name="samarbejde"
          value="no"
          :label="teamWorkChoice === 'maybe' ? 'Do not' : 'Nej'"
          v-model="teamWorkChoice"
          class="w-20"
        />

        <ElementRadioButton
          id="måske"
          name="samarbejde"
          value="maybe"
          :label="teamWorkChoice === 'maybe' ? 'Try' : 'Måske'"
          v-model="teamWorkChoice"
          class="w-20"
        />
      </div>
      <UButton
        type="button"
        variant="link"
        class="z-100 transition-opacity duration-1000 !text-matteblack"
        :class="
          teamWorkChoice !== null
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        "
        @click="reset"
        >{{ teamWorkChoice === "maybe" ? "Stilnul" : "Nulstil" }}</UButton
      >
      <div class="rain">
        <span
          v-for="drop in drops"
          :key="drop.id"
          class="drop"
          :style="{
            left: drop.left + 'vw',
            animationDelay: drop.delay + 's',
            animationDuration: drop.duration + 's',
          }"
          @animationend="drops = drops.filter((d) => d.id !== drop.id)"
        ></span>
      </div>
      <ClientOnly>
        <ElementFireworksScreen v-if="teamWorkChoice === 'yes'" />
      </ClientOnly>
      <div
        class="absolute bg-gradient-to-b top-0 left-0 h-screen w-screen z-50 pointer-events-none ease-in-out transition-colors duration-2000"
        :class="
          teamWorkChoice === 'yes'
            ? 'from-transparent to-transparent'
            : teamWorkChoice === 'no'
            ? ' from-matteblack/75 to-lightblue/50'
            : 'from-transparent to-transparent'
        "
      >
        <NuxtImg
          src="/img/yoda.webp"
          alt="Yodas"
          class="absolute transition-all ease-in-out duration-3000 -left-8 w-1/2 min-w-[250px] max-w-[750px]"
          :class="
            teamWorkChoice === 'maybe'
              ? 'bottom-0 opacity-100'
              : '-bottom-[200px] md:-bottom-[500px] opacity-0'
          "
        />
        <div
          class="absolute transition-all ease-in-out duration-3000 right-4 md:right-20 text-center md:text-[1.75rem] z-100 p-4"
          :class="
            teamWorkChoice === 'maybe'
              ? 'bottom-8 md:bottom-auto md:top-30'
              : '-bottom-20 md:bottom-auto md:-top-20'
          "
        >
          <Transition name="fade" mode="out-in">
            <p v-if="teamWorkChoice === 'maybe'">
              " <span>Do.</span> Or do not. There is no try. "
            </p>
            <p v-else-if="teamWorkChoice === 'yes'">" Mmmmm, yeeees. "</p>
            <p v-else-if="teamWorkChoice === 'no'">
              " Dumb you are. Leave I will. "
            </p>
          </Transition>
        </div>
      </div>

      <NuxtLink
        to="mailto:chris_valentin@hotmail.com"
        class="absolute z-50 ease-in-out transition-all duration-2000 group"
        :class="
          teamWorkChoice === 'yes' ? 'bottom-8 md:bottom-16' : '-bottom-16'
        "
      >
        <UButton
          size="xl"
          class="border-matteblack md:border-darkparchment transition-border duration-500 border-2 shine relative z-100 md:group-hover:border-matteblack"
        >
          <Icon
            size="1.25rem"
            name="material-symbols:mail-rounded"
            class="md:group-hover:rotate-360 transition-all rotate-270 duration-750 md:group-hover:text-matteblack md:text-darkparchment"
          />
          <span>Send mig en mail!</span>
        </UButton>
      </NuxtLink>
      <NuxtImg
        src="/img/right-arm.webp"
        alt="Right arm pointing at button"
        class="w-1/2 max-w-[800px] absolute bottom-8 md:bottom-16 z-99 transition-all ease-in-out duration-3000"
        :class="
          teamWorkChoice === 'yes'
            ? 'md:-rotate-15 -rotate-10 left-[calc(50%+7.5rem)] opacity-100'
            : ' left-full opacity-0'
        "
      />
      <NuxtImg
        src="/img/left-arm.webp"
        alt="Left arm pointing at button"
        class="w-1/2 max-w-[800px] absolute bottom-8 md:bottom-16 z-99 transition-all ease-in-out duration-3000 rotate-12"
        :class="
          teamWorkChoice === 'yes'
            ? 'md:rotate-18 rotate-13 right-[calc(50%+7.5rem)] opacity-100'
            : ' right-full opacity-0'
        "
      />
    </ElementFullScreenSection>
  </div>
</template>

<style scoped>
.rain {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 100;
}

.drop {
  position: absolute;
  top: -8vh;
  z-index: 100;
  width: 2px;
  height: 14px;

  background: linear-gradient(#ffffff22, #ffffffaa);
  border-radius: 2px;

  animation-name: fall;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes fall {
  to {
    transform: translateY(110vh);
    opacity: 0;
  }
}
</style>
