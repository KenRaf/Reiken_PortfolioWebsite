(function () {
  const $ = id => document.getElementById(id);
  const stage = $('type-stage');
  const display = $('type-display');
  const canvas = $('pond-canvas');
  const context = canvas.getContext('2d');
  const base = document.createElement('canvas');
  const baseContext = base.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const input = $('lab-text');
  const status = $('lab-status');
  const effectName = $('lab-effect-name');
  const pauseButton = $('lab-motion');
  const garden = document.querySelector('.garden-scene');
  const heroArt = document.querySelector('.hero-art');
  const defaults = { text: 'Make it meaningful.', weight: '500', spacing: '0' };
  let userPaused = false;
  let visible = false;
  let entered = false;
  let width = 1, height = 1, density = 1;
  let ripples = [];
  let paintFrame = 0, decodeFrame = 0;
  let lastRipple = -1000;
  let letters = [];
  const animations = new Set();
  const canMove = () => !userPaused && !reduced.matches && PORTFOLIO.animations?.enabled !== false;

  function restoreLetters() {
    letters.forEach(letter => { letter.textContent = letter.dataset.character; letter.style.width = ''; });
  }
  function stopText() {
    cancelAnimationFrame(decodeFrame);
    decodeFrame = 0;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    restoreLetters();
  }
  function fitText() {
    display.style.fontSize = '';
    const size = parseFloat(getComputedStyle(display).fontSize);
    const maxWord = Math.max(1, ...Array.from(display.querySelectorAll('.type-word')).map(word => word.getBoundingClientRect().width));
    const available = display.clientWidth;
    if (available > 0 && maxWord > available) display.style.fontSize = `${Math.max(8, size * available / maxWord * .96)}px`;
  }
  function buildText() {
    stopText();
    const value = Array.from(input.value).slice(0, 28).join('') || defaults.text;
    display.replaceChildren();
    letters = [];
    value.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { display.append(document.createTextNode(' ')); return; }
      const word = document.createElement('span');
      word.className = 'type-word';
      word.setAttribute('aria-hidden', 'true');
      Array.from(part).forEach(character => {
        const letter = document.createElement('span');
        letter.className = 'type-glyph';
        letter.dataset.character = character;
        letter.textContent = character;
        letters.push(letter);
        word.append(letter);
      });
      display.append(word);
    });
    display.setAttribute('aria-label', `Type preview: ${value}`);
    fitText();
    effectName.textContent = 'YOUR WORDS';
  }
  function playLetter(letter, frames, options) {
    if (!letter.animate) return;
    const animation = letter.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  }
  function stillMessage() {
    status.textContent = 'Effects are paused. Your text and controls still work.';
    effectName.textContent = 'STILL / READABLE';
  }
  function reveal() {
    stopText();
    if (!canMove()) return stillMessage();
    letters.forEach((letter, index) => playLetter(letter, [
      { opacity: 0, transform: 'translateY(28px) rotateX(-60deg)', filter: 'blur(5px)' },
      { opacity: 1, transform: 'translateY(0) rotateX(0)', filter: 'blur(0)' }
    ], { duration: 650, delay: index * 17, easing: 'cubic-bezier(.18,.7,.2,1)', fill: 'backwards' }));
    effectName.textContent = '01 / REVEAL';
    status.textContent = 'One letter at a time.';
  }
  function decode() {
    stopText();
    if (!canMove()) return stillMessage();
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    letters.forEach(letter => { letter.style.width = `${letter.getBoundingClientRect().width}px`; });
    const start = performance.now();
    let lastChange = -100;
    function step(now) {
      if (!canMove() || document.hidden) { stopText(); return; }
      const progress = Math.min(1, (now - start) / 1000);
      if (progress >= 1) { restoreLetters(); decodeFrame = 0; return; }
      if (now - lastChange > 55) {
        lastChange = now;
        const settled = Math.floor(progress * letters.length);
        letters.forEach((letter, index) => {
          letter.textContent = index < settled ? letter.dataset.character : pool[Math.floor(Math.random() * pool.length)];
        });
      }
      decodeFrame = requestAnimationFrame(step);
    }
    decodeFrame = requestAnimationFrame(step);
    effectName.textContent = '02 / DECODE';
    status.textContent = 'A little chaos, then clarity.';
  }
  function wave() {
    stopText();
    if (!canMove()) return stillMessage();
    letters.forEach((letter, index) => playLetter(letter, [
      { transform: 'translateY(0) rotate(0)' },
      { transform: 'translateY(-17px) rotate(-3deg)', offset: .35 },
      { transform: 'translateY(5px) rotate(1deg)', offset: .7 },
      { transform: 'translateY(0) rotate(0)' }
    ], { duration: 750, delay: index * 24, easing: 'ease-in-out' }));
    addRipple(width * .5, height * .53, true);
    effectName.textContent = '03 / RIPPLE';
    status.textContent = 'A small ripple can move the whole line.';
  }

  // The static pond is painted once per resize, then reused beneath the rings.
  function leaf(x, y, size, angle, color) {
    baseContext.save();
    baseContext.translate(x, y);
    baseContext.rotate(angle);
    baseContext.shadowColor = '#0a201b50';
    baseContext.shadowBlur = 10;
    baseContext.shadowOffsetY = 7;
    baseContext.beginPath();
    baseContext.moveTo(-size, 0);
    baseContext.bezierCurveTo(-size * .3, -size * .7, size * .6, -size * .5, size, 0);
    baseContext.bezierCurveTo(size * .4, size * .6, -size * .5, size * .5, -size, 0);
    baseContext.fillStyle = color;
    baseContext.fill();
    baseContext.shadowBlur = 0;
    baseContext.shadowOffsetY = 0;
    baseContext.beginPath();
    baseContext.moveTo(-size * .8, 0);
    baseContext.lineTo(size * .85, 0);
    baseContext.strokeStyle = '#dfeabf50';
    baseContext.lineWidth = 1;
    baseContext.stroke();
    baseContext.restore();
  }
  function drawBase() {
    if (!baseContext) return;
    const gradient = baseContext.createRadialGradient(width * .22, height * .15, 0, width * .35, height * .5, width * .9);
    gradient.addColorStop(0, '#6d8056');
    gradient.addColorStop(.45, '#34573b');
    gradient.addColorStop(1, '#183b2b');
    baseContext.fillStyle = gradient;
    baseContext.fillRect(0, 0, width, height);
    baseContext.lineWidth = .75;
    for (let i = 0; i < 9; i++) {
      baseContext.beginPath();
      baseContext.ellipse(width * .74, height * .45, 50 + i * 37, 17 + i * 13, -.3, 0, Math.PI * 2);
      baseContext.strokeStyle = `rgba(191,215,161,${.055 - i * .004})`;
      baseContext.stroke();
    }
    leaf(width * .06, height * .34, Math.min(45, width * .05), -.6, '#90a66b');
    leaf(width * .91, height * .22, Math.min(38, width * .045), .6, '#b3bf78');
    leaf(width * .84, height * .82, Math.min(52, width * .055), -.3, '#6f8950');
    leaf(width * .15, height * .86, Math.min(30, width * .04), .8, '#a3ad68');
  }
  function paint(now = performance.now()) {
    if (!context || !baseContext) return;
    context.clearRect(0, 0, width, height);
    context.drawImage(base, 0, 0, base.width, base.height, 0, 0, width, height);
    ripples = ripples.filter(ripple => now - ripple.start < 1700);
    for (const ripple of ripples) {
      const progress = Math.max(0, (now - ripple.start) / 1700);
      for (let ring = 0; ring < 3; ring++) {
        const radius = 5 + progress * 95 - ring * 12;
        if (radius < 1) continue;
        context.beginPath();
        context.ellipse(ripple.x, ripple.y, radius, radius * .48, -.2, 0, Math.PI * 2);
        context.lineWidth = ring ? .7 : 1.2;
        context.strokeStyle = `rgba(219,237,191,${(1 - progress) * (ring ? .15 : .35)})`;
        context.stroke();
      }
    }
  }
  function animateWater(now) {
    paintFrame = 0;
    if (!canMove() || document.hidden || !visible) return;
    paint(now);
    if (ripples.length) paintFrame = requestAnimationFrame(animateWater);
  }
  function addRipple(x, y, force = false) {
    if (!canMove() || !context || !baseContext) return;
    const now = performance.now();
    if (!force && now - lastRipple < 120) return;
    lastRipple = now;
    ripples.push({ x, y, start: now });
    if (ripples.length > 8) ripples.shift();
    if (!paintFrame && visible) paintFrame = requestAnimationFrame(animateWater);
  }
  function resize() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    density = Math.min(window.devicePixelRatio || 1, 1.5);
    if (context && baseContext) {
      canvas.width = base.width = Math.max(1, Math.round(width * density));
      canvas.height = base.height = Math.max(1, Math.round(height * density));
      context.setTransform(density, 0, 0, density, 0, 0);
      baseContext.setTransform(density, 0, 0, density, 0, 0);
      drawBase();
      paint();
    }
    fitText();
  }
  function resetPerspective() {
    display.style.removeProperty('--type-yaw');
    display.style.removeProperty('--type-pitch');
    garden.style.removeProperty('--garden-x');
    garden.style.removeProperty('--garden-y');
  }
  function stopAll() {
    stopText();
    cancelAnimationFrame(paintFrame);
    paintFrame = 0;
    ripples = [];
    resetPerspective();
    paint();
  }
  function syncPause() {
    const forced = reduced.matches || PORTFOLIO.animations?.enabled === false;
    pauseButton.disabled = forced;
    pauseButton.setAttribute('aria-pressed', String(!canMove()));
    pauseButton.textContent = forced ? 'Reduced motion' : userPaused ? 'Resume effects' : 'Pause effects';
    stage.classList.toggle('lab-paused', !canMove());
    if (!canMove()) { stopAll(); stillMessage(); }
    else status.textContent = 'Effects are ready. Choose one below.';
  }
  pauseButton.addEventListener('click', () => { userPaused = !userPaused; syncPause(); });
  reduced.addEventListener('change', syncPause);
  input.addEventListener('input', () => { buildText(); status.textContent = 'Your words. Try an effect below.'; });
  $('lab-weight').addEventListener('input', event => {
    stopText();
    display.style.fontWeight = event.target.value;
    $('weight-value').textContent = event.target.value;
    fitText();
  });
  $('lab-spacing').addEventListener('input', event => {
    stopText();
    display.style.setProperty('--type-spacing', `${event.target.value}px`);
    $('spacing-value').textContent = event.target.value;
    fitText();
  });
  $('effect-reveal').addEventListener('click', reveal);
  $('effect-decode').addEventListener('click', decode);
  $('effect-ripple').addEventListener('click', wave);
  $('lab-reset').addEventListener('click', () => {
    stopAll();
    input.value = defaults.text;
    $('lab-weight').value = $('weight-value').textContent = defaults.weight;
    $('lab-spacing').value = $('spacing-value').textContent = defaults.spacing;
    display.style.fontWeight = defaults.weight;
    display.style.setProperty('--type-spacing', '0px');
    buildText();
    effectName.textContent = 'READY TO PLAY';
    status.textContent = 'Back to the starting point.';
  });
  stage.addEventListener('pointermove', event => {
    if (!canMove() || !finePointer.matches || event.pointerType === 'touch' || event.target.closest('button')) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    display.style.setProperty('--type-yaw', `${(x / rect.width - .5) * 7}deg`);
    display.style.setProperty('--type-pitch', `${-(y / rect.height - .5) * 6}deg`);
    addRipple(x, y);
  });
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    const rect = stage.getBoundingClientRect();
    addRipple(event.clientX - rect.left, event.clientY - rect.top, true);
  });
  stage.addEventListener('pointerleave', resetPerspective);
  heroArt.addEventListener('pointermove', event => {
    if (!canMove() || !finePointer.matches || event.pointerType === 'touch') return;
    const rect = heroArt.getBoundingClientRect();
    garden.style.setProperty('--garden-x', `${(event.clientX - rect.left - rect.width / 2) * .025}px`);
    garden.style.setProperty('--garden-y', `${(event.clientY - rect.top - rect.height / 2) * .02}px`);
  });
  heroArt.addEventListener('pointerleave', resetPerspective);
  finePointer.addEventListener('change', resetPerspective);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) stopAll();
      else if (!entered) {
        entered = true;
        if (canMove()) { reveal(); addRipple(width * .5, height * .5, true); }
      }
    }, { threshold: .15 }).observe(stage);
  } else visible = true;
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  window.addEventListener('pagehide', stopAll);
  buildText();
  resize();
  syncPause();
})();
