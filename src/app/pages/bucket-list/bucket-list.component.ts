import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BucketItem } from '../../core/models/bucket-item.model';
import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="section-wrap">
      <h1>Our Bucket List</h1>
      <div class="romantic-card bucket">
        <p class="subtitle">Dream big, check it off, and build your forever list together.</p>

        <div class="items">
          @for (item of items(); track item.id) {
            <label class="item-row">
              <input type="checkbox" [checked]="item.checked" (change)="toggle(item.id)" />
              <span class="emoji">{{ item.emoji }}</span>
              <span [class.done]="item.checked">{{ item.text }}</span>
            </label>
          }
        </div>

        <div class="progress-wrap">
          <div class="progress-label">
            <span>Progress</span>
            <strong>{{ completed() }} / {{ items().length }}</strong>
          </div>
          <div class="progress" aria-label="Bucket list completion progress">
            <div class="bar" [style.width.%]="progress()"></div>
          </div>
        </div>

        <div class="add-dream">
          <input [formControl]="dreamControl" placeholder="Add a new dream..." />
          <button type="button" (click)="addDream()">Add Dream</button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `.bucket{padding:22px;display:grid;gap:16px}.subtitle{margin:0;color:var(--warm-brown)}.items{display:grid;gap:10px;max-height:340px;overflow:auto;padding-right:4px}.item-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:rgba(250,247,242,.78);border:1px solid rgba(201,168,76,.25);transition:transform .15s ease,box-shadow .2s ease}.item-row:hover{transform:translateY(-1px);box-shadow:0 8px 16px rgba(44,36,22,.08)}.item-row input{width:18px;height:18px;accent-color:var(--primary-olive)}.emoji{font-size:18px;line-height:1}.done{text-decoration:line-through;color:var(--warm-brown)}.progress-wrap{display:grid;gap:8px}.progress-label{display:flex;justify-content:space-between;align-items:center;color:var(--warm-brown);font-size:14px}.progress-label strong{color:var(--dark-olive)}.progress{height:11px;background:#e7dfd1;border-radius:999px;overflow:hidden}.bar{height:100%;background:linear-gradient(90deg,var(--primary-olive),var(--light-olive));border-radius:999px;transition:width .35s ease}.add-dream{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.add-dream button{white-space:nowrap}@media(max-width:620px){.bucket{padding:16px}.add-dream{grid-template-columns:1fr}.add-dream button{width:100%}}`
  ]
})
export class BucketListComponent {
  private readonly storage = inject(StorageService);
  private readonly seed: BucketItem[] = [
    { id: 1, emoji: '🌊', text: 'Visit Ain Sokhna together', checked: false, addedAt: new Date().toISOString() },
    { id: 2, emoji: '🌅', text: 'Watch sunset at the Pyramids', checked: false, addedAt: new Date().toISOString() },
    { id: 3, emoji: '🚗', text: 'Road trip through Upper Egypt', checked: false, addedAt: new Date().toISOString() },
    { id: 4, emoji: '🎵', text: 'Attend a Mohamed Munir live concert', checked: false, addedAt: new Date().toISOString() },
    { id: 5, emoji: '🍽️', text: 'Cook a full Egyptian meal together', checked: false, addedAt: new Date().toISOString() },
    { id: 6, emoji: '🌿', text: 'Plant an olive tree for our home', checked: false, addedAt: new Date().toISOString() },
    { id: 7, emoji: '💌', text: 'Write letters to open on our 1st anniversary', checked: false, addedAt: new Date().toISOString() },
    { id: 8, emoji: '📸', text: 'Take a couples photo at the Nile', checked: false, addedAt: new Date().toISOString() },
    { id: 9, emoji: '✈️', text: 'Travel to Istanbul together', checked: false, addedAt: new Date().toISOString() },
    { id: 10, emoji: '💃', text: 'Dance to Amr Diab at our wedding', checked: false, addedAt: new Date().toISOString() }
  ];
  readonly dreamControl = new FormControl('', { nonNullable: true });
  readonly items = signal<BucketItem[]>(this.storage.get<BucketItem[]>('bucketItems', this.seed));
  readonly completed = computed(() => this.items().filter((i) => i.checked).length);
  readonly progress = computed(() => ((this.completed() / this.items().length) * 100) || 0);

  toggle(id: number): void {
    const updated = this.items().map((i) => (i.id === id ? { ...i, checked: !i.checked } : i));
    this.items.set(updated);
    this.storage.set('bucketItems', updated);
  }
  addDream(): void {
    const text = this.dreamControl.value.trim();
    if (!text) return;
    const list = this.items();
    const item: BucketItem = { id: Date.now(), text, emoji: '✨', checked: false, addedAt: new Date().toISOString() };
    const updated = [...list, item];
    this.items.set(updated);
    this.storage.set('bucketItems', updated);
    this.dreamControl.setValue('');
  }
}
