import {Component, input, InputSignal} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {Car} from '@components/utilities/car/car';
import {OfferListOffersModel} from '@models/offers.types';

@Component({
  selector: 'flexmile-offers-carousel',
  imports: [
    ButtonComponent,
    CarouselModule,
    Car
  ],
  templateUrl: './offers-carousel.html',
  styleUrl: './offers-carousel.scss',
})
export class OffersCarousel {
  public similarOffers: InputSignal<OfferListOffersModel[] | []> = input.required<OfferListOffersModel[] | []>();
  public readonly customOptions: OwlOptions = {
    navText: ['<i class="pi pi-arrow-left"></i>', '<i class="pi pi-arrow-right"></i>'],
    nav: true,
    loop: true,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    center: true,
    margin: 24,
    items: 3,
    responsive: {
      0: {items: 1},
      992: {items: 3},
    }
  }
}
