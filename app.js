/**
 * Programmatic Multilingual Heart Typography Animation
 * Pure Canvas Implementation - Zero Audio, Zero Video Embedding
 */

(function () {
  'use strict';

  // 1. Multilingual "I Love You" Dataset (24 Languages)
  const PHRASES = [
    { text: "Seni Seviyorum", lang: "tr" },
    { text: "I Love You", lang: "en" },
    { text: "Te Amo", lang: "es" },
    { text: "Je t'aime", lang: "fr" },
    { text: "Ich liebe dich", lang: "de" },
    { text: "Ti amo", lang: "it" },
    { text: "Eu te amo", lang: "pt" },
    { text: "Я тебя люблю", lang: "ru" },
    { text: "愛してる", lang: "ja" },
    { text: "사랑해", lang: "ko" },
    { text: "我爱你", lang: "zh" },
    { text: "أحبك", lang: "ar" },
    { text: "Σ' αγαπώ", lang: "el" },
    { text: "Ik hou van jou", lang: "nl" },
    { text: "Kocham Cię", lang: "pl" },
    { text: "Jag älskar dig", lang: "sv" },
    { text: "मैं तुमसे प्यार करता हूँ", lang: "hi" },
    { text: "Anh yêu em", lang: "vi" },
    { text: "ฉันรักเธอ", lang: "th" },
    { text: "Te iubesc", lang: "ro" },
    { text: "Szeretlek", lang: "hu" },
    { text: "Miluji tě", lang: "cs" },
    { text: "Mahal kita", lang: "tl" },
    { text: "Aku cinta kamu", lang: "id" }
  ];

  // 2. Romantic Neon Color Palette
  const PALETTE = [
    "#ff1744", // Ruby Red
    "#ff2a75", // Vivid Crimson-Pink
    "#ff4081", // Rose Neon
    "#ff7597", // Coral Pink
    "#f50057", // Deep Fuchsia
    "#ff5252", // Warm Coral
    "#ffaec5", // Soft Blush
    "#fff0f3"  // Warm Pinkish White
  ];

  // 3. Mathematical Heart Geometry (Parametric Equation)
  function getHeartCoord(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
  }

  // Canvas Setup
  const canvas = document.getElementById('heartCanvas');
  const ctx = canvas.getContext('2d');
  const replayBtn = document.getElementById('replayBtn');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let heartScale = 14;
  let heartCenterX = 0;
  let heartCenterY = 0;

  // Animation State
  let items = [];
  let ambientParticles = [];
  let animationStartTime = 0;
  let isReplaying = false;

  // Build Deterministic Layout
  function generateHeartElements() {
    items = [];
    let phraseIndex = 0;
    const nextPhrase = () => {
      const p = PHRASES[phraseIndex % PHRASES.length];
      phraseIndex++;
      return p.text;
    };

    // Configuration of Concentric Rings (Shells)
    const shells = [
      { r: 1.00, count: 36, fontSize: 13, weight: "700", baseColor: 0, delayMin: 0.2, delayMax: 6.5 },
      { r: 0.82, count: 26, fontSize: 12, weight: "600", baseColor: 1, delayMin: 3.5, delayMax: 8.5 },
      { r: 0.64, count: 20, fontSize: 11, weight: "600", baseColor: 2, delayMin: 6.0, delayMax: 10.5 },
      { r: 0.45, count: 14, fontSize: 11, weight: "600", baseColor: 3, delayMin: 8.0, delayMax: 12.0 },
      { r: 0.25, count: 8,  fontSize: 10, weight: "500", baseColor: 4, delayMin: 9.5, delayMax: 13.0 }
    ];

    shells.forEach((shell, shellIdx) => {
      for (let i = 0; i < shell.count; i++) {
        // Distribute angles symmetrically
        const t = (i / shell.count) * 2 * Math.PI;
        const normCoord = getHeartCoord(t);

        const relX = normCoord.x * shell.r;
        const relY = normCoord.y * shell.r;

        // Progressive Entrance Timing
        const delay = shell.delayMin + ((i / shell.count) * (shell.delayMax - shell.delayMin));

        // Spawn vector from outside viewport or drifting orbit
        const spawnAngle = t + (Math.random() - 0.5) * 0.8;
        const spawnDistance = 450 + Math.random() * 300;
        const startRelX = Math.cos(spawnAngle) * spawnDistance;
        const startRelY = Math.sin(spawnAngle) * spawnDistance;

        const color = PALETTE[(shell.baseColor + (i % 3)) % PALETTE.length];

        items.push({
          text: nextPhrase(),
          relX,
          relY,
          startRelX,
          startRelY,
          delay: delay * 1000, // ms
          duration: 1800,      // ms
          fontSize: shell.fontSize,
          fontWeight: shell.weight,
          color,
          isCenter: false,
          progress: 0
        });
      }
    });

    // Core Highlight Phrase in Center
    items.push({
      text: "Seni Seviyorum",
      relX: 0,
      relY: 1.5,
      startRelX: 0,
      startRelY: -200,
      delay: 11500,
      duration: 2000,
      fontSize: 18,
      fontWeight: "800",
      color: "#ffffff",
      isCenter: true,
      progress: 0
    });

    // Generate Floating Ambient Dust Particles
    ambientParticles = [];
    for (let i = 0; i < 45; i++) {
      ambientParticles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        size: 0.8 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        alpha: 0.2 + Math.random() * 0.6,
        alphaSpeed: 0.008 + Math.random() * 0.012
      });
    }
  }

  // Smooth Cubic Ease-Out
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Resize Handler with Retina/DPI awareness
  function handleResize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Compute responsive scale for 9:16 mobile vs desktop
    heartCenterX = width / 2;
    // Shift slightly down to account for top-right header and optimal eye center
    heartCenterY = height / 2 + 10;

    const minDim = Math.min(width, height);
    if (width < 600) {
      // Mobile portrait: scale to fill nicely without edge clipping
      heartScale = (width * 0.82) / 32;
    } else if (height < 600) {
      // Landscape mobile
      heartScale = (height * 0.72) / 32;
    } else {
      // Tablet / Desktop
      heartScale = Math.min(width * 0.42, height * 0.60) / 32;
    }
  }

  // Animation Loop
  function render(timestamp) {
    if (!animationStartTime) animationStartTime = timestamp;
    const elapsed = timestamp - animationStartTime;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Ambient Floating Dust Particles
    ctx.save();
    ctx.translate(heartCenterX, heartCenterY);
    for (let i = 0; i < ambientParticles.length; i++) {
      const p = ambientParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += p.alphaSpeed;
      if (p.alpha > 0.8 || p.alpha < 0.2) p.alphaSpeed = -p.alphaSpeed;

      // Wrap boundaries
      if (p.x > 380) p.x = -380;
      if (p.x < -380) p.x = 380;
      if (p.y > 380) p.y = -380;
      if (p.y < -380) p.y = 380;

      ctx.fillStyle = `rgba(255, 120, 160, ${p.alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Heart Breathing / Pulse Once Assembled
    const isAssembled = elapsed > 13000;
    let pulseScale = 1.0;
    if (isAssembled) {
      const pulseTime = (elapsed - 13000) / 1000;
      // Gentle romantic heartbeat: subtle rhythmic expansion
      pulseScale = 1.0 + 0.024 * Math.sin(pulseTime * 2.4);
    }

    // 3. Render Multilingual Text Items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (elapsed < item.delay) {
        continue; // Not yet spawned
      }

      const itemElapsed = elapsed - item.delay;
      const progress = Math.min(1.0, itemElapsed / item.duration);
      item.progress = progress;

      const ease = easeOutCubic(progress);

      // Trajectory from spawn to heart position
      const currRelX = item.startRelX + (item.relX - item.startRelX) * ease;
      const currRelY = item.startRelY + (item.relY - item.startRelY) * ease;

      const screenX = heartCenterX + currRelX * heartScale * pulseScale;
      const screenY = heartCenterY + currRelY * heartScale * pulseScale;

      // Scale & Opacity transitions
      let scale = 0.4 + ease * 0.6;
      // Bloom pop effect when locking in
      if (progress > 0.75 && progress < 0.98) {
        scale += Math.sin((progress - 0.75) / 0.23 * Math.PI) * 0.18;
      }
      const alpha = Math.min(1.0, ease * 1.3);

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.scale(scale, scale);

      // Typography
      const finalFontSize = item.fontSize * (heartScale / 14);
      ctx.font = `${item.fontWeight} ${Math.max(8, finalFontSize)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Neon Glowing Shadows
      ctx.shadowColor = item.color;
      ctx.shadowBlur = item.isCenter ? 18 : 10;
      ctx.fillStyle = item.color;
      ctx.globalAlpha = alpha;

      ctx.fillText(item.text, 0, 0);

      // Extra bright core highlight for center phrase
      if (item.isCenter && progress >= 1.0) {
        ctx.shadowBlur = 24;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item.text, 0, 0);
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  // Replay Animation Function
  function restartAnimation() {
    animationStartTime = 0;
    generateHeartElements();
  }

  // Event Listeners
  window.addEventListener('resize', handleResize);

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      restartAnimation();
    });
  }

  // Tap anywhere on canvas to replay
  canvas.addEventListener('click', () => {
    restartAnimation();
  });

  // Initialize
  handleResize();
  generateHeartElements();
  requestAnimationFrame(render);
})();
