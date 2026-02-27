import {AfterViewInit, Component, ElementRef, inject, input, InputSignal, ViewChild} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Car} from '@components/utilities/car/car';
import {OfferListOffersModel} from '@models/offers.types';
import {Router} from '@angular/router';
import Swiper from 'swiper';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';

@Component({
  selector: 'flexmile-offers-carousel',
  imports: [
    ButtonComponent,
    Car
  ],
  templateUrl: './offers-carousel.html',
  styleUrl: './offers-carousel.scss',
})
export class OffersCarousel implements AfterViewInit{
  private router: Router = inject(Router);
  public similarOffers: InputSignal<OfferListOffersModel[] | []> = input.required<OfferListOffersModel[] | []>();
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper!: Swiper;

  public goToList(): void {
    void this.router.navigate(['/oferty']);
  }

  ngAfterViewInit() {
    if(this.similarOffers().length > 3){
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
      console.log(this.swiper);
    }
  }
}
