import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import lottie, {AnimationItem} from 'lottie-web';

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
      path: '/layout/lottie/loader.json'
    };
    this.animation = lottie.loadAnimation(config);
  }
}
