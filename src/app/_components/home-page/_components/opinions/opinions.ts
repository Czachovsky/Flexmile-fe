import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {OPINIONS, OpinionsModel} from '@models/opinions.types';
import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

@Component({
  selector: 'flexmile-opinions',
  imports: [],
  templateUrl: './opinions.html',
  styleUrl: './opinions.scss',
})
export class Opinions implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  public readonly opinions: OpinionsModel[] = OPINIONS;
  swiper!: Swiper;


  ngAfterViewInit() {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".opinions-button-next",
        prevEl: ".opinions-button-prev",
      },
      breakpoints: {
        0: {slidesPerView: 1},
        992: {slidesPerView: 3, spaceBetween: 24,},
      },
    });

  }

  getStarsArray(rating: number): boolean[] {
    return Array.from({length: 5}, (_, i) => i < rating);
  }

}
