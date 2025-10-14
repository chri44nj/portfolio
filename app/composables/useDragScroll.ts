import { ref, onMounted, onUnmounted, type Ref } from "vue";

export function useDragScroll(scrollContainerRef: Ref<HTMLElement | null>) {
  const isDragging = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);
  const hasDragged = ref(false);
  const velocity = ref(0);
  const lastX = ref(0);
  const lastTime = ref(0);
  const momentumId = ref<number | null>(null);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainerRef.value) return;

    e.preventDefault();

    // Cancel any ongoing momentum
    if (momentumId.value !== null) {
      cancelAnimationFrame(momentumId.value);
      momentumId.value = null;
    }

    isDragging.value = true;
    hasDragged.value = false;
    startX.value = e.pageX - scrollContainerRef.value.offsetLeft;
    scrollLeft.value = scrollContainerRef.value.scrollLeft;
    lastX.value = e.pageX;
    lastTime.value = Date.now();
    velocity.value = 0;

    scrollContainerRef.value.style.cursor = "grabbing";
    scrollContainerRef.value.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !scrollContainerRef.value) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.value.offsetLeft;
    const walk = (x - startX.value) * 2;

    if (Math.abs(walk) > 5) {
      hasDragged.value = true;
    }

    // Calculate velocity for momentum
    const now = Date.now();
    const timeDelta = now - lastTime.value;
    const distance = e.pageX - lastX.value;

    if (timeDelta > 0) {
      velocity.value = distance / timeDelta;
    }

    lastX.value = e.pageX;
    lastTime.value = now;

    scrollContainerRef.value.scrollLeft = scrollLeft.value - walk;
  };

  const applyMomentum = () => {
    if (!scrollContainerRef.value || Math.abs(velocity.value) < 0.1) {
      momentumId.value = null;
      return;
    }

    scrollContainerRef.value.scrollLeft -= velocity.value * 16;

    velocity.value *= 0.95;

    momentumId.value = requestAnimationFrame(applyMomentum);
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.value) return;

    isDragging.value = false;
    scrollContainerRef.value.style.cursor = "grab";
    scrollContainerRef.value.style.userSelect = "";

    if (Math.abs(velocity.value) > 0.5) {
      momentumId.value = requestAnimationFrame(applyMomentum);
    }

    if (hasDragged.value) {
      setTimeout(() => {
        hasDragged.value = false;
      }, 50);
    }
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.value) return;

    isDragging.value = false;
    scrollContainerRef.value.style.cursor = "grab";
    scrollContainerRef.value.style.userSelect = "";

    if (Math.abs(velocity.value) > 0.5) {
      momentumId.value = requestAnimationFrame(applyMomentum);
    }

    if (hasDragged.value) {
      setTimeout(() => {
        hasDragged.value = false;
      }, 50);
    }
  };

  onMounted(() => {
    const container = scrollContainerRef.value;
    if (!container) return;

    container.style.cursor = "grab";

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);
  });

  onUnmounted(() => {
    const container = scrollContainerRef.value;
    if (!container) return;

    if (momentumId.value !== null) {
      cancelAnimationFrame(momentumId.value);
    }

    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseup", handleMouseUp);
    container.removeEventListener("mouseleave", handleMouseLeave);
  });

  return {
    isDragging,
    hasDragged,
  };
}
