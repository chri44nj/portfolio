<script setup lang="ts">
import { useCardStore } from "~/store/useCardStore";
import { useUIStore } from "~/store/useUIStore";
const props = defineProps<{
  onComplete: () => void;
}>();

const { handleNextStep } = useMatchFlow();

const cardStore = useCardStore();
const uiStore = useUIStore();
const skillsProgress = ref(0);
const personalityProgress = ref(0);
const bonusProgress = ref(0);
const currentStage = ref(1); // 1: skills, 2: personality, 3: bonus, 4: complete
const allComplete = ref(false);

// Calculate loading times based on selected cards
const skillsTime = computed(
  () => 0 + cardStore.selectedCardsByCategory("skill").length * 200
);
const personalityTime = computed(
  () => 0 + cardStore.selectedCardsByCategory("personality").length * 200
);
const bonusTime = computed(
  () => 0 + cardStore.selectedCardsByCategory("bonus").length * 200
);

// Sequential animation
const startSkillsAnimation = () => {
  const startTime = Date.now();
  currentStage.value = 1;

  const animateSkills = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    skillsProgress.value = Math.min(elapsed / skillsTime.value, 1);

    if (skillsProgress.value < 1) {
      requestAnimationFrame(animateSkills);
    } else {
      // Start personality animation after skills is complete
      setTimeout(() => startPersonalityAnimation(), 300);
    }
  };

  requestAnimationFrame(animateSkills);
};

const startPersonalityAnimation = () => {
  const startTime = Date.now();
  currentStage.value = 2;

  const animatePersonality = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    personalityProgress.value = Math.min(elapsed / personalityTime.value, 1);

    if (personalityProgress.value < 1) {
      requestAnimationFrame(animatePersonality);
    } else {
      // Start bonus animation after personality is complete
      setTimeout(() => startBonusAnimation(), 300);
    }
  };

  requestAnimationFrame(animatePersonality);
};

const startBonusAnimation = () => {
  const startTime = Date.now();
  currentStage.value = 3;

  const animateBonus = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    bonusProgress.value = Math.min(elapsed / bonusTime.value, 1);

    if (bonusProgress.value < 1) {
      requestAnimationFrame(animateBonus);
    } else {
      // All animations complete
      currentStage.value = 4;
      allComplete.value = true;
      props.onComplete();
    }
  };

  requestAnimationFrame(animateBonus);
};

// Start the sequential animation
onMounted(() => {
  // Start with a small delay
  setTimeout(() => startSkillsAnimation(), 500);
});

const getStatusText = (category: string, progress: number) => {
  if (category === "skills") {
    if (progress < 0.3) return "Indlæser kompetencer...";
    if (progress < 0.6) return "Analyserer kompetencer...";
    if (progress < 0.9) return "Matcher kompetencer...";
    return "Kompetencer matchet!";
  } else if (category === "personality") {
    if (progress < 0.3) return "Indlæser personlighed...";
    if (progress < 0.6) return "Analyserer personlighed...";
    if (progress < 0.9) return "Matcher personlighed...";
    return "Personlighed matchet!";
  } else {
    if (progress < 0.3) return "Indlæser bonusser...";
    if (progress < 0.6) return "Analyserer bonusser...";
    if (progress < 0.9) return "Matcher bonusser...";
    return "Bonusser matchet!";
  }
};

const handleClickNext = () => {
  handleNextStep();
};
</script>

<template>
  <div>
    <Transition name="icon" mode="out-in">
      <UButton
        v-if="uiStore.matchDone"
        key="single-button"
        :label="cardStore.selectedCardCount > 0 ? 'Fortsæt' : 'Find ud af det'"
        size="xl"
        block
        class="fixed bottom-0 left-0 py-4 md:py-6 z-10 rounded-none"
        @click="handleClickNext"
      />
    </Transition>
    <Transition name="bounce" mode="out-in" appear>
      <div v-if="!allComplete">
        <h3 class="mb-8 text-center">Finder det rigtige match...</h3>

        <!-- Skills Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between mb-2">
            <div class="flex items-center">
              <Icon name="mdi:brain" class="mr-2 text-lightblue" />
              <span class="font-medium">Kompetencer</span>
            </div>
            <div class="text-sm" :class="{ 'font-bold': currentStage === 1 }">
              {{ getStatusText("skills", skillsProgress) }}
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-lightblue transition-all duration-300 rounded-full"
              :style="{ width: `${skillsProgress * 100}%` }"
            />
          </div>
          <div class="mt-1 text-xs text-right">
            {{ Math.floor(skillsProgress * 100) }}%
          </div>
        </div>

        <!-- Personality Progress Bar -->
        <div
          class="mb-8"
          :class="{ 'opacity-50': currentStage < 2 && skillsProgress < 1 }"
        >
          <div class="flex justify-between mb-2">
            <div class="flex items-center">
              <Icon name="mdi:account-heart" class="mr-2 text-basered" />
              <span class="font-medium">Personlighed</span>
            </div>
            <div class="text-sm" :class="{ 'font-bold': currentStage === 2 }">
              {{
                personalityProgress > 0
                  ? getStatusText("personality", personalityProgress)
                  : "Venter..."
              }}
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-basered transition-all duration-300 rounded-full"
              :style="{ width: `${personalityProgress * 100}%` }"
            />
          </div>
          <div class="mt-1 text-xs text-right">
            {{ Math.floor(personalityProgress * 100) }}%
          </div>
        </div>

        <!-- Bonus Progress Bar -->
        <div
          class="mb-8"
          :class="{ 'opacity-50': currentStage < 3 && personalityProgress < 1 }"
        >
          <div class="flex justify-between mb-2">
            <div class="flex items-center">
              <Icon name="mdi:star" class="mr-2 text-darkyellow" />
              <span class="font-medium">Bonusser</span>
            </div>
            <div class="text-sm" :class="{ 'font-bold': currentStage === 3 }">
              {{
                bonusProgress > 0
                  ? getStatusText("bonus", bonusProgress)
                  : "Venter..."
              }}
            </div>
          </div>
          <div class="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-darkyellow transition-all duration-300 rounded-full"
              :style="{ width: `${bonusProgress * 100}%` }"
            />
          </div>
          <div class="mt-1 text-xs text-right">
            {{ Math.floor(bonusProgress * 100) }}%
          </div>
        </div>

        <!-- Current Processing Indicator -->
        <div class="flex justify-center mt-8">
          <div v-if="currentStage === 1" class="flex items-center">
            <div
              class="animate-spin h-6 w-6 border-3 border-lightblue border-t-transparent rounded-full mr-3"
            />
            <span>Behandler kompetencer...</span>
          </div>
          <div v-else-if="currentStage === 2" class="flex items-center">
            <div
              class="animate-spin h-6 w-6 border-3 border-basered border-t-transparent rounded-full mr-3"
            />
            <span>Behandler personlighed...</span>
          </div>
          <div v-else-if="currentStage === 3" class="flex items-center">
            <div
              class="animate-spin h-6 w-6 border-3 border-darkyellow border-t-transparent rounded-full mr-3"
            />
            <span>Behandler bonusser...</span>
          </div>
        </div>
      </div>
      <!-- Success Animation -->
      <div v-else class="flex flex-col items-center mt-12">
        <div class="relative flex items-center justify-center">
          <Icon
            name="mdi:check"
            class="text-basered text-[20rem] absolute transform -translate-y-1/2 top-1/2"
          />

          <h2 class="font-secondary z-1 tracking-wide">Match fundet</h2>
        </div>
      </div>
    </Transition>
  </div>
</template>
