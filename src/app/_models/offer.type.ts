import {FormControl} from '@angular/forms';

export interface offerDescriptionModel {
  label: string;
  description: string;
  icon?: string;
}

export const offerDescription: offerDescriptionModel[] = [
  {
    label: 'Finansowanie',
    description: 'Elastyczne warunki najmu dopasowane do Twoich potrzeb i budżetu.',
    icon: '/layout/images/1.svg'
  },
  {
    label: 'Serwis pojazdu',
    description: 'Regularne przeglądy i naprawy w cenie — bez dodatkowych kosztów.',
    icon: '/layout/images/2.svg'
  },
  {
    label: 'Ubezpieczenie OC/AC/NNW',
    description: 'Pełna ochrona przez cały okres wynajmu, wliczona w ratę.',
    icon: '/layout/images/3.svg'
  },
  {
    label: 'Assistance 24h',
    description: 'Pomoc na drodze o każdej porze — w Polsce i za granicą.',
    icon: '/layout/images/4.svg'
  },
  {
    label: 'Opony letnie i zimowe',
    description: 'Zawsze gotowy do jazdy!',
    icon: '/layout/images/5.svg'
  }
];

export const descriptionBanner = {
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="52" viewBox="0 0 60 52" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3246 0C13.8811 0 10.824 2.20344 9.7351 5.4702L6.75368 14.4144L5.201 13.5179C4.24441 12.9657 3.02123 13.2934 2.46895 14.25C1.91666 15.2066 2.24441 16.4298 3.201 16.982L5.46256 18.2878L5.13882 19.259C2.07342 20.9674 0 24.2416 0 28V40C0 44.4183 3.58172 48 8 48C12.0796 48 15.446 44.9463 15.9381 41H29.0289C29.0097 40.6691 29 40.3357 29 40C29 38.9763 29.0905 37.9738 29.2639 37H14C12.8954 37 12 37.8954 12 39V40C12 42.2091 10.2091 44 8 44C5.79086 44 4 42.2091 4 40V28C4 24.6863 6.68629 22 10 22H50C52.6166 22 54.842 23.6749 55.6625 26.0111C57.3575 27.1841 58.8289 28.6572 60 30.3536V28C60 24.2416 57.9266 20.9674 54.8612 19.259L54.505 18.1905L56.5981 16.982C57.5547 16.4298 57.8824 15.2066 57.3301 14.25C56.7778 13.2934 55.5547 12.9657 54.5981 13.5179L53.2139 14.3171L50.2649 5.4702C49.176 2.20344 46.1189 0 42.6754 0H17.3246ZM50.2251 18L46.4702 6.7351C45.9257 5.1017 44.3972 4 42.6754 4H17.3246C15.6028 4 14.0743 5.1017 13.5298 6.7351L9.7749 18H50.2251Z" fill="white"/><path d="M19 30C19 31.1046 18.1046 32 17 32H13C11.8954 32 11 31.1046 11 30C11 28.8954 11.8954 28 13 28H17C18.1046 28 19 28.8954 19 30Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M55.4522 30.5478C52.0551 27.1507 46.5474 27.1507 43.1503 30.5478C41.3375 32.3607 40.4934 34.7752 40.614 37.1442L35.7069 42.0513C33.431 44.3272 33.431 48.0172 35.7069 50.2931C37.9828 52.569 41.6728 52.569 43.9488 50.2931L48.8558 45.386C51.2248 45.5066 53.6393 44.6625 55.4522 42.8497C58.8493 39.4526 58.8493 33.9449 55.4522 30.5478ZM45.9788 33.3762C47.8137 31.5413 50.7888 31.5413 52.6238 33.3762C54.4587 35.2112 54.4587 38.1863 52.6238 40.0212C51.4959 41.1491 49.9381 41.5855 48.4711 41.3241C47.8275 41.2094 47.1684 41.4166 46.7061 41.8789L41.1203 47.4646C40.4065 48.1785 39.2492 48.1785 38.5354 47.4646C37.8215 46.7508 37.8215 45.5935 38.5354 44.8797L44.1211 39.2939C44.5834 38.8316 44.7906 38.1726 44.6759 37.5289C44.4145 36.0619 44.8509 34.5041 45.9788 33.3762Z" fill="#C1D342"/></svg>'
}

export interface offerFirstStepModel {
  offer_id: number;
  rental_months: number;
  annual_mileage_limit: number;
  monthly_price: number;
}

export interface offerOrderModel extends offerFirstStepModel {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pickup_location: pickupLocation;
}

export interface OfferFormValues {
  offer_id: FormControl<number | null>;
  rental_months: FormControl<number | null>;
  annual_mileage_limit: FormControl<number | null>;
  monthly_price: FormControl<number | null>;
  first_name: FormControl<string | null>;
  last_name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  pickup_location: FormControl<pickupLocation | null>;
}

export enum pickupLocation {
  salon = 'salon',
  home_delivery = 'home_delivery'
}
