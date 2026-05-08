import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav ui-font">
      <button class="logo" type="button" (click)="onLogoClick()">A ♥ H</button>
      <button class="menu" type="button" aria-label="Toggle navigation menu" (click)="menuOpen.set(!menuOpen())">☰</button>
      <div class="links" [class.open]="menuOpen()">
        @for (item of links; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="active" (click)="menuOpen.set(false)">{{ item.label }}</a>
        }
      </div>
      @if (toastVisible()) {
        <div class="toast">Mabrook ya Abdo w Hodhod! مبروك 🎉</div>
      }
    </nav>
  `,
  styles: [
    `.nav{position:fixed;top:0;left:0;right:0;background:rgba(74,90,46,.88);backdrop-filter:blur(8px);z-index:10;padding:12px 20px;display:flex;gap:16px;align-items:center;border-bottom:1px solid rgba(245,240,232,.14)}.logo{color:var(--primary-beige);background:none;border:none;font-weight:700;font-size:18px;letter-spacing:.6px;cursor:pointer}.links{display:flex;gap:14px;margin-left:auto}.links a{color:var(--primary-beige);text-decoration:none;padding:8px 10px;border-radius:999px;transition:background-color .2s ease,color .2s ease}.links a:hover{background:rgba(245,240,232,.12)}.active{background:rgba(201,168,76,.2);color:#fff;border-bottom:2px solid transparent}.menu{display:none;background:transparent;border:none;color:var(--primary-beige);font-size:24px;line-height:1;cursor:pointer}.toast{position:absolute;top:64px;left:20px;background:var(--gold-accent);padding:8px 12px;border-radius:10px}@media(max-width:760px){.menu{display:block;margin-left:auto}.links{display:none;position:absolute;top:60px;right:10px;flex-direction:column;background:var(--dark-olive);padding:12px;border-radius:10px;min-width:210px}.links.open{display:flex}}`
  ]
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
  readonly toastVisible = signal(false);
  private logoClicks = 0;
  readonly links = [
    { path: '/', label: 'Home' },
    { path: '/our-story', label: 'Our Story' },
    { path: '/countdowns', label: 'Countdowns' },
    { path: '/bucket-list', label: 'Bucket List' },
    { path: '/love-notes', label: 'Love Notes' },
    { path: '/wedding-corner', label: 'Wedding Corner' }
  ];

  onLogoClick(): void {
    this.logoClicks += 1;
    if (this.logoClicks >= 5) {
      this.toastVisible.set(true);
      this.logoClicks = 0;
      setTimeout(() => this.toastVisible.set(false), 2200);
    }
  }
}
