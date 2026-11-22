import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

const SUN = 'M12 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10z';
const MOON = 'M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7.2 7.2 0 0 0 9.7 9.7z';

const POSE = {
  light: { body: SUN, rays: { scale: 1, opacity: 1, rotation: 0 }, icon: 0 },
  dark: { body: MOON, rays: { scale: 0.2, opacity: 0, rotation: -60 }, icon: -25 },
};

export class ThemeIcon {
  constructor(button) {
    this.button = button;
    this.icon = button.querySelector('svg');
    this.body = button.querySelector('.theme-toggle__body');
    this.rays = Array.from(button.querySelectorAll('.theme-toggle__rays line'));
    this.timeline = null;
  }

  kill() {
    this.timeline?.kill();
    this.timeline = null;
  }

  setTimeScale(scale) {
    this.timeline?.timeScale(scale);
  }

  readChrome() {
    const cs = getComputedStyle(this.button);
    return { backgroundColor: cs.backgroundColor, borderColor: cs.borderTopColor, color: cs.color };
  }

  set(theme) {
    this.timeline?.kill();
    this.timeline = null;
    const pose = POSE[theme];
    if (this.body) gsap.set(this.body, { morphSVG: pose.body });
    gsap.set(this.rays, { ...pose.rays, svgOrigin: '12 12' });
    if (this.icon) gsap.set(this.icon, { rotation: pose.icon, transformOrigin: '50% 50%' });
    gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' });
  }

  morphTo(theme, opts) {
    this.timeline?.kill();
    const pose = POSE[theme];
    const tl = gsap.timeline({ defaults: { duration: opts.duration, ease: opts.ease } });

    if (this.body) tl.to(this.body, { morphSVG: { shape: pose.body, shapeIndex: 'auto' } }, 0);
    tl.to(this.rays, { ...pose.rays, svgOrigin: '12 12', stagger: opts.duration * 0.035 }, 0);
    if (this.icon) tl.to(this.icon, { rotation: pose.icon, transformOrigin: '50% 50%' }, 0);

    if (opts.chromeFrom) {
      Object.assign(this.button.style, opts.chromeFrom);
      const delay = opts.chromeDelay ?? 0;
      const swap = Math.min(0.18, opts.duration * 0.15);
      tl.to(
        this.button,
        {
          backgroundColor: () => this.targetChrome().backgroundColor,
          borderColor: () => this.targetChrome().borderColor,
          color: () => this.targetChrome().color,
          duration: swap,
          ease: 'power1.out',
          onComplete: () => {
            gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' });
          },
        },
        delay
      );
    } else {
      gsap.set(this.button, { clearProps: 'backgroundColor,borderColor,color' });
    }

    tl.timeScale(opts.timeScale);
    this.timeline = tl;
  }

  targetChrome() {
    const saved = this.button.getAttribute('style') ?? '';
    this.button.style.removeProperty('background-color');
    this.button.style.removeProperty('border-color');
    this.button.style.removeProperty('color');
    const target = this.readChrome();
    this.button.setAttribute('style', saved);
    return target;
  }
}

