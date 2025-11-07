import { Routes } from '@angular/router';
import {Offers} from '@components/offers/offers';
import {Offer} from '@components/offer/offer';
import {HomePage} from '@components/home-page/home-page';
import {offerResolver} from './_resolvers/offer-resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Flexmile - Wynajem samochodów'
  },
  {
    path: 'oferty',
    component: Offers,
    title: 'Samochody - Flexmile'
  },
  {
    path: 'oferta/:id',
    component: Offer,
    title: 'Szczegóły samochodu - Flexmile',
    resolve: {
      offer: offerResolver
    }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
