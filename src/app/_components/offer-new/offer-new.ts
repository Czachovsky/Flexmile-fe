import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OfferDetails} from '@components/offer-new/_components/offer-details/offer-details';
import {OfferOrder} from '@components/offer-new/_components/offer-order/offer-order';
import {OffersService} from '@services/offers';
import {OfferListModel, OfferListOffersModel, OfferModel} from '@models/offers.types';
import {offerFirstStepModel, SIMILAR_OFFERS_COUNT} from '@models/offer.type';
import {Player} from '@components/utilities/player/player';
import {Loader} from '@components/utilities/loader/loader';

@Component({
  selector: 'flexmile-offer-new',
  imports: [
    OfferDetails,
    OfferOrder,
    Player,
    Loader
  ],
  templateUrl: './offer-new.html',
  styleUrl: './offer-new.scss',
})
export class OfferNew implements OnInit {
  private readonly offerService: OffersService = inject(OffersService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  public readonly isLoading = signal(true);
  public readonly offerData = signal<OfferModel | null>(null);
  public ordering: boolean = false;
  public orderObject: offerFirstStepModel | undefined;
  public similarOffers: OfferListOffersModel[] = [];

  ngOnInit() {
    // Subskrybujemy dane z resolvera
    const subscription = this.route.data.subscribe(data => {
      const resolvedOffer = data['offer'] as OfferModel | null;
      
      if (resolvedOffer) {
        this.offerData.set(resolvedOffer);
        this.isLoading.set(false);
        this.getSimilarOffers();
      } else {
        // Jeśli resolver zwrócił null, sprawdzamy serwis jako fallback
        const currentOffer = this.offerService.getCurrentOffert();
        if (currentOffer) {
          this.offerData.set(currentOffer);
          this.isLoading.set(false);
          this.getSimilarOffers();
        } else {
          // Jeśli nie ma oferty, ukryjemy loader (resolver przekierował lub wystąpił błąd)
          this.isLoading.set(false);
        }
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  showNextStep(orderObject: offerFirstStepModel): void {
    this.ordering = true;
    this.orderObject = orderObject;
  }

  getSimilarOffers(): void {
    const offer = this.offerData();
    if (!offer) return;
    
    console.log(offer.brand.slug);
    this.offerService.getOffers({car_brand: offer.brand.slug, per_page: SIMILAR_OFFERS_COUNT}).subscribe({
      next: (offers: OfferListModel) => {
        if (offers && offers.offers.length) {
          this.similarOffers = offers.offers;
        }
      }
    })
  }

}
