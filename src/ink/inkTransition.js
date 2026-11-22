import gsap from 'gsap';
import { capturePage, layoutKey, renderScale } from './capture';
import { inkParams } from './params';
import { InkRenderer } from './renderer';
import { ThemeIcon } from './themeIcon';

const EASE = 'power3.out';
const FADE_OUT = 0.15;
const RESIZE_DEBOUNCE_MS = 250;
const CSS_FADE_S = 0.45;
const SPREAD = { growth: 0.7, cleanupFrom: 0.45, cleanupReach: 0.4, cleanupPow: 2 };

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const getTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const otherTheme = (t) => (t === 'dark' ? 'light' : 'dark');

function farthestCorner(p) {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  return (
    Math.max(
      Math.hypot(p.x, p.y),
      Math.hypot(w - p.x, p.y),
      Math.hypot(p.x, h - p.y),
      Math.hypot(w - p.x, h - p.y)
    ) + 4
  );
}

function randomSeed() {
  return { x: Math.random() * 64 - 32, y: Math.random() * 64 - 32, angle: Math.random() * Math.PI * 2 };
}

export class InkTransition {
  constructor(canvas, toggleButton, onThemeChange) {
    this.toggleButton = toggleButton;
    this.onThemeChange = onThemeChange;
    this.icon = toggleButton ? new ThemeIcon(toggleButton) : null;
    this.icon?.set(getTheme());
    this.state = { progress: 0, time: 0 };
    this.tween = null;
    this.fade = null;
    this.frame = null;
    this.cssFadeTimer = 0;
    this.captureGen = 0;
    this.capturing = false;
    this.capturePromise = null;
    this.captureQueued = false;
    this.resizeTimer = 0;

    this.renderer = InkRenderer.create(canvas);
    if (!this.renderer) {
      document.documentElement.dataset.ink = 'css';
      return;
    }
    document.documentElement.dataset.ink = 'webgl';

    this.renderer.resize(renderScale());
    this.renderer.watchContext(
      () => this.cancel(),
      () => this.scheduleCapture(0)
    );

    this.onResize = () => {
      this.renderer?.resize(renderScale());
      if (this.frame) this.draw();
      this.scheduleCapture(RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener('resize', this.onResize);

    this.onScroll = () => {
      if (!this.frame) this.scheduleCapture(350);
    };
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.onMotionChange = () => this.scheduleCapture(0);
    reducedMotion.addEventListener('change', this.onMotionChange);

    void document.fonts.ready.then(() => this.scheduleCapture(300));
  }

  destroy() {
    this.cancel();
    this.icon?.kill();
    window.clearTimeout(this.cssFadeTimer);
    window.clearTimeout(this.resizeTimer);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
    if (this.onMotionChange) reducedMotion.removeEventListener('change', this.onMotionChange);
  }

  applyTheme(to) {
    document.documentElement.dataset.theme = to;
    localStorage.setItem('portfolio-theme', to);
    this.onThemeChange?.(to);
  }

  async toggle(point) {
    const to = otherTheme(getTheme());
    const renderer = this.renderer;
    const scale = renderScale();
    const key = layoutKey(scale);
    const interrupting = this.frame !== null;

    if (!renderer || renderer.isLost || reducedMotion.matches) {
      this.cancel();
      this.crossFade(to);
      return;
    }

    // If snapshots aren't ready yet (e.g., clicked right after load or resize), capture them now.
    if (!renderer.hasValid(to, key) || (!interrupting && !renderer.hasValid(getTheme(), key))) {
      await this.captureAll();
    }

    const readyKey = layoutKey(renderScale());
    const canAnimate =
      !renderer.isLost &&
      !reducedMotion.matches &&
      renderer.hasValid(to, readyKey) &&
      (interrupting || renderer.hasValid(getTheme(), readyKey));

    if (!canAnimate) {
      this.cancel();
      this.crossFade(to);
      this.scheduleCapture(0);
      return;
    }

    let from = getTheme();
    if (interrupting) {
      this.tween?.kill();
      this.fade?.kill();
      this.tween = this.fade = null;
      renderer.resize(scale);
      const frozen = this.currentFrame();
      from = frozen && renderer.freeze(frozen) ? 'composite' : getTheme();
    }

    const center = point ?? this.toggleCenter();
    const maxDist = farthestCorner(center);
    const frameSeed = randomSeed();
    this.frame = { from, to, center, maxDist, seed: frameSeed };
    this.state.progress = 0;
    this.state.time = 0;

    const chromeFrom = this.icon?.readChrome();
    renderer.canvas.classList.add('is-active');
    gsap.set(renderer.canvas, { opacity: 1 });
    renderer.resize(scale);
    this.draw();
    this.applyTheme(to);

    const duration = inkParams.duration;
    this.icon?.morphTo(to, {
      duration,
      ease: EASE,
      timeScale: inkParams.timeScale,
      chromeFrom,
      chromeDelay: this.inkArrival(center, maxDist, this.toggleCenter()) * duration,
    });

    this.tween = gsap.to(this.state, {
      progress: 1,
      duration,
      ease: EASE,
      onUpdate: () => {
        this.state.time = this.tween?.time() ?? 0;
        this.draw();
      },
      onComplete: () => this.finish(),
    });
    this.tween.timeScale(inkParams.timeScale);
  }

  currentFrame() {
    if (!this.frame) return null;
    const { progress, time } = this.state;
    const { maxDist } = this.frame;
    const linear = Math.min(1, time / inkParams.duration);
    const ramp = Math.max(0, (linear - SPREAD.cleanupFrom) / (1 - SPREAD.cleanupFrom));
    const cleanup =
      ramp ** SPREAD.cleanupPow * maxDist * SPREAD.cleanupReach + Math.max(0, (linear - 0.97) / 0.03) * maxDist;
    return { ...this.frame, progress, time, radius: progress * maxDist * SPREAD.growth, cleanup };
  }

  draw() {
    const frame = this.currentFrame();
    if (this.renderer && frame) this.renderer.draw(frame);
  }

  finish() {
    const canvas = this.renderer?.canvas;
    this.tween = null;
    if (!canvas) return;
    this.fade = gsap
      .to(canvas, { opacity: 0, duration: FADE_OUT, ease: 'none', onComplete: () => this.hide() })
      .timeScale(inkParams.timeScale);
  }

  hide() {
    this.fade = null;
    this.frame = null;
    this.renderer?.canvas.classList.remove('is-active');
    if (this.captureQueued) this.scheduleCapture(0);
  }

  cancel() {
    if (!this.frame) return;
    this.tween?.kill();
    this.fade?.kill();
    this.tween = null;
    this.hide();
  }

  crossFade(to) {
    const root = document.documentElement;
    const motion = !reducedMotion.matches;
    root.classList.add('theme-fade-transition');
    this.applyTheme(to);
    if (motion) {
      this.icon?.morphTo(to, { duration: CSS_FADE_S * 1.6, ease: 'power2.inOut', timeScale: 1 });
    } else {
      this.icon?.set(to);
    }
    window.clearTimeout(this.cssFadeTimer);
    this.cssFadeTimer = window.setTimeout(() => {
      root.classList.remove('theme-fade-transition');
      if (this.captureQueued) this.scheduleCapture(0);
    }, CSS_FADE_S * 1000 + 50);
  }

  inkArrival(center, maxDist, target) {
    const dist = Math.hypot(target.x - center.x, target.y - center.y);
    if (dist < 28) return 0;
    const p = Math.min(1, dist / (maxDist * SPREAD.growth * 1.15));
    return Math.min(0.85, 1 - Math.cbrt(1 - p));
  }

  toggleCenter() {
    const r = this.toggleButton?.getBoundingClientRect();
    if (!r) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  scheduleCapture(delay) {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => void this.captureAll(), delay);
  }

  async captureAll() {
    const renderer = this.renderer;
    if (!renderer || renderer.isLost || reducedMotion.matches) return;

    if (this.capturePromise) {
      return this.capturePromise;
    }

    if (this.frame || document.documentElement.classList.contains('theme-fade-transition')) {
      this.captureQueued = true;
      return;
    }

    const scale = renderScale();
    const key = layoutKey(scale);
    const current = getTheme();
    const themes = [current, otherTheme(current)].filter((t) => !renderer.hasValid(t, key));
    this.captureQueued = false;
    if (themes.length === 0) return;

    const gen = ++this.captureGen;
    this.capturing = true;
    this.capturePromise = (async () => {
      try {
        for (const theme of themes) {
          const snap = await capturePage(theme, scale, renderer.maxTextureSize);
          if (gen !== this.captureGen) return;
          if (snap.key !== layoutKey(renderScale())) {
            this.captureQueued = true;
            break;
          }
          renderer.upload(snap);
        }
      } catch (err) {
        console.error('[ink] capture failed', err);
      } finally {
        this.capturing = false;
        this.capturePromise = null;
      }
      if (this.captureQueued) this.scheduleCapture(RESIZE_DEBOUNCE_MS);
    })();
    return this.capturePromise;
  }
}

