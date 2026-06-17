import { Injectable, computed, signal } from '@angular/core';
import { interval } from 'rxjs';

/** Month/day for recurring birthday fireworks (JS month index: 0 = January). */
export const ABDO_BIRTHDAY = { monthIndex: 4, day: 10 } as const;
export const HODHOD_BIRTHDAY = { monthIndex: 5, day: 18 } as const;

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

  readonly isAbdoBirthdayToday = computed(() => this.isAnnualDateToday(ABDO_BIRTHDAY.monthIndex, ABDO_BIRTHDAY.day));
  readonly isHodhodBirthdayToday = computed(() => this.isAnnualDateToday(HODHOD_BIRTHDAY.monthIndex, HODHOD_BIRTHDAY.day));

  /** True on Abdo’s or Hodhod’s calendar birthday (local date). */
  readonly isAnyoneBirthdayToday = computed(
    () => this.isAbdoBirthdayToday() || this.isHodhodBirthdayToday()
  );

  readonly birthdayCelebrantsToday = computed(() => {
    const names: string[] = [];
    if (this.isAbdoBirthdayToday()) names.push('Abdo');
    if (this.isHodhodBirthdayToday()) names.push('Hodhod');
    return names;
  });

  readonly birthdayHeadline = computed(() => {
    const names = this.birthdayCelebrantsToday();
    if (names.length === 2) return 'Happy Birthday Abdo & Hodhod!';
    if (names.length === 1) return `Happy Birthday ${names[0]}!`;
    return '';
  });

  isAnnualDateToday(monthIndex: number, day: number): boolean {
    const n = this.now();
    return n.getMonth() === monthIndex && n.getDate() === day;
  }

  constructor() {
    interval(1000).subscribe(() => this.now.set(new Date()));
  }

  /** Next occurrence of month/day at local midnight (for countdown cards). */
  nextAnnualDate(monthIndex: number, day: number): Date {
    const now = this.now();
    const target = new Date(now.getFullYear(), monthIndex, day, 0, 0, 0);
    if (target <= now) target.setFullYear(target.getFullYear() + 1);
    return target;
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
