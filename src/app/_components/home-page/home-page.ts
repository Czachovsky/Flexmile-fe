import {Component, inject, OnInit} from '@angular/core';
import {Hero} from '@components/home-page/_components/hero/hero';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Link} from '@components/utilities/link/link';
import {List} from '@components/utilities/list/list';
import {WhyUs} from '@components/home-page/_components/why-us/why-us';
import {Faq} from '@components/home-page/_components/faq/faq';
import {Opinions} from '@components/home-page/_components/opinions/opinions';
import {OffersService} from '@services/offers';
import {OfferListModel} from '@models/offers.types';
import {Player} from '@components/utilities/player/player';

@Component({
  selector: 'flexmile-home-page',
  imports: [
    Hero,
    Link,
    List,
    WhyUs,
    Faq,
    Opinions,
    Player,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  protected readonly badgeSizes = badgeSizes;
  protected readonly badgeTypes = badgeTypes;
  private readonly offers: OffersService = inject(OffersService);
  public offersList: OfferListModel | undefined;
  ngOnInit() {
    this.offers.getOffers().subscribe((offerList: OfferListModel) => {
      console.log(offerList)
      this.offersList = offerList;
    })
  }
}
