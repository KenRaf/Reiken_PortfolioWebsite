(function () {
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("reiken-theme"); } catch (error) { /* Storage may be blocked. */ }
  let explicitChoice = savedTheme === "dark" || savedTheme === "light";

  // Run before the stylesheet loads to avoid a light flash on a dark visit.
  function setTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#17251c" : "#f1f0e6";
    const button = document.getElementById("theme-button");
    if (button) {
      const label = theme === "dark" ? "Dark mode. Switch to light mode" : "Light mode. Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.title = label;
    }
  }
  setTheme(explicitChoice ? savedTheme : systemTheme.matches ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("theme-button");
    setTheme(root.dataset.theme);
    themeButton.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      explicitChoice = true;
      setTheme(next);
      try { localStorage.setItem("reiken-theme", next); } catch (error) { /* The toggle still works without storage. */ }
    });
    systemTheme.addEventListener("change", (event) => {
      if (!explicitChoice) setTheme(event.matches ? "dark" : "light");
    });

    const audio = document.getElementById("background-music");
    const musicButton = document.getElementById("music-button");
    const notice = document.getElementById("audio-notice");
    const music = PORTFOLIO.music;
    if (!music?.src) {
      musicButton.hidden = true;
      return;
    }
    audio.src = music.src;
    audio.volume = Math.min(1, Math.max(0, Number.isFinite(music.volume) ? music.volume : 0.25));
    audio.muted = true;
    let starting = false;
    function updateMusicButton() {
      const isPlaying = !audio.paused && !audio.muted;
      const label = isPlaying ? `Mute background music: ${music.title}` : `Play background music: ${music.title}`;
      musicButton.setAttribute("aria-pressed", String(isPlaying));
      musicButton.setAttribute("aria-label", label);
      musicButton.title = label;
    }
    function showMusicError() {
      audio.pause();
      audio.muted = true;
      notice.textContent = "Music could not play. Try the sound button again.";
      notice.hidden = false;
      updateMusicButton();
    }
    updateMusicButton();
    musicButton.addEventListener("click", async () => {
      if (starting) return;
      notice.hidden = true;
      if (!audio.paused && !audio.muted) {
        audio.muted = true;
        audio.pause();
        updateMusicButton();
        return;
      }
      starting = true;
      musicButton.setAttribute("aria-busy", "true");
      try {
        if (audio.error) audio.load();
        audio.muted = false;
        await audio.play();
      } catch (error) {
        showMusicError();
      } finally {
        starting = false;
        musicButton.removeAttribute("aria-busy");
        updateMusicButton();
      }
    });
    audio.addEventListener("play", updateMusicButton);
    audio.addEventListener("pause", updateMusicButton);
    audio.addEventListener("volumechange", updateMusicButton);
    audio.addEventListener("error", showMusicError);
    // Sound starts only when requested, never during page load.
  });
})();
