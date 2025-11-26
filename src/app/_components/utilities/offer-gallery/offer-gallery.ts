import {Component, HostListener, input, InputSignal, OnInit} from '@angular/core';
import {OfferGalleryModel} from '@models/offers.types';

@Component({
  selector: 'flexmile-offer-gallery',
  imports: [],
  templateUrl: './offer-gallery.html',
  styleUrl: './offer-gallery.scss',
})
export class OfferGallery implements OnInit  {
  gallery = input<OfferGalleryModel[]>([]);
  hideControls: InputSignal<boolean> = input<boolean>(false);
  /**
   * Index używany w widoku głównym (poza trybem lightbox).
   */
  public currentIndex: number = 0;

  /**
   * Niezależny indeks używany wyłącznie w trybie lightbox.
   * Dzięki temu zmiana zdjęcia w lightboxie nie wpływa na obraz główny.
   */
  public lightboxIndex: number = 0;

  public isLightboxOpen: boolean = false;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private minSwipeDistance: number = 50;
  private swipeContext: 'main' | 'lightbox' = 'main';

  ngOnInit(): void {
    this.preloadImages();
  }

  get currentImage(): OfferGalleryModel | null {
    return this.gallery()[this.currentIndex] || null;
  }

  get currentLightboxImage(): OfferGalleryModel | null {
    return this.gallery()[this.lightboxIndex] || null;
  }

  get totalImages(): number {
    return this.gallery()?.length || 0;
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.totalImages) {
      this.currentIndex = index;
    }
  }

  goToLightboxImage(index: number): void {
    if (index >= 0 && index < this.totalImages) {
      this.lightboxIndex = index;
    }
  }

  previousImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      // Loop to last image
      this.currentIndex = this.totalImages - 1;
    }
  }

  previousLightboxImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.lightboxIndex > 0) {
      this.lightboxIndex--;
    } else {
      // Loop to last image
      this.lightboxIndex = this.totalImages - 1;
    }
  }

  nextImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.currentIndex < this.totalImages - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  nextLightboxImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.lightboxIndex < this.totalImages - 1) {
      this.lightboxIndex++;
    } else {
      this.lightboxIndex = 0;
    }
  }

  openLightbox(): void {
    // Start w lightboxie od aktualnie wybranego zdjęcia z widoku głównego
    this.lightboxIndex = this.currentIndex;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  }

  closeLightbox(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isLightboxOpen = false;
    document.body.style.overflow = ''; // Restore body scroll
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.previousLightboxImage();
        break;
      case 'ArrowRight':
        this.nextLightboxImage();
        break;
      case 'Escape':
        this.closeLightbox();
        break;
    }
  }

  onTouchStart(event: TouchEvent, context: 'main' | 'lightbox' = 'main'): void {
    this.swipeContext = context;
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture(): void {
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        if (this.swipeContext === 'lightbox') {
          this.previousLightboxImage();
        } else {
          this.previousImage();
        }
      } else {
        if (this.swipeContext === 'lightbox') {
          this.nextLightboxImage();
        } else {
          this.nextImage();
        }
      }
    }
  }

  private mouseStartX: number = 0;
  private mouseEndX: number = 0;
  private isMouseDown: boolean = false;

  onMouseDown(event: MouseEvent, context: 'main' | 'lightbox' = 'main'): void {
    this.swipeContext = context;
    this.isMouseDown = true;
    this.mouseStartX = event.clientX;
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isMouseDown) return;

    this.isMouseDown = false;
    this.mouseEndX = event.clientX;

    const swipeDistance = this.mouseEndX - this.mouseStartX;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        if (this.swipeContext === 'lightbox') {
          this.previousLightboxImage();
        } else {
          this.previousImage();
        }
      } else {
        if (this.swipeContext === 'lightbox') {
          this.nextLightboxImage();
        } else {
          this.nextImage();
        }
      }
    }
  }

  onMouseLeave(): void {
    this.isMouseDown = false;
  }

  private preloadImages(): void {
    if (!this.gallery()) return;

    this.gallery().forEach((image: OfferGalleryModel) => {
      const img = new Image();
      img.src = image.large;
    });
  }

  getImageUrl(size: 'thumbnail' | 'medium' | 'large' = 'large'): string {
    const image = this.currentImage;
    if (!image) return '';

    return image[size] || image.url;
  }

  getLightboxImageUrl(size: 'thumbnail' | 'medium' | 'large' = 'large'): string {
    const image = this.currentLightboxImage;
    if (!image) return '';

    return image[size] || image.url;
  }

}
