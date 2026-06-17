import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ABDO_BIRTHDAY, CountdownService, HODHOD_BIRTHDAY } from '../../core/services/countdown.service';
import { CountdownCardComponent } from '../../shared/components/countdown-card/countdown-card.component';
import { FireworksCanvasComponent } from '../../shared/components/fireworks-canvas/fireworks-canvas.component';
import { BirthdayBannerComponent } from '../../shared/components/birthday-banner/birthday-banner.component';

@Component({
  standalone: true,
  imports: [CountdownCardComponent, FireworksCanvasComponent, BirthdayBannerComponent],
  animations: [trigger('stagger', [transition(':enter', [query('app-countdown-card', [style({ opacity: 0, transform: 'translateY(20px)' }), stagger(120, animate('500ms ease-out', style({ opacity: 1, transform: 'none' })))])])])],
  template: `
    <section class="section-wrap countdowns-page" [class.birthday-mode]="countdown.isAnyoneBirthdayToday()">
      @if (countdown.isAnyoneBirthdayToday()) {
        <app-fireworks-canvas [intensity]="1.5" />
      }
      @if (countdown.isAnyoneBirthdayToday()) {
        <app-birthday-banner />
      }
      <h1>Our Countdowns</h1>
      <div class="cards" @stagger>
        <app-countdown-card title="Days Together" [value]="daysTogether()" />
        <app-countdown-card title="Days Engaged" [value]="daysEngaged()" />
        <app-countdown-card
          [title]="abdoBirthdayTitle()"
          [value]="abdoBirthday()"
          [celebrate]="countdown.isAbdoBirthdayToday()"
          celebrateMessage="Happy Birthday Abdo! 🎂"
        />
        <app-countdown-card
          [title]="hodhodBirthdayTitle()"
          [value]="hodhodBirthday()"
          [celebrate]="countdown.isHodhodBirthdayToday()"
          celebrateMessage="Happy Birthday Hodhod! 🎂"
        />
      </div>
    </section>
  `,
  styles: [`
    .countdowns-page { position: relative; overflow: hidden; min-height: 72vh; }
    .countdowns-page > *:not(app-fireworks-canvas) { position: relative; z-index: 2; }
    .birthday-mode {
      background: radial-gradient(ellipse at 50% 0%, rgba(255, 248, 238, 0.5), transparent 58%);
    }
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
  `]
})
export class CountdownsComponent {
  readonly countdown = inject(CountdownService);
  readonly daysTogether = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-04-11T00:00:00'))));
  readonly daysEngaged = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-05-30T00:00:00'))));
  readonly abdoBirthdayTitle = computed(() =>
    this.countdown.isAbdoBirthdayToday() ? "Abdo's Birthday" : "Abdo's Next Birthday"
  );
  readonly hodhodBirthdayTitle = computed(() =>
    this.countdown.isHodhodBirthdayToday() ? "Hodhod's Birthday" : "Hodhod's Next Birthday"
  );
  readonly abdoBirthday = computed(() =>
    (this.countdown.tick(), this.countdown.countDownTo(this.countdown.nextAnnualDate(ABDO_BIRTHDAY.monthIndex, ABDO_BIRTHDAY.day)))
  );
  readonly hodhodBirthday = computed(() =>
    (this.countdown.tick(), this.countdown.countDownTo(this.countdown.nextAnnualDate(HODHOD_BIRTHDAY.monthIndex, HODHOD_BIRTHDAY.day)))
  );
}
