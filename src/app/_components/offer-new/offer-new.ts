import {Component, inject, OnInit} from '@angular/core';
import {OfferDetails} from '@components/offer-new/_components/offer-details/offer-details';
import {OfferOrder} from '@components/offer-new/_components/offer-order/offer-order';
import {OffersService} from '@services/offers';
import {OfferListModel, OfferListOffersModel, OfferModel} from '@models/offers.types';
import {offerFirstStepModel, SIMILAR_OFFERS_COUNT} from '@models/offer.type';

@Component({
  selector: 'flexmile-offer-new',
  imports: [
    OfferDetails,
    OfferOrder
  ],
  templateUrl: './offer-new.html',
  styleUrl: './offer-new.scss',
})
export class OfferNew implements OnInit {
  private readonly offerService: OffersService = inject(OffersService);
  public readonly offerData: OfferModel = this.offerService.getCurrentOffert()!;
  public ordering: boolean = false;
  public orderObject: offerFirstStepModel | undefined;
  public similarOffers: OfferListOffersModel[] = [];

  ngOnInit() {
    this.getSimilarOffers();
  }

  showNextStep(orderObject: offerFirstStepModel): void {
    this.ordering = true;
    this.orderObject = orderObject;
  }

  getSimilarOffers(): void {
    console.log(this.offerData.brand.slug);
    this.offerService.getOffers({car_brand: this.offerData.brand.slug, per_page: SIMILAR_OFFERS_COUNT}).subscribe({
      next: (offers: OfferListModel) => {
        if (offers && offers.offers.length) {
          this.similarOffers = offers.offers;
        }

      }
    })
  }

}
