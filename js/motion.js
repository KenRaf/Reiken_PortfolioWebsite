(function () {
  const options = PORTFOLIO.animations || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progress = document.getElementById("reading-progress");
  let enabled = false;
  let revealObserver = null;
  const running = new Set();

  // Animate only the new project content. Rapid clicks cancel earlier effects.
  function animate(node, frames, settings) {
    if (!enabled || !node?.animate) return;
    const animation = node.animate(frames, settings);
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  }
  function cancelTransitions() {
    running.forEach((animation) => animation.cancel());
    running.clear();
  }
  document.addEventListener("portfolio:project-change", (event) => {
    cancelTransitions();
    if (!enabled || options.projectTransitions === false) return;
    const direction = event.detail.direction;
    animate(document.getElementById("project-cover"), [
      { opacity: 0.25, transform: `translateX(${direction * 24}px) scale(1.025)` },
      { opacity: 1, transform: "translateX(0) scale(1)" }
    ], { duration: 430, easing: "cubic-bezier(.2,.7,.2,1)" });
    document.querySelectorAll(".project-copy > *").forEach((node, index) => {
      animate(node, [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 340, delay: index * 32, fill: "backwards", easing: "ease-out" });
    });
  });

  // Scroll progress has no permanent animation loop.
  let progressFrame = 0;
  function updateProgress() {
    progressFrame = 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progress.style.transform = `scaleX(${value})`;
  }
  function scheduleProgress() {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress);
  window.addEventListener("load", scheduleProgress);
  updateProgress();
  if ("ResizeObserver" in window) new ResizeObserver(scheduleProgress).observe(document.body);

  // Reveal cards individually. A deep link never hides content already in view.
  const revealTargets = Array.from(document.querySelectorAll(
    ".reveal:not(.skills-grid):not(.certificate-grid), .skill-card, .certificate-card"
  ));
  document.querySelectorAll(".skills-grid, .certificate-grid").forEach((grid) => {
    Array.from(grid.children).forEach((card, index) => {
      card.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
    });
  });
  function prepareReveals() {
    revealObserver?.disconnect();
    revealTargets.forEach((node) => node.classList.remove("reveal-wait"));
    if (!enabled || options.reveal === false || !("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-wait");
          entry.target.classList.add("reveal-entered");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -24px 0px" });
    revealTargets.forEach((node) => {
      if (node.getBoundingClientRect().top >= window.innerHeight - 24 && !node.classList.contains("reveal-entered")) {
        node.classList.add("reveal-wait");
        revealObserver.observe(node);
      }
    });
  }

  // A soft, local glow follows a mouse inside cards. No custom cursor is used.
  const spotlights = Array.from(document.querySelectorAll(".project-visual, .skill-card, .certificate-card, .contact-link"));
  let spotlightFrame = 0;
  let pointerCard = null;
  let pointerX = 0;
  let pointerY = 0;
  function resetSpotlights() {
    cancelAnimationFrame(spotlightFrame);
    spotlightFrame = 0;
    spotlights.forEach(node => node.classList.remove("pointer-active"));
    pointerCard = null;
  }
  spotlights.forEach((card) => {
    card.classList.add("spotlight-card");
    card.addEventListener("pointermove", (event) => {
      if (!enabled || options.spotlight === false || !finePointer.matches || event.pointerType === "touch") return;
      if (pointerCard !== card) resetSpotlights();
      pointerCard = card;
      const rect = card.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      card.classList.add("pointer-active");
      if (!spotlightFrame) spotlightFrame = requestAnimationFrame(() => {
        spotlightFrame = 0;
        if (!pointerCard) return;
        pointerCard.style.setProperty("--pointer-x", `${pointerX}px`);
        pointerCard.style.setProperty("--pointer-y", `${pointerY}px`);
      });
    });
    card.addEventListener("pointerleave", resetSpotlights);
  });
  finePointer.addEventListener("change", resetSpotlights);

  // Intro playback restarts the short opening animations after the overlay closes.
  let entryFrame = 0;
  document.addEventListener("portfolio:intro-complete", () => {
    if (!enabled) return;
    cancelAnimationFrame(entryFrame);
    document.body.classList.add("reset-entry");
    void document.body.offsetWidth;
    entryFrame = requestAnimationFrame(() => {
      entryFrame = 0;
      document.body.classList.remove("reset-entry");
    });
    prepareReveals();
    scheduleProgress();
  });

  // A preference change immediately restores still content and stops animations.
  function applyPreference() {
    enabled = options.enabled !== false && !reducedMotion.matches;
    document.body.classList.toggle("motion-enabled", enabled);
    if (!enabled) {
      resetSpotlights();
      cancelTransitions();
    }
    prepareReveals();
  }
  reducedMotion.addEventListener("change", applyPreference);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { resetSpotlights(); cancelTransitions(); }
  });
  window.addEventListener("pagehide", () => {
    resetSpotlights();
    cancelAnimationFrame(entryFrame);
    document.body.classList.remove("reset-entry");
    cancelTransitions();
    cancelAnimationFrame(progressFrame);
    progressFrame = 0;
  });
  window.addEventListener("pageshow", scheduleProgress);
  applyPreference();
})();
