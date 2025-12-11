<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let w = 0;
let h = 0;

let animationFrameId = 0;
let particles: Particle[] = [];

const probability = 0.04;
let xPoint = 0;
let yPoint = 0;

// ==========================================================
// YOUR COLOR PALETTE
// ==========================================================
const FIREWORK_COLORS = [
  "#4f78e6", // lightblue
  "#e63946", // basered
  "#cdaa3d", // darkyellow
  "#d9c6a3", // baseparchment
  "#f8f9fa", // offwhite
  "#2b2b2b", // matteblack
];

// ==========================================================
// PARTICLE CLASS
// ==========================================================
class Particle {
  w = Math.random() * 5 + 2; // bigger sparks
  h = this.w;

  x = xPoint - this.w / 2;
  y = yPoint - this.h / 2;

  vx = (Math.random() - 0.5) * 10;
  vy = (Math.random() - 0.5) * 10;

  alpha = Math.random() * 0.4 + 0.8;
  gravity = 0.05;

  color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

  move() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.alpha -= 0.01;

    if (this.x <= -this.w || this.x >= w || this.y >= h || this.alpha <= 0) {
      return false;
    }

    return true;
  }

  draw(c: CanvasRenderingContext2D) {
    c.save();
    c.beginPath();

    c.translate(this.x + this.w / 2, this.y + this.h / 2);
    c.arc(0, 0, this.w, 0, Math.PI * 2);

    c.fillStyle = this.color;
    c.globalAlpha = this.alpha;

    c.fill();
    c.restore();
  }
}

// ==========================================================
// CANVAS MANAGEMENT
// ==========================================================
function resizeCanvas() {
  if (!canvas.value) return;

  w = canvas.value.width = window.innerWidth;
  h = canvas.value.height = window.innerHeight;
}

// ==========================================================
// FIREWORK SPAWN
// ==========================================================
function createFirework() {
  xPoint = Math.random() * (w - 200) + 100;
  yPoint = Math.random() * (h - 200) + 100;

  const nFire = Math.random() * 50 + 100;
  const color =
    FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];

  for (let i = 0; i < nFire; i++) {
    const particle = new Particle();
    particle.color = color;

    const vyLimit = Math.sqrt(25 - particle.vx * particle.vx);
    if (Math.abs(particle.vy) > vyLimit) {
      particle.vy = particle.vy > 0 ? vyLimit : -vyLimit;
    }

    particles.push(particle);
  }
}

// ==========================================================
// UPDATE LOOP
// ==========================================================
function update() {
  if (particles.length < 500 && Math.random() < probability) {
    createFirework();
  }

  const alive: Particle[] = [];

  for (const p of particles) {
    if (p.move()) alive.push(p);
  }

  particles = alive;
}

// ==========================================================
// RENDER LOOP (SOFT FADE)
// ==========================================================
function paint() {
  if (!ctx) return;

  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);

  ctx.globalCompositeOperation = "lighter";

  for (const p of particles) {
    p.draw(ctx);
  }
}

// ==========================================================
// MAIN LOOP
// ==========================================================
function loop() {
  update();
  paint();
  animationFrameId = requestAnimationFrame(loop);
}

// ==========================================================
// LIFECYCLE
// ==========================================================
onMounted(() => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext("2d");
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  loop();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCanvas);
  cancelAnimationFrame(animationFrameId);

  particles = [];
  ctx = null;
});
</script>

<template>
  <div class="fireworks-wrapper pointer-events-none">
    <canvas ref="canvas" />
  </div>
</template>

<style scoped>
.fireworks-wrapper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
