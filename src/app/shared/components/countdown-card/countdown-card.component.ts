import { Component, Input } from '@angular/core';
import { TimeParts } from '../../../core/services/countdown.service';

@Component({
  selector: 'app-countdown-card',
  standalone: true,
  template: `
    <article class="card romantic-card" [class.celebrate]="celebrate">
      <h3>{{ title }}</h3>
      @if (celebrate) {
        <p class="festive">{{ celebrateMessage }}</p>
      } @else {
        <p>{{ value.days }}d {{ value.hours }}h {{ value.minutes }}m {{ value.seconds }}s</p>
      }
    </article>
  `,
  styles: [`
    .card{padding:20px;color:var(--primary-olive);border-color:var(--gold-accent)}
    h3{margin:0 0 8px}
    .celebrate{
      border-color:rgba(201,168,76,.9);
      background:linear-gradient(145deg,#fff8ee,rgba(232,180,184,.35));
      box-shadow:0 10px 28px rgba(201,168,76,.28);
      animation:celebrate-pulse 2.4s ease-in-out infinite alternate;
    }
    .festive{
      margin:0;
      font-size:clamp(18px,3vw,24px);
      font-weight:600;
      color:var(--warm-brown,#a0785a);
    }
    @keyframes celebrate-pulse{
      from{transform:translateY(0);box-shadow:0 10px 28px rgba(201,168,76,.22)}
      to{transform:translateY(-3px);box-shadow:0 14px 34px rgba(232,180,184,.38)}
    }
  `]
})
export class CountdownCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value!: TimeParts;
  @Input() celebrate = false;
  @Input() celebrateMessage = 'Today is the day! 🎉';
}
