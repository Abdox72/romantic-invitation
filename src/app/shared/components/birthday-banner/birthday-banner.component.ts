import { Component, inject } from '@angular/core';
import { CountdownService } from '../../../core/services/countdown.service';

@Component({
  selector: 'app-birthday-banner',
  standalone: true,
  template: `
    <div class="banner" role="status" aria-live="polite">
      <span class="float-emoji left" aria-hidden="true">🎈</span>
      <span class="float-emoji right" aria-hidden="true">🎈</span>
      <span class="sparkles" aria-hidden="true">✨ 🎂 ✨</span>
      <h2>{{ countdown.birthdayHeadline() }}</h2>
      <p>"عيد ميلاد سعيد يا أجمل ما في حياتي، وجودك هو هديتي من الدنيا ♥"</p>
    </div>
  `,
  styles: [`
    .banner {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 22px 28px;
      margin-bottom: 20px;
      border-radius: 22px;
      color: var(--dark-olive, #3d4a2c);
      background: linear-gradient(135deg, rgba(255, 248, 238, 0.96), rgba(232, 180, 184, 0.42));
      border: 2px solid rgba(201, 168, 76, 0.65);
      box-shadow:
        0 10px 32px rgba(201, 168, 76, 0.22),
        inset 0 0 24px rgba(255, 255, 255, 0.45);
      animation: banner-glow 2.8s ease-in-out infinite alternate;
    }

    .sparkles {
      display: block;
      font-size: clamp(28px, 5vw, 40px);
      margin-bottom: 6px;
      animation: pulse-ring 2s ease-in-out infinite;
    }

    h2 {
      margin: 0 0 8px;
      font-size: clamp(24px, 4.5vw, 38px);
      color: var(--primary-olive);
      letter-spacing: 0.4px;
    }

    p {
      margin: 0;
      color: var(--warm-brown, #a0785a);
      font-size: clamp(14px, 2.4vw, 17px);
    }

    .float-emoji {
      position: absolute;
      top: 50%;
      font-size: 28px;
      transform: translateY(-50%);
      animation: balloon-drift 3.5s ease-in-out infinite alternate;
    }

    .left { left: 14px; }
    .right { right: 14px; animation-delay: -1.2s; }

    @keyframes banner-glow {
      from { box-shadow: 0 10px 32px rgba(201, 168, 76, 0.18), inset 0 0 24px rgba(255, 255, 255, 0.4); }
      to   { box-shadow: 0 14px 40px rgba(232, 180, 184, 0.35), inset 0 0 30px rgba(255, 255, 255, 0.55); }
    }

    @keyframes balloon-drift {
      from { transform: translateY(-58%) rotate(-6deg); }
      to   { transform: translateY(-42%) rotate(6deg); }
    }
  `],
})
export class BirthdayBannerComponent {
  readonly countdown = inject(CountdownService);
}
