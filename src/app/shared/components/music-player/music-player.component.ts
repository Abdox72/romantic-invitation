import { Component, inject } from '@angular/core';
import { MusicService } from '../../../core/services/music.service';

@Component({
  selector: 'app-music-player',
  standalone: true,
  template: `
    <div class="music-controls">

      <!-- play / pause -->
      <button
        class="music"
        type="button"
        [class.playing]="music.isPlaying()"
        (click)="music.toggle()"
      >
        {{ music.isPlaying() ? '⏸' : '♪' }}
      </button>

      <!-- next random music -->
      <button
        class="music next"
        type="button"
        (click)="music.next()"
      >
        ⏭
      </button>

    </div>
  `,
  styles: [`
    .music-controls{
      position:fixed;
      right:20px;
      bottom:20px;
      display:flex;
      gap:12px;
      z-index:20;
    }

    .music{
      border:none;
      border-radius:50%;
      width:56px;
      height:56px;
      background:linear-gradient(
        145deg,
        var(--primary-olive),
        var(--dark-olive)
      );
      color:#fff;
      font-size:22px;
      cursor:pointer;
      box-shadow:0 12px 24px rgba(44,36,22,.26);

      transition:
        transform .2s ease,
        box-shadow .2s ease,
        filter .2s ease;
    }

    .music:hover{
      transform:translateY(-2px) scale(1.02);
      box-shadow:0 16px 28px rgba(44,36,22,.32);
    }

    .music:active{
      transform:scale(.96);
    }

    .music.playing{
      filter:saturate(1.15);
    }

    .next{
      font-size:18px;
    }
  `]
})
export class MusicPlayerComponent {
  readonly music = inject(MusicService);
}