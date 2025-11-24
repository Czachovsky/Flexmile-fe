import {Component, DestroyRef, ElementRef, inject, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import lottie, {AnimationItem} from 'lottie-web';
import {AnimationService} from '@services/animation';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'flexmile-animation',
  imports: [],
  template: `
    <div #lottieContainer
         [style.width]="width()"
         [style.height]="height()">
    </div>`
})
export class Animation implements OnInit, OnDestroy {
  @ViewChild('lottieContainer', {static: true}) container!: ElementRef
  width = input<string>('120px');
  height = input<string>('120px');
  animationPath: string = '/layout/lottie/lines.json';
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
    this.animationService.getAnimationData(this.animationPath)
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
