import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="section-wrap corner">
      <h1>Wedding Corner</h1>
      <p>The Big Day is Coming... 💍</p>
      <div class="board">
        @for (tile of tiles; track tile) {
          <div class="tile"></div>
        }
      </div>
      <div class="chips ui-font">
        @for (chip of chips; track chip) {
          <span>{{ chip }}</span>
        }
      </div>
      <p>We can't wait to celebrate with you ♥ ♥ ♥</p>
    </section>
  `,
  styles: [`.corner{text-align:center}.board{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:460px;margin:20px auto}.tile{height:100px;background:linear-gradient(135deg,var(--primary-beige),var(--light-olive));border-radius:12px;transition:transform .2s}.tile:hover{transform:scale(1.04)}.chips{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.chips span{padding:6px 10px;border-radius:999px;background:var(--primary-beige)}`]
})
export class WeddingCornerComponent {
  readonly tiles = Array.from({ length: 9 }, (_, i) => i);
  readonly chips = ['Dream Venue', 'Colors', 'Flowers', 'Music', 'Dress Style'];
}
