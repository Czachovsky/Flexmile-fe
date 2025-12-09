import {Component, input, OnInit, OnDestroy, signal, Renderer2, ElementRef, inject} from '@angular/core';
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
  private renderer: Renderer2 = inject(Renderer2);
  private elementRef: ElementRef = inject(ElementRef);
  private scrollListener?: () => void;

  ngOnInit(): void {
    if (this.fileName()) {
      this.initializeAudio();
    }
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      window.removeEventListener('resize', this.scrollListener);
    }
  }

  private setupScrollListener(): void {
    this.scrollListener = () => this.updatePosition();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('resize', this.scrollListener, { passive: true });
    // Initial calculation
    setTimeout(() => this.updatePosition(), 0);
  }

  private updatePosition(): void {
    const footer = document.querySelector('footer');
    const playerElement = this.elementRef.nativeElement.querySelector('.player');
    
    if (!footer || !playerElement) {
      // Fallback to fixed positioning if footer not found
      this.renderer.setStyle(playerElement, 'bottom', '40px');
      return;
    }

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const footerTop = footerRect.top;
    const offset = 40; // 40px nad stopką
    const playerHeight = 48; // Height of player element

    // If footer is visible in viewport (top of footer is above bottom of viewport)
    if (footerTop < viewportHeight) {
      // Calculate distance from bottom of viewport to top of footer
      const distanceFromBottom = viewportHeight - footerTop;
      // Set bottom position to be 40px above footer top
      // We need to account for player height, so we add it
      const bottomPosition = distanceFromBottom + offset;
      this.renderer.setStyle(playerElement, 'bottom', `${bottomPosition}px`);
    } else {
      // Footer is below viewport, use default 40px from bottom
      this.renderer.setStyle(playerElement, 'bottom', '40px');
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
