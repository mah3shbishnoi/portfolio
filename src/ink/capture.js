const BACKGROUND = {
  light: '#FFFFFF',
  dark: '#0A0A0A',
};

const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

export function renderScale() {
  const cap = isCoarsePointer() ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function viewportSize() {
  return {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
  };
}

export function layoutKey(scale) {
  const { width, height } = viewportSize();
  return `${width}x${height}@${scale}@${Math.round(window.scrollX)},${Math.round(window.scrollY)}`;
}

export async function capturePage(theme, scale, maxTextureSize) {
  const t0 = performance.now();
  const key = layoutKey(scale);
  const { width, height } = viewportSize();
  const sx = window.scrollX;
  const sy = window.scrollY;

  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme],
    // Clone is scrolled to (sx, sy) so fixed/sticky UI (navbar, scrollbar) lands inside the
    // viewport crop; x/y then crop exactly the visible window out of document space.
    x: sx,
    y: sy,
    width,
    height,
    scrollX: sx,
    scrollY: sy,
    windowWidth: width,
    windowHeight: height,
    logging: false,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.dataset.theme = theme;
      const fixStyle = doc.createElement('style');
      fixStyle.textContent = `
        *, *::before, *::after {
          animation-delay: 0s !important;
          animation-duration: 0s !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
        }
        .hero-title,
        .hero-subtitle,
        .hero-description,
        .hero-links,
        .hero-terminal-container,
        .reveal-wrapper {
          opacity: 1 !important;
          transform: none !important;
        }
        .nav-brand a {
          background: none !important;
          -webkit-background-clip: border-box !important;
          -webkit-text-fill-color: var(--text-primary) !important;
        }
        .about-image-container::before {
          display: none !important;
        }
      `;
      doc.head.appendChild(fixStyle);
      doc.querySelectorAll('.glass-portrait, .status-avatar, .project-card-image-wrap').forEach((box) => {
        const img = box.querySelector('img');
        if (!img) return;
        const src = img.currentSrc || img.src;
        if (!src) return;
        box.style.backgroundImage = `url("${src}")`;
        box.style.backgroundSize = 'cover';
        box.style.backgroundPosition = box.classList.contains('project-card-image-wrap') ? 'top center' : 'center';
        box.style.backgroundRepeat = 'no-repeat';
        img.style.display = 'none';
      });
      doc.querySelectorAll('[data-ink-live]').forEach((el) => {
        el.style.visibility = 'hidden';
      });
    },
  });

  return { theme, canvas, scale: safeScale, key, ms: performance.now() - t0 };
}

