import {Component, input, computed, inject} from '@angular/core';
import {OfferListModel, OfferListOffersModel} from '@models/offers.types';
import {badgeSizes} from '@models/common.types';
import {Car} from '@components/utilities/car/car';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {BannersService} from '@services/banners';
import {BannerTypes} from '@models/banners.types';

interface   LayoutItem {
  type: 'offer' | 'banner';
  offer?: OfferListOffersModel;
  bannerIndex?: number;
  isFullWidth?: boolean;
}

@Component({
  selector: 'flexmile-homepage-list',
  imports: [
    Car,
    BannerList
  ],
  templateUrl: './homepage-list.html',
  styleUrl: './homepage-list.scss',
})
export class HomepageList {
  private readonly bannersService: BannersService = inject(BannersService);
  offerList = input<OfferListModel>();
  protected readonly badgeSizes = badgeSizes;

  // Wzorzec: 3, 3, banner, 3, 1 (full), 3, 3
  private readonly pattern = [3, 3, 'banner', 3, 1, 3, 3, 'banner', 3, 1, 3, 3, 'banner', 3];

  private readonly banners: BannerTypes[] = this.bannersService.getBanners();

  layoutItems = computed<LayoutItem[]>(() => {
    const offers = this.offerList()?.offers || [];
    const items: LayoutItem[] = [];
    let offerIndex = 0;
    let bannerIndex = 0;

    for (const patternItem of this.pattern) {
      if (patternItem === 'banner') {
        if (bannerIndex < this.banners.length) {
          items.push({
            type: 'banner',
            bannerIndex: bannerIndex
          });
          bannerIndex++;
        }
      } else {
        const count = patternItem as number;
        const isFullWidth = count === 1;

        for (let i = 0; i < count && offerIndex < offers.length; i++) {
          items.push({
            type: 'offer',
            offer: offers[offerIndex],
            isFullWidth: isFullWidth
          });
          offerIndex++;
        }
      }
    }

    // Jeśli zostały jeszcze oferty, wyświetl je po 3
    while (offerIndex < offers.length) {
      for (let i = 0; i < 3 && offerIndex < offers.length; i++) {
        items.push({
          type: 'offer',
          offer: offers[offerIndex],
          isFullWidth: false
        });
        offerIndex++;
      }
    }

    return items;
  });

  getBanner(index: number) {
    return this.banners[index];
  }

  trackByItem(index: number, item: LayoutItem): string | number {
    if (item.type === 'offer' && item.offer) {
      return item.offer.id;
    }
    return `banner-${item.bannerIndex}`;
  }
}
