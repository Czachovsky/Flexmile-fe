import {Routes} from '@angular/router';
import {offerResolver} from './_resolvers/offer-resolver';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@components/home-page/home-page').then(m => m.HomePage),
    title: 'Flexmile - Wynajem samochodów'
  },
  {
    path: 'oferty',
    loadComponent: () =>
      import('@components/offers/offers').then(m => m.Offers),
    title: 'Flexmile - oferty'
  },
  {
    path: 'oferta/:id',
    loadComponent: () =>
      import('@components/offer-new/offer-new').then(m => m.OfferNew),
    title: 'Flexmile - Szczegóły samochodu',
    resolve: {
      offer: offerResolver
    },
  },
  {
    path: 'polityka-prywatnosci',
    loadComponent: () =>
      import('@components/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
    title: 'Flexmile - Polityka prywatności',
  },
  {
    path: 'regulamin',
    loadComponent: () =>
      import('@components/terms-conditions/terms-conditions').then(m => m.TermsConditions),
    title: 'Flexmile - Regulamin',
  },
  {
    path: 'polityka-cookies',
    loadComponent: () =>
      import('@components/cookies-policy/cookies-policy').then(m => m.CookiesPolicy),
    title: 'Flexmile - Polityka cookies',
  },
  {
    path: '404',
    loadComponent: () =>
      import('@components/page-not-found/page-not-found').then(m => m.PageNotFound),
  },
  {path: '**', redirectTo: '404'},
];

