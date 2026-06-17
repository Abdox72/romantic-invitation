import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

const PALETTE = ['#c9a84c', '#e8b4b8', '#f5d0c5', '#dce8b8', '#fff8ee', '#e8d4a8', '#ffb7c5', '#6b7c4a', '#ff6b9d', '#ffd700', '#fff4b8'] as const;

type BurstKind = 'sphere' | 'ring' | 'heart' | 'willow' | 'crackle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  drag: number;
  gravity: number;
  twinkle: boolean;
  kind: 'dot' | 'spark';
}

interface Confetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  burst: BurstKind;
  trail: { x: number; y: number }[];
}

function hexToRgba(hex: string, a: number): string {
  const n = hex.slice(1);
  const bigint = parseInt(n, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${a})`;
}

@Component({
  selector: 'app-fireworks-canvas',
  standalone: true,
  template: `<canvas #canvas class="fireworks"></canvas>`,
  styles: [`.fireworks{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}`],
})
export class FireworksCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  /** Higher values launch more rockets and confetti. */
  @Input() intensity = 1.35;

  private frameId = 0;
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private particles: Particle[] = [];
  private confetti: Confetti[] = [];
  private rockets: Rocket[] = [];
  private nextRocketIn = 0;
  private nextConfettiIn = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pickColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const pickBurst = (): BurstKind => {
      const r = Math.random();
      if (r < 0.08) return 'heart';
      if (r < 0.22) return 'ring';
      if (r < 0.36) return 'willow';
      if (r < 0.5) return 'crackle';
      return 'sphere';
    };

    const pushParticle = (p: Partial<Particle> & Pick<Particle, 'x' | 'y' | 'vx' | 'vy' | 'life' | 'maxLife' | 'color' | 'size'>) => {
      this.particles.push({
        kind: 'dot',
        drag: 0.986,
        gravity: 0.045,
        twinkle: false,
        ...p,
      });
    };

    const burstSphere = (x: number, y: number, base: string, scale = 1) => {
      const n = Math.floor(rand(72, 118) * scale);
      for (let i = 0; i < n; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(1.4, 6.2) * scale;
        const life = rand(42, 88);
        pushParticle({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life, maxLife: life,
          color: Math.random() < 0.42 ? pickColor() : base,
          size: rand(0.8, 3.4),
          twinkle: Math.random() < 0.25,
        });
      }
    };

    const burstRing = (x: number, y: number, base: string) => {
      const n = 52;
      const radius = rand(2.8, 4.2);
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        const speed = rand(3.8, 5.4);
        const life = rand(50, 72);
        pushParticle({
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life, maxLife: life,
          color: Math.random() < 0.3 ? '#fff8ee' : base,
          size: rand(1.2, 2.8),
          drag: 0.972,
        });
      }
    };

    const burstHeart = (x: number, y: number, base: string) => {
      const n = 64;
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const mag = Math.hypot(hx, hy) || 1;
        const speed = rand(2.6, 5.2);
        const life = rand(48, 82);
        pushParticle({
          x, y,
          vx: (hx / mag) * speed,
          vy: (hy / mag) * speed,
          life, maxLife: life,
          color: Math.random() < 0.55 ? '#ffb7c5' : base,
          size: rand(1, 3),
          twinkle: true,
        });
      }
    };

    const burstWillow = (x: number, y: number, base: string) => {
      const n = Math.floor(rand(48, 72));
      for (let i = 0; i < n; i++) {
        const angle = rand(-Math.PI * 0.92, -Math.PI * 0.08);
        const speed = rand(2.2, 6.8);
        const life = rand(72, 120);
        pushParticle({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life, maxLife: life,
          color: Math.random() < 0.35 ? '#ffd700' : base,
          size: rand(0.9, 2.4),
          drag: 0.978,
          gravity: 0.065,
          kind: 'spark',
        });
      }
    };

    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      this.timeouts.push(id);
    };

    const burstCrackle = (x: number, y: number, base: string) => {
      burstSphere(x, y, base, 0.72);
      for (let wave = 0; wave < 3; wave++) {
        later(() => {
          const ox = x + rand(-28, 28);
          const oy = y + rand(-18, 18);
          const n = 18;
          for (let i = 0; i < n; i++) {
            const angle = rand(0, Math.PI * 2);
            const speed = rand(0.8, 3.2);
            const life = rand(18, 36);
            pushParticle({
              x: ox, y: oy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life, maxLife: life,
              color: '#fff8ee',
              size: rand(0.5, 1.6),
              twinkle: true,
              kind: 'spark',
            });
          }
        }, wave * 140);
      }
    };

    const burst = (x: number, y: number, base: string, kind: BurstKind) => {
      switch (kind) {
        case 'ring': burstRing(x, y, base); break;
        case 'heart': burstHeart(x, y, base); break;
        case 'willow': burstWillow(x, y, base); break;
        case 'crackle': burstCrackle(x, y, base); break;
        default: burstSphere(x, y, base);
      }
      if (Math.random() < 0.28) {
        later(() => burstSphere(x, y, pickColor(), 0.55), 180);
      }
    };

    const spawnConfetti = (w: number) => {
      const n = Math.floor(rand(2, 5) * this.intensity);
      for (let i = 0; i < n; i++) {
        this.confetti.push({
          x: rand(0, w),
          y: rand(-40, -8),
          vx: rand(-1.2, 1.2),
          vy: rand(1.4, 3.6),
          w: rand(5, 11),
          h: rand(7, 14),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.14, 0.14),
          color: pickColor(),
          life: rand(180, 320),
        });
      }
    };

    const launchRocket = (w: number, h: number) => {
      const x = rand(w * 0.08, w * 0.92);
      const targetY = rand(h * 0.08, h * 0.42);
      this.rockets.push({
        x,
        y: h + 20,
        vy: rand(-13.5, -16.5),
        targetY,
        color: pickColor(),
        burst: pickBurst(),
        trail: [],
      });
      if (Math.random() < 0.22 * this.intensity) {
        later(() => {
          this.rockets.push({
            x: rand(w * 0.15, w * 0.85),
            y: h + 20,
            vy: rand(-12, -15),
            targetY: rand(h * 0.12, h * 0.45),
            color: pickColor(),
            burst: pickBurst(),
            trail: [],
          });
        }, rand(80, 220));
      }
    };

    const loop = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 10) r.trail.shift();

        r.y += r.vy;
        r.vy += 0.17;

        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          const alpha = (t + 1) / r.trail.length * 0.55;
          ctx.fillStyle = hexToRgba(r.color, alpha);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.4 + t * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(r.color, 0.9);
        ctx.lineWidth = 2.2;
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - r.vy * 0.32, r.y - r.vy * 0.88);
        ctx.stroke();

        ctx.fillStyle = '#fff8ee';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= -0.8) {
          burst(r.x, r.y, r.color, r.burst);
          this.rockets.splice(i, 1);
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.life -= 1;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        let alpha = (p.life / p.maxLife) * 0.95;
        if (p.twinkle) alpha *= 0.55 + Math.abs(Math.sin(p.life * 0.35)) * 0.45;

        if (p.kind === 'spark') {
          ctx.strokeStyle = hexToRgba(p.color, alpha);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.8, p.y - p.vy * 1.8);
          ctx.stroke();
        } else {
          ctx.fillStyle = hexToRgba(p.color, alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const c = this.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.018;
        c.vx *= 0.995;
        c.rot += c.vr;
        c.life -= 1;

        if (c.life <= 0 || c.y > h + 30) {
          this.confetti.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = hexToRgba(c.color, 0.88);
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      this.nextRocketIn -= 1;
      if (this.nextRocketIn <= 0 && w > 40 && h > 40) {
        launchRocket(w, h);
        this.nextRocketIn = Math.max(12, (22 + Math.random() * 34) / this.intensity);
      }

      this.nextConfettiIn -= 1;
      if (this.nextConfettiIn <= 0 && w > 40) {
        spawnConfetti(w);
        this.nextConfettiIn = Math.max(8, 18 / this.intensity);
      }

      this.frameId = requestAnimationFrame(loop);
    };

    this.nextRocketIn = 4;
    this.nextConfettiIn = 2;
    this.frameId = requestAnimationFrame(loop);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    this.timeouts.forEach(clearTimeout);
  }
}
