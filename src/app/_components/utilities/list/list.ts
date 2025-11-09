import {Component, input} from '@angular/core';
import {Car} from '@components/utilities/car/car';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {badgeSizes} from '@models/common.types';
import {OfferListModel} from '@models/offers.types';

@Component({
  selector: 'flexmile-list',
  imports: [
    Car,
    BannerList
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  hideHeader = input<boolean>(false);
  offerList = input<OfferListModel>();
  protected readonly badgeSizes = badgeSizes;
}
