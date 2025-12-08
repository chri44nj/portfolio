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
  if (cardStore.selectedCardCount === 0) {
    setTimeout(() => {
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
    }, 50);
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
      class="w-full h-full absolute top-0 left-0 flex items-center gap-3 justify-center md:text-center overflow-hidden"
    >
      <div
        class="absolute h-1/2 w-1/2 !transition-all !duration-1500"
        :class="
          introGreetingVisible
            ? 'top-0 left-0'
            : '-left-full -top-full  opacity-0'
        "
      >
        <div
          class="absolute !transition-all !duration-1000 h-[125px] aspect-2/3 z-100 border-t-2 border-l-2 rounded-tl-xl overflow-hidden"
          :class="
            cardsTurned
              ? 'bottom-0 right-0 bg-baseparchment border-baseparchment'
              : 'bottom-12 right-24 -rotate-[225deg] bg-darkparchment border-transparent rounded-lg'
          "
        >
          <div
            class="bg-matteblack/75 !transition-opacity !duration-1000 absolute bottom-0 right-0 w-4 h-6 rounded-tl-full z-100"
            :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
          />
          <div
            class="flex flex-col items-center absolute h-[75%] top-1 left-1 gap-1"
          >
            <Icon
              name="material-symbols:star-rounded"
              class="text-baseparchment text-xl !transition-opacity !duration-1000"
              :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
            />
            <div
              class="w-1 h-full bg-matteblack !transition-opacity !duration-1000"
              :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
            />
          </div>
        </div>
      </div>
      <div
        class="absolute h-1/2 w-1/2 !transition-all !duration-1500"
        :class="
          introGreetingVisible
            ? 'top-0 right-0'
            : '-right-full -top-full opacity-0'
        "
      >
        <div
          class="absolute !transition-all !duration-1000 h-[125px] aspect-2/3 z-100 border-t-2 border-r-2 rounded-tr-xl overflow-hidden"
          :class="
            cardsTurned
              ? 'bottom-0 left-0 bg-baseparchment border-baseparchment'
              : 'bottom-12 left-24 rotate-[225deg] bg-darkparchment border-transparent rounded-lg'
          "
        />
        <div
          class="bg-matteblack/75 !transition-opacity !duration-1000 absolute bottom-0 left-0 w-4 h-6 rounded-tr-full z-100"
          :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
        />
      </div>
      <div
        class="absolute h-1/2 w-1/2 !transition-all !duration-1500"
        :class="
          introGreetingVisible
            ? 'bottom-0 right-0 '
            : '-right-full -bottom-full opacity-0'
        "
      >
        <div
          class="absolute !transition-all !duration-1000 h-[125px] aspect-2/3 z-100 border-b-2 border-r-2 rounded-br-xl overflow-hidden"
          :class="
            cardsTurned
              ? 'top-0 left-0 bg-baseparchment  border-baseparchment'
              : 'top-12 left-24  -rotate-[225deg] bg-darkparchment border-transparent rounded-lg'
          "
        >
          <div
            class="bg-matteblack/75 !transition-opacity !duration-1000 absolute top-0 left-0 w-4 h-6 rounded-br-full z-100"
            :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
          />

          <div
            class="flex flex-col items-center absolute h-[75%] bottom-1 right-1 gap-1"
          >
            <div
              class="w-1 h-full bg-baseparchment !transition-opacity !duration-1000"
              :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
            />
            <Icon
              name="material-symbols:star-rounded"
              class="text-xl rotate-180 text-baseparchment !transition-opacity !duration-1000"
              :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
            />
          </div>
        </div>
      </div>
      <div
        class="absolute h-1/2 w-1/2 !transition-all !duration-1500"
        :class="
          introGreetingVisible
            ? 'bottom-0 left-0 '
            : '-left-full -bottom-full  opacity-0'
        "
      >
        <div
          class="absolute !transition-all !duration-1000 h-[125px] aspect-2/3 z-100 border-b-2 border-l-2 rounded-bl-xl overflow-hidden"
          :class="
            cardsTurned
              ? 'top-0 right-0 bg-baseparchment border-baseparchment'
              : 'top-12 right-24 rotate-[225deg] bg-darkparchment border-transparent rounded-lg'
          "
        />
        <div
          class="bg-matteblack/75 !transition-opacity !duration-1000 absolute top-0 right-0 w-4 h-6 rounded-bl-full z-100"
          :class="cardsTurned ? 'opacity-100' : 'opacity-0'"
        />
      </div>
    </div>
    <Transition name="fade-out" mode="out-in">
      <section
        v-show="cardsCombined"
        class="md:text-center flex flex-col items-center gap-4"
      >
        <h1 class="flex flex-col items-start text-baseparchment">
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
              class="md:text-2xl !transition-opacity duration-2000 text-base font-special font-normal mr-4 text-offwhite"
              :class="linesActivated ? 'opacity-100' : 'opacity-0'"
              >for</span
            >
            <span
              class="font-special tracking-wide font-special text-offwhite !transition-opacity duration-2000"
              :class="linesActivated ? 'opacity-100' : 'opacity-0'"
              >{{ route.params.username ? username : "dig" }}?</span
            >
          </span>
        </h1>

        <p
          class="text-sm md:text-base !transition-opacity duration-2000"
          :class="linesActivated ? 'opacity-100' : 'opacity-0'"
        >
          Vær hilset,
          {{
            route.params.username
              ? `ærede medlem af hus ${username} `
              : "ærede gæst"
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
            og se dit ultimative match, baseret på
            <strong>dine præferencer</strong>.</span
          >
        </p>
        <UButton
          key="single-button"
          :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Begynd'"
          size="lg"
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
