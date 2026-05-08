import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TimelineEntry } from '../../core/models/timeline-entry.model';
import { OliveDividerComponent } from '../../shared/components/olive-divider/olive-divider.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  standalone: true,
  imports: [OliveDividerComponent, ScrollRevealDirective],
  animations: [trigger('entry', [transition(':enter', [style({ opacity: 0, transform: 'translateY(24px)' }), animate('500ms ease-out')])])],
  template: `
    <section class="section-wrap story">
      <h1>Our Story</h1>
      <div class="timeline">
        @for (item of entries; track item.title; let i = $index) {
          <article appScrollReveal [@entry] class="item" [class.right]="i % 2 === 1">
            <h3>{{ item.icon }} {{ item.title }}</h3>
            <small>{{ item.date }}</small>
            <p>{{ item.description }}</p>
            <app-olive-divider />
          </article>
        }
      </div>
    </section>
  `,
  styles: [`.story{padding:30px 0}.timeline{display:grid;gap:16px}.item{padding:18px;border-left:4px solid var(--primary-olive);background:#fff8ee}.item.right{border-left:none;border-right:4px solid var(--primary-olive);text-align:right}@media(min-width:900px){.timeline{grid-template-columns:1fr 1fr}.item.right{grid-column:2}}`]
})
export class OurStoryComponent {
  readonly entries: TimelineEntry[] = [
    { icon: '🌹', date: 'April 11, 2026', title: 'The Beginning', description: 'Our first date — the day two hearts found each other' },
    { icon: '💍', date: 'May 27, 2026', title: 'The Question', description: 'On the night of May 27th, he asked the most important question' },
    { icon: '🎉', date: 'May 28, 2026', title: 'Our Engagement Day', description: 'The celebration that made it official — we said yes to forever' },
    { icon: '📅', date: 'TBD', title: 'Our Wedding Day', description: 'The best day is still ahead... 💫' }
  ];
}
