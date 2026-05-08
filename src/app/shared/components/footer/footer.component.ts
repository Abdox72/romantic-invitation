import { Component } from '@angular/core';
import { OliveDividerComponent } from '../olive-divider/olive-divider.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [OliveDividerComponent],
  template: `
    <footer class="footer ui-font">
      <app-olive-divider />
      <span>Made with love for Abdo & Hodhod 💍 Since April 2026</span>
      <app-olive-divider />
    </footer>
  `,
  styles: [`.footer{display:flex;align-items:center;justify-content:center;gap:14px;padding:16px;background:var(--primary-beige);color:var(--dark-olive);font-size:14px}`]
})
export class FooterComponent {}
