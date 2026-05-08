import { Injectable, computed, signal } from '@angular/core';
import { interval } from 'rxjs';

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({ providedIn: 'root' })
export class CountdownService {
  private readonly now = signal(new Date());
  readonly tick = computed(() => this.now());

  constructor() {
    interval(1000).subscribe(() => this.now.set(new Date()));
  }

  countUpFrom(date: Date): TimeParts {
    return this.diff(this.now().getTime() - date.getTime());
  }

  countDownTo(date: Date): TimeParts {
    return this.diff(date.getTime() - this.now().getTime());
  }

  private diff(ms: number): TimeParts {
    const safe = Math.max(ms, 0);
    const totalSeconds = Math.floor(safe / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }
}
