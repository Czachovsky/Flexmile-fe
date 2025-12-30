import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {debounceTime, fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

@Injectable({
  providedIn: 'root'
})
export class Screen {
  private destroyRef = inject(DestroyRef);

  private readonly defaultBreakpoints: BreakpointConfig = {
    mobile: 992,
    tablet: 1024,
    desktop: 1200
  };

  private screenWidth = signal<number>(this.getCurrentWidth());

  readonly isLowerThanTablet = computed(() =>
  this.screenWidth() < this.defaultBreakpoints.tablet
  )

  readonly isMobile = computed(() =>
    this.screenWidth() < this.defaultBreakpoints.mobile
  );

  readonly isTablet = computed(() =>
    this.screenWidth() >= this.defaultBreakpoints.mobile &&
    this.screenWidth() < this.defaultBreakpoints.desktop
  );

  readonly isDesktop = computed(() =>
    this.screenWidth() >= this.defaultBreakpoints.desktop
  );
  readonly screenSize = computed(() =>
    this.screenWidth()
  );


  constructor() {
    this.initializeResizeListener();
  }

  private initializeResizeListener(): void {
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(10),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.screenWidth.set(this.getCurrentWidth());
        });
    }
  }

  private getCurrentWidth(): number {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 0;
  }
}
