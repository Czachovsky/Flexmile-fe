import {ResolveFn, Router} from '@angular/router';
import {catchError, of, tap} from 'rxjs';
import {inject} from '@angular/core';
import {Offers} from '@services/offers';
import {OfferModel} from '@models/offers.types';

export const offerResolver: ResolveFn<any> = (route, state) => {
  const offerParamId = Number(route.paramMap.get('id'));
  const router: Router = inject(Router);
  const offerService: Offers = inject(Offers)
  console.log('offerParamId', offerParamId);
  if (isNaN(offerParamId) || offerParamId <= 0) {
    void router.navigate(['/offers']);
    return of(null);
  }
  return offerService.getOffer(offerParamId).pipe(
    tap((offer: OfferModel | null) => {
      offerService.setCurrentOffer(offer);
    })
  )
};
