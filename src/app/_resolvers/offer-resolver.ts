import {ResolveFn, Router} from '@angular/router';
import {catchError, of, tap} from 'rxjs';
import {inject} from '@angular/core';
import {Offers} from '@services/offers';
import {OfferModel} from '@models/offers.types';

export const offerResolver: ResolveFn<any> = (route, state) => {
  const offerParamId = Number(route.paramMap.get('id'));
  const router: Router = inject(Router);
  const offerService: Offers = inject(Offers)
  if (isNaN(offerParamId) || offerParamId <= 0) {
    void router.navigate(['/oferty']);
    return of(null);
  }
  return offerService.getOffer(offerParamId).pipe(
    tap((offer: OfferModel | null) => {
      offerService.setCurrentOffer(offer);
    }),
    catchError(err => {
      offerService.setCurrentOffer(null);
      const errorCode = err?.error?.code;
      const status = err?.error?.data?.status;
      if (errorCode === 'not_found' && status === 404) {
        void router.navigate(['/404']);
      } else {
        console.error('Failed to resolve offer', err);
        void router.navigate(['/oferty']);
      }
      return of(null);
    })
  )
};
