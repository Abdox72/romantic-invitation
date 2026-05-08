import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CountdownService } from '../../core/services/countdown.service';
import { CountdownCardComponent } from '../../shared/components/countdown-card/countdown-card.component';

@Component({
  standalone: true,
  imports: [CountdownCardComponent],
  animations: [trigger('stagger', [transition(':enter', [query('app-countdown-card', [style({ opacity: 0, transform: 'translateY(20px)' }), stagger(120, animate('500ms ease-out', style({ opacity: 1, transform: 'none' })))])])])],
  template: `
    <section class="section-wrap">
      <h1>Our Countdowns</h1>
      <div class="cards" @stagger>
        <app-countdown-card title="Days Together" [value]="daysTogether()" />
        <app-countdown-card title="Days Engaged" [value]="daysEngaged()" />
        <app-countdown-card title="Abdo's Next Birthday" [value]="abdoBirthday()" />
        <app-countdown-card title="Hodhod's Next Birthday" [value]="hodhodBirthday()" />
      </div>
    </section>
  `,
  styles: [`.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}`]
})
export class CountdownsComponent {
  private readonly countdown = inject(CountdownService);
  readonly daysTogether = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-04-11T00:00:00'))));
  readonly daysEngaged = computed(() => (this.countdown.tick(), this.countdown.countUpFrom(new Date('2026-05-27T00:00:00'))));
  readonly abdoBirthday = computed(() => (this.countdown.tick(), this.countdown.countDownTo(this.nextDate(4, 10))));
  readonly hodhodBirthday = computed(() => (this.countdown.tick(), this.countdown.countDownTo(this.nextDate(5, 18))));

  private nextDate(monthIndex: number, day: number): Date {
    const now = new Date();
    const target = new Date(now.getFullYear(), monthIndex, day, 0, 0, 0);
    if (target <= now) target.setFullYear(target.getFullYear() + 1);
    return target;
  }
}
