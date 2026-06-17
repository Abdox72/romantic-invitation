import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MusicService {
  readonly isPlaying = signal(true);

  private readonly audio = new Audio();

  // total music files
  private readonly musicCount = 20;

  private currentTrack = '';

  constructor() {
    this.audio.volume = 0.25;

    this.audio.addEventListener('ended', () => {
      void this.playRandom();
    });

    // autoplay on startup
    void this.playRandom();
  }

  async next(): Promise<void> {
    this.currentTrack = this.getRandomTrack();

    this.audio.src = this.currentTrack;

    try {
      await this.audio.play();
      this.isPlaying.set(true);
    } catch (err) {
      console.error('Playback failed', err);
      this.isPlaying.set(false);
    }
  }

  async toggle(): Promise<void> {
    if (this.audio.paused) {
      await this.audio.play();
      this.isPlaying.set(true);
    } else {
      this.audio.pause();
      this.isPlaying.set(false);
    }
  }

  private getRandomTrack(): string {
    let track = this.currentTrack;

    while (track === this.currentTrack) {
      const random = Math.floor(Math.random() * this.musicCount) + 1;

      track = `assets/music/${random}.mp3`;
    }

    return track;
  }

  private async playRandom(): Promise<void> {
    this.currentTrack = this.getRandomTrack();

    this.audio.src = this.currentTrack;

    try {
      await this.audio.play();
      this.isPlaying.set(true);
    } catch (err) {
      console.error('Playback failed', err);
      this.isPlaying.set(false);
    }
  }
}