import {Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import lottie, {AnimationItem} from 'lottie-web';
import {AnimationService} from '@services/animation';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'flexmile-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', {static: true}) container!: ElementRef;
  width: string = '120px';
  height: string = '120px';
  private animation?: AnimationItem;
  private readonly animationService: AnimationService = inject(AnimationService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadAnimation();
  }

  ngOnDestroy() {
    this.animation?.destroy();
  }

  private loadAnimation(): void {
    this.animationService.getAnimationData('/layout/lottie/loader.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (animationData) => {
          const config: any = {
            container: this.container.nativeElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData,
          };
          this.animation = lottie.loadAnimation(config);
        },
        error: (error) => {
          console.error('Error loading animation:', error);
        }
      });
  }
}
