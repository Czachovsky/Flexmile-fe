import {Component} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {OPINIONS, OpinionsModel} from '@models/opinions.types';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'flexmile-opinions',
  imports: [
    CarouselModule
  ],
  templateUrl: './opinions.html',
  styleUrl: './opinions.scss',
})
export class Opinions {
  public readonly opinions: OpinionsModel[] = OPINIONS;
  public readonly customOptions: OwlOptions = {
    navText: ['<i class="pi pi-arrow-left"></i>', '<i class="pi pi-arrow-right"></i>'],
    nav: true,
    loop: true,
    dots: true,
    navSpeed: 1000,
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    center: true,
    margin: 24,
    items: 3,
    responsive: {
      0: {items: 1},
      992: {items: 3},
    }
  }


  getStarsArray(rating: number): boolean[] {
    return Array.from({length: 5}, (_, i) => i < rating);
  }

}
