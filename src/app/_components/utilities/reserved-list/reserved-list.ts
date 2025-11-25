import {Component, inject, OnInit} from '@angular/core';
import {OffersService} from '@services/offers';
import {OfferListOffersModel} from '@models/offers.types';
import {Car} from '@components/utilities/car/car';

@Component({
  selector: 'flexmile-reserved-list',
  imports: [
    Car
  ],
  templateUrl: './reserved-list.html',
  styleUrl: './reserved-list.scss',
})
export class ReservedList implements OnInit {
  private readonly offerService: OffersService = inject(OffersService);
  public reservedOffersList: OfferListOffersModel[] = [];
  ngOnInit(): void {
    this.offerService.getOffers({only_reserved: true}).subscribe(offers => {
      if(offers.offers && offers.offers.length){
        this.reservedOffersList = offers.offers;
      }
    });
  }
}
