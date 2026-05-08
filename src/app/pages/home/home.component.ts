import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CountdownService } from '../../core/services/countdown.service';
import { HeartsCanvasComponent } from '../../shared/components/hearts-canvas/hearts-canvas.component';
import { CountdownCardComponent } from '../../shared/components/countdown-card/countdown-card.component';

@Component({
  standalone: true,
  imports: [RouterLink, HeartsCanvasComponent, CountdownCardComponent],
  template: `
    <section class="hero section-wrap">
      <app-hearts-canvas [opacity]="0.22" />
      <h2 class="arabic-name">عبدو & هدهد</h2>

      <div class="couple-photo-wrapper">
        <div class="couple-photo-ring">
          <img
            class="couple-photo"
            src="assets/images/couples.jpeg"
            alt="Abdo & Hodhod"
          />
        </div>
      </div>

      <h2>Abdo & Hodhod - Our Forever</h2>
      <div class="ring">💍</div>
      <div class="grid">
        <app-countdown-card title="Together Since" [value]="together()" />
        <app-countdown-card title="Engaged Since" [value]="engaged()" />
      </div>
      <p class="note">The night of May 28th changed everything 💍</p>
      <div class="nav-links ui-font">
        <a routerLink="/our-story">Our Story</a>
        <a routerLink="/countdowns">Countdowns</a>
        <a routerLink="/bucket-list">Bucket List</a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 78vh;
      padding: 40px 20px;
      display: grid;
      place-items: center;
      text-align: center;
      overflow: hidden;
    }

    .arabic-name {
      font-size: clamp(32px, 6vw, 64px);
      color: var(--dark-olive);
    }

    h2 { margin-top: 8px; }

    /* ── Circular photo ── */
    .couple-photo-wrapper {
      margin: 16px 0 4px;
    }

    .couple-photo-ring {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, var(--primary-olive, #7a8c5e), var(--warm-brown, #a0785a));
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: gentle-glow 3s ease-in-out infinite alternate;
    }

    .couple-photo {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: center top;
      display: block;
      border: 3px solid white;
    }

    @keyframes gentle-glow {
      from { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
      to   { box-shadow: 0 4px 28px rgba(122, 140, 94, 0.45); }
    }

    /* ── Rest ── */
    .ring {
      font-size: 44px;
      animation: pulse-ring 2s infinite;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      width: min(760px, 100%);
    }

    .note { color: var(--warm-brown); }

    .nav-links {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .nav-links a { color: var(--primary-olive); }
  `]
})
export class HomeComponent {
  private readonly countdown = inject(CountdownService);
  readonly together = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-04-11T00:00:00'))));
  readonly engaged  = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-05-27T00:00:00'))));
}