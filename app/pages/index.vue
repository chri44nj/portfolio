<script lang="ts" setup>
const companyName = ref("");
const teamWorkChoice = ref<string | null>("");

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
  <div class="flex items-center justify-center flex-col text-center gap-4">
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
    </ElementFullScreenSection>
    <ElementFullScreenSection class="bg-darkparchment text-matteblack">
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
    </ElementFullScreenSection>
    <ElementFullScreenSection class="relative overflow-hidden">
      <h2 class="z-100">Vil du være min kollega?</h2>

      <div class="flex items-center gap-4">
        <ElementRadioButton
          id="ja"
          name="samarbejde"
          value="yes"
          label="Ja"
          v-model="teamWorkChoice"
          class="w-20"
        />

        <ElementRadioButton
          id="nej"
          name="samarbejde"
          value="no"
          label="Nej"
          v-model="teamWorkChoice"
          class="w-20"
        />

        <ElementRadioButton
          id="måske"
          name="samarbejde"
          value="maybe"
          label="Måske"
          v-model="teamWorkChoice"
          class="w-20"
        />
      </div>
      <UButton type="button" variant="link" class="z-100" @click="reset"
        >Nulstil</UButton
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
      ></div>

      <NuxtLink
        class="absolute z-50 ease-in-out transition-all duration-1000 shine"
        :class="
          teamWorkChoice === 'yes' ? 'bottom-8 md:bottom-16' : '-bottom-16'
        "
        to="mailto:chris_valentin@hotmail.com"
      >
        <UButton
          label="Send mig en mail!"
          icon="material-symbols:mail-rounded"
          size="xl"
        />
      </NuxtLink>

      <NuxtImg
        src="/img/right-arm.png"
        alt="Right arm pointing at button"
        class="w-1/2 max-w-[800px] absolute bottom-8 md:bottom-16 z-[100] transition-all ease-in-out duration-2000"
        :class="
          teamWorkChoice === 'yes'
            ? 'md:-rotate-15 -rotate-10 left-[calc(50%+7.5rem)]'
            : ' left-full'
        "
      />
      <NuxtImg
        src="/img/left-arm.png"
        alt="Left arm pointing at button"
        class="w-1/2 max-w-[800px] absolute bottom-8 md:bottom-16 z-[100] transition-all ease-in-out duration-2000 rotate-12"
        :class="
          teamWorkChoice === 'yes'
            ? 'md:rotate-18 rotate-13 right-[calc(50%+7.5rem)]'
            : ' right-full'
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
