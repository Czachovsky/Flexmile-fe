import {Routes} from '@angular/router';
import {Offers} from '@components/offers/offers';
import {HomePage} from '@components/home-page/home-page';
import {offerResolver} from './_resolvers/offer-resolver';
import {PageNotFound} from '@components/page-not-found/page-not-found';
import {OfferNew} from '@components/offer-new/offer-new';
import {PrivacyPolicy} from '@components/privacy-policy/privacy-policy';
import {TermsConditions} from '@components/terms-conditions/terms-conditions';
import {CookiesPolicy} from '@components/cookies-policy/cookies-policy';

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
    component: OfferNew,
    title: 'Szczegóły samochodu - Flexmile',
    resolve: {
      offer: offerResolver
    },
  },
  {
    path: 'polityka-prywatnosci',
    component: PrivacyPolicy,
    title: 'Polityka prywatności - Flexmile',
  },
  {
    path: 'regulamin',
    component: TermsConditions,
    title: 'Regulamin - Flexmile',
  },
  {
    path: 'polityka-cookies',
    component: CookiesPolicy,
    title: 'Polityka cookies - Flexmile',
  },
  {path: '404', component: PageNotFound},
  {path: '**', component: PageNotFound},
];
