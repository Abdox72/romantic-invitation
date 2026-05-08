import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LoveNote } from '../../core/models/love-note.model';
import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <section class="section-wrap">
      <h1>Love Notes</h1>
      <div class="cols">
        <div class="romantic-card col">
          <h3>From Abdo 💚</h3>
          <textarea [formControl]="abdoControl"></textarea>
          <button (click)="save('abdo')">Save</button>
          @for (note of abdoNotes(); track note.id) {
            <article class="note">{{ note.content }}<small>{{ note.createdAt | date: 'medium' }}</small></article>
          }
        </div>
        <div class="romantic-card col">
          <h3>From Hodhod 🌸</h3>
          <textarea [formControl]="hodhodControl"></textarea>
          <button (click)="save('hodhod')">Save</button>
          @for (note of hodhodNotes(); track note.id) {
            <article class="note">{{ note.content }}<small>{{ note.createdAt | date: 'medium' }}</small></article>
          }
        </div>
      </div>
      <div class="romantic-card capsule">
        <h3>To be opened on our 1st Wedding Anniversary 💍 🔒</h3>
        <textarea [formControl]="capsule"></textarea>
        <button (click)="saveCapsule()">Lock</button>
      </div>
    </section>
  `,
  styles: [`.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.col,.capsule{padding:16px}.note{background:#fff;padding:10px 12px;border-radius:10px;margin:6px 0;display:grid;gap:6px;border:1px solid rgba(201,168,76,.24)}.note small{color:var(--warm-brown)}textarea{min-height:110px}.col h3,.capsule h3{margin:0 0 6px}`]
})
export class LoveNotesComponent {
  private readonly storage = inject(StorageService);
  readonly notes = signal<LoveNote[]>(this.storage.get('loveNotes', [] as LoveNote[]));
  readonly abdoControl = new FormControl('', { nonNullable: true });
  readonly hodhodControl = new FormControl('', { nonNullable: true });
  readonly capsule = new FormControl(this.storage.get('timeCapsule', ''), { nonNullable: true });
  readonly abdoNotes = computed(() => this.notes().filter((n) => n.author === 'abdo'));
  readonly hodhodNotes = computed(() => this.notes().filter((n) => n.author === 'hodhod'));

  save(author: 'abdo' | 'hodhod'): void {
    const control = author === 'abdo' ? this.abdoControl : this.hodhodControl;
    const content = control.value.trim();
    if (!content) return;
    const updated = [{ id: Date.now(), author, content, createdAt: new Date().toISOString() }, ...this.notes()];
    this.notes.set(updated);
    this.storage.set('loveNotes', updated);
    control.setValue('');
  }
  saveCapsule(): void {
    this.storage.set('timeCapsule', this.capsule.value);
  }
}
