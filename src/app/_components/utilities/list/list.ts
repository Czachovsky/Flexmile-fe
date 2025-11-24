import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Car} from '@components/utilities/car/car';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {badgeSizes} from '@models/common.types';
import {OfferListModel, OfferModel} from '@models/offers.types';
import {NothingFound} from '@components/utilities/list/nothing-found/nothing-found';

@Component({
    selector: 'flexmile-list',
  imports: [
    Car,
    BannerList,
    NothingFound
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List {
  hideHeader = input<boolean>(false);
  offerList: OfferListModel | undefined;
  protected readonly badgeSizes = badgeSizes;

  trackByOfferId(index: number, offer: OfferModel): number {
    return offer.id;
  }
}
