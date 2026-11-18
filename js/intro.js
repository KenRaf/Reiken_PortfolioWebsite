(function () {
  const options = PORTFOLIO.animations || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const dialog = document.getElementById("intro-dialog");
  const skip = document.getElementById("intro-skip");
  const replays = [document.getElementById("replay-intro"), document.getElementById("replay-intro-text")];
  const meter = document.getElementById("intro-meter-fill");
  const percent = document.getElementById("intro-percent");
  const stageLabel = document.getElementById("intro-stage-label");
  const title = document.getElementById("intro-title");
  const duration = 2600; // Intro length in milliseconds. Skip always closes it.
  let active = false;
  let opener = null;
  let frame = 0;
  let safetyTimer = 0;
  let exitTimer = 0;
  let startTime = 0;

  if (options.intro === false || typeof dialog.showModal !== "function") return;
  replays.forEach(button => { button.hidden = false; });

  function paint(value) {
    meter.style.transform = `scaleX(${value})`;
    percent.textContent = String(Math.round(value * 100)).padStart(2, "0");
    const stage = value < .34 ? 1 : value < .7 ? 2 : 3;
    dialog.dataset.stage = stage;
    stageLabel.textContent = ["01 / Meet Reiken", "02 / Explore the work", "03 / Let’s connect"][stage - 1];
  }
  function finish(announce = true) {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    clearTimeout(safetyTimer);
    clearTimeout(exitTimer);
    frame = safetyTimer = exitTimer = 0;
    document.body.classList.remove("intro-open");
    dialog.classList.remove("intro-running", "intro-exit", "intro-still");
    if (dialog.open) dialog.close();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
    if (announce) document.dispatchEvent(new CustomEvent("portfolio:intro-complete"));
  }
  function tick(now) {
    if (!active) return;
    const value = Math.min(1, Math.max(0, (now - startTime) / duration));
    paint(value);
    if (value < 1) frame = requestAnimationFrame(tick);
    else {
      frame = 0;
      dialog.classList.add("intro-exit");
      exitTimer = setTimeout(() => finish(), 220);
    }
  }
  function start(initial = false, source = null) {
    if (active) return;
    const still = reducedMotion.matches || options.enabled === false;
    if (initial && still) return;
    opener = source;
    active = true;
    document.body.classList.add("intro-open");
    dialog.classList.remove("intro-exit");
    dialog.classList.toggle("intro-still", still);
    title.textContent = still ? "Portfolio ready." : "Loading portfolio...";
    skip.textContent = still ? "Enter portfolio ↗" : "Skip intro ↗";
    paint(still ? 1 : 0);
    try { dialog.showModal(); } catch (error) { finish(false); return; }
    skip.focus({ preventScroll: true });
    if (still) return; // Reduced-motion replay is a static screen with an exit.
    dialog.classList.add("intro-running");
    startTime = performance.now();
    safetyTimer = setTimeout(() => finish(), duration + 1000);
    frame = requestAnimationFrame(tick);
  }
  skip.addEventListener("click", () => finish());
  dialog.addEventListener("cancel", event => { event.preventDefault(); finish(); });
  dialog.addEventListener("close", () => finish());
  replays.forEach(button => button.addEventListener("click", () => start(false, button)));
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) finish(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) finish(false); });
  window.addEventListener("pagehide", () => finish(false));

  // Follow deep links immediately. A normal visit to the top shows the intro.
  if (!window.location.hash || window.location.hash === "#home") start(true);
})();
