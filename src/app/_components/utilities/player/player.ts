import {Component, input, OnInit, OnDestroy, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'flexmile-player',
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player implements OnInit, OnDestroy {
  label = input.required<string>();
  fileName = input.required<string>();

  isPlaying = signal<boolean>(false);
  volume = signal<number>(1);

  private audio: HTMLAudioElement | null = null;
  private currentFileName: string = '';

  ngOnInit(): void {
    if (this.fileName()) {
      this.initializeAudio();
    }
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  private initializeAudio(): void {
    const fileName = this.fileName();
    if (!fileName || fileName === this.currentFileName) {
      return;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    const audioPath = `/layout/sounds/${fileName}`;
    this.audio = new Audio(audioPath);
    this.currentFileName = fileName;

    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('volumechange', () => {
      this.volume.set(this.audio?.volume || 1);
    });
  }

  togglePlay(): void {
    if (!this.audio) {
      this.initializeAudio();
    }

    if (this.audio) {
      if (this.isPlaying()) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying.set(!this.isPlaying());
    }
  }
}
