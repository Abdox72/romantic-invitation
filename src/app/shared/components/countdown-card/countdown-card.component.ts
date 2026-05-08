import { Component, Input } from '@angular/core';
import { TimeParts } from '../../../core/services/countdown.service';

@Component({
  selector: 'app-countdown-card',
  standalone: true,
  template: `
    <article class="card romantic-card">
      <h3>{{ title }}</h3>
      <p>{{ value.days }}d {{ value.hours }}h {{ value.minutes }}m {{ value.seconds }}s</p>
    </article>
  `,
  styles: [`.card{padding:20px;color:var(--primary-olive);border-color:var(--gold-accent)}h3{margin:0 0 8px}`]
})
export class CountdownCardComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) value!: TimeParts;
}
