import {Component, input} from '@angular/core';
import {OfferListModel, OfferModel} from '@models/offers.types';
import {badgeSizes} from '@models/common.types';
import {Car} from '@components/utilities/car/car';

@Component({
  selector: 'flexmile-homepage-list',
  imports: [
    Car
  ],
  templateUrl: './homepage-list.html',
  styleUrl: './homepage-list.scss',
})
export class HomepageList {
  offerList = input<OfferListModel>();
  protected readonly badgeSizes = badgeSizes;

}
