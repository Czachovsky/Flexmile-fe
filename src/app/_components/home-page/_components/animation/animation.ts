import {Component, ElementRef, input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import lottie, {AnimationItem} from 'lottie-web';

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

  ngOnInit(): void {
    this.loadAnimation();
  }

  ngOnDestroy() {
    this.animation?.destroy();
  }

  private loadAnimation(): void {
    const config: any = {
      container: this.container.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: this.animationPath,
    };
    this.animation = lottie.loadAnimation(config);
  }
}
