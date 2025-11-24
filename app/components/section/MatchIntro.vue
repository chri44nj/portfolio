section
<script lang="ts" setup>
import { animate, stagger, splitText } from "animejs";
import { useCardStore } from "~/store/useCardStore";
const cardStore = useCardStore();
const { handleNextStep } = useMatchFlow();
const route = useRoute();
const username = computed(() => {
  const u = route.params.username;
  if (!u) return "dig";
  const name = Array.isArray(u) ? u[0] : u;
  return name!.charAt(0).toUpperCase() + name!.slice(1);
});
const introGreetingVisible = ref(false);
const cardsCombined = ref(false);
const userMayContinue = ref(false);
const linesActivated = ref(false);
const handleClickNext = () => {
  handleNextStep();
};

watch(cardsCombined, async (val) => {
  if (val) {
    await nextTick();

    const el = document.querySelector(".animated-text");
    if (!el) return;

    const { chars } = splitText(el, { words: false, chars: true });
    animate(chars, {
      y: [
        { to: "-0.5rem", ease: "inOutBounce", duration: 200 },
        { to: 0, ease: "outBounce", duration: 400 },
      ],
      delay: stagger(30),
      ease: "inOutCirc",
      loopDelay: 1000,
      loop: true,
    });
  }
});

onMounted(() => {
  introGreetingVisible.value = true;
  if (cardStore.selectedCardCount === 0) {
    introGreetingVisible.value = true;
    setTimeout(() => {
      cardsTurned.value = true;
      setTimeout(() => {
        introGreetingVisible.value = false;
        cardsCombined.value = true;
        setTimeout(() => {
          linesActivated.value = true;
        }, 1500);
        setTimeout(() => {
          userMayContinue.value = true;
        }, 5000);
      }, 2500);
    }, 1750);
  } else {
    introGreetingVisible.value = false;
    cardsCombined.value = true;
    userMayContinue.value = true;
    linesActivated.value = true;
  }
});

const cardsTurned = ref(false);
</script>

<template>
  <div>
    <div
      v-if="!userMayContinue"
      class="w-full h-full absolute top-0 left-0 flex items-center gap-3 justify-center text-center overflow-hidden"
    >
      <div
        class="absolute h-1/2 w-1/2 transition-all duration-1500"
        :class="
          introGreetingVisible
            ? 'top-0 left-0'
            : '-left-full -top-full  opacity-0'
        "
      >
        <div
          class="absolute transition-all duration-1000 h-24 aspect-2/3 rounded z-100 border-t-2 border-l-2"
          :class="
            cardsTurned
              ? '-bottom-1 -right-1 bg-baseparchment border-darkorange'
              : 'bottom-8 right-8 -rotate-[225deg] bg-darkparchment border-transparent'
          "
        >
          <Icon
            name="material-symbols:star-rounded"
            class="absolute top-2 left-2 text-darkorange !transition-opacity !duration-1000"
            :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
          />
        </div>
      </div>
      <div
        class="absolute h-1/2 w-1/2 transition-all duration-1500"
        :class="
          introGreetingVisible
            ? 'top-0 right-0'
            : '-right-full -top-full opacity-0'
        "
      >
        <div
          class="absolute transition-all duration-1000 h-24 aspect-2/3 rounded z-100 border-t-2 border-r-2"
          :class="
            cardsTurned
              ? '-bottom-1 -left-1 bg-baseparchment border-darkorange'
              : 'bottom-8 left-8 rotate-[225deg] bg-darkparchment border-transparent'
          "
        />
      </div>
      <div
        class="absolute h-1/2 w-1/2 transition-all duration-1500"
        :class="
          introGreetingVisible
            ? 'bottom-0 right-0 '
            : '-right-full -bottom-full opacity-0'
        "
      >
        <div
          class="absolute transition-all duration-1000 h-24 aspect-2/3 rounded z-100 border-b-2 border-r-2"
          :class="
            cardsTurned
              ? '-top-1 -left-1 bg-baseparchment  border-darkorange'
              : 'top-8 left-8  -rotate-[225deg] bg-darkparchment border-transparent'
          "
        >
          <Icon
            name="material-symbols:star-rounded"
            class="absolute bottom-2 right-2 rotate-180 text-darkorange !transition-opacity !duration-1000"
            :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
          />
        </div>
      </div>
      <div
        class="absolute h-1/2 w-1/2 transition-all duration-1500"
        :class="
          introGreetingVisible
            ? 'bottom-0 left-0 '
            : '-left-full -bottom-full  opacity-0'
        "
      >
        <div
          class="absolute transition-all duration-1000 h-24 aspect-2/3 rounded z-100 border-b-2 border-l-2"
          :class="
            cardsTurned
              ? '-top-1 -right-1 bg-baseparchment border-darkorange'
              : 'top-8 right-8 rotate-[225deg] bg-darkparchment border-transparent'
          "
        />
      </div>
    </div>
    <Transition name="fade-out" mode="out-in">
      <section
        v-show="cardsCombined"
        class="text-center flex flex-col items-center gap-4"
      >
        <h1 class="flex flex-col items-start text-darkorange">
          <span class="flex items-center w-full mb-2 md:mb-4">
            <span
              class="md:text-2xl text-base font-special font-normal mr-4 text-offwhite"
              >Det</span
            >
            <div
              class="border h-[4px] mr-4 rounded-r relative transform transition-transform duration-2000 ease-in-out w-full origin-right"
              :class="
                linesActivated
                  ? 'scale-x-100 border-offwhite/80'
                  : 'scale-x-0 border-transparent'
              "
            ></div>
          </span>

          <span
            class="font-special tracking-wide animated-text whitespace-nowrap"
            >Ultimative Match</span
          >
          <span class="flex items-center justify-end w-full">
            <div
              class="border h-[4px] mr-4 rounded-l relative origin-left transform transition-transform duration-2000 ease-in-out w-full"
              :class="
                linesActivated
                  ? 'scale-x-100 border-offwhite/80'
                  : 'scale-x-0 border-transparent'
              "
            ></div>
            <span
              class="md:text-2xl transition-opacity duration-2000 text-base font-special font-normal mr-4 text-offwhite"
              :class="linesActivated ? 'opacity-100' : 'opacity-0'"
              >for</span
            >
            <span
              class="font-special tracking-wide font-special text-offwhite transition-opacity duration-2000"
              :class="linesActivated ? 'opacity-100' : 'opacity-0'"
              >{{ route.params.username ? username : "dig" }}?</span
            >
          </span>
        </h1>

        <p
          class="text-sm md:text-base transition-opacity duration-2000"
          :class="linesActivated ? 'opacity-100' : 'opacity-0'"
        >
          Vær hilset
          {{
            route.params.username
              ? `repræsentant fra det noble hus ${username} `
              : "noble gæst"
          }}
          - eller skulle jeg kalde dig...
          <span class="font-bold">The Chosen One? </span
          ><span
            class="transition-opacity duration-2000"
            :class="userMayContinue ? 'opacity-100' : 'opacity-0'"
            >Legenderne hævder, at kun du kan bringe kontoret i balance.
            <strong
              >Marker de kvaliteter, du drømmer om i din næste kollega</strong
            >
            og få
            <strong class="text-darkorange">dit ultimative match</strong>,
            baseret på <strong>dine præferencer</strong>.</span
          >
        </p>
        <UButton
          key="single-button"
          :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Begynd'"
          size="xl"
          block
          class="fixed left-0 py-4 md:py-6 z-10 ease-in-out rounded-none animate-pulse transition-[bottom] duration-3500"
          :class="userMayContinue ? 'bottom-0' : '-bottom-full'"
          @click="handleClickNext"
        />
      </section>
    </Transition>
  </div>
</template>

<style scoped></style>
