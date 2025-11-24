export function useDragScroll(scrollContainerRef: Ref<HTMLElement | null>) {
  const isDragging = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);
  const hasDragged = ref(false);
  const velocity = ref(0);
  const lastX = ref(0);
  const lastTime = ref(0);
  const momentumId = ref<number | null>(null);
  const initialClickPosition = ref({ x: 0, y: 0 });
  const DRAG_THRESHOLD = 5;

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainerRef.value) return;
    initialClickPosition.value = { x: e.pageX, y: e.pageY };
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
    scrollContainerRef.value.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !scrollContainerRef.value) return;

    const deltaX = Math.abs(e.pageX - initialClickPosition.value.x);
    const deltaY = Math.abs(e.pageY - initialClickPosition.value.y);

    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      e.preventDefault();
      hasDragged.value = true;

      const x = e.pageX - scrollContainerRef.value.offsetLeft;
      const walk = (x - startX.value) * 2;

      const now = Date.now();
      const timeDelta = now - lastTime.value;
      const distance = e.pageX - lastX.value;
      if (timeDelta > 0) {
        velocity.value = distance / timeDelta;
      }
      lastX.value = e.pageX;
      lastTime.value = now;
      scrollContainerRef.value.scrollLeft = scrollLeft.value - walk;
    }
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

  const handleMouseUp = (e: MouseEvent) => {
    if (!scrollContainerRef.value) return;
    isDragging.value = false;
    scrollContainerRef.value.style.userSelect = "";

    if (Math.abs(velocity.value) > 0.5) {
      momentumId.value = requestAnimationFrame(applyMomentum);
    }

    if (hasDragged.value) {
      setTimeout(() => {
        hasDragged.value = false;
      }, 100);
    }
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.value) return;
    isDragging.value = false;
    scrollContainerRef.value.style.userSelect = "";

    if (Math.abs(velocity.value) > 0.5) {
      momentumId.value = requestAnimationFrame(applyMomentum);
    }

    if (hasDragged.value) {
      setTimeout(() => {
        hasDragged.value = false;
      }, 100);
    }
  };

  onMounted(() => {
    const container = scrollContainerRef.value;
    if (!container) return;
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);
  });

  onUnmounted(() => {
    const container = scrollContainerRef.value;
    if (momentumId.value !== null) {
      cancelAnimationFrame(momentumId.value);
    }

    if (container) {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
    }
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  });

  return {
    isDragging,
    hasDragged,
  };
}
