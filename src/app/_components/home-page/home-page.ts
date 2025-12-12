import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Hero} from '@components/home-page/_components/hero/hero';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Link} from '@components/utilities/link/link';
import {WhyUs} from '@components/home-page/_components/why-us/why-us';
import {Faq} from '@components/home-page/_components/faq/faq';
import {Opinions} from '@components/home-page/_components/opinions/opinions';
import {OffersService} from '@services/offers';
import {OfferListModel} from '@models/offers.types';
import {Player} from '@components/utilities/player/player';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HomepageList} from '@components/home-page/_components/homepage-list/homepage-list';
import {ButtonComponent} from '@components/utilities/button/button';
import {SeoService} from '@services/seo';

@Component({
  selector: 'flexmile-home-page',
  imports: [
    Hero,
    Link,
    WhyUs,
    Faq,
    Opinions,
    Player,
    HomepageList,
    ButtonComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  protected readonly badgeSizes = badgeSizes;
  protected readonly badgeTypes = badgeTypes;
  private readonly offers: OffersService = inject(OffersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seoService: SeoService = inject(SeoService);
  public offersList: OfferListModel | undefined;
  ngOnInit() {
    this.seoService.setHomePageMeta();
    this.offers.getOffers({per_page: 29}).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (offerList: OfferListModel) => {
        this.offersList = offerList;
      },
      error: (error) => {
        console.error('Error loading offers:', error);
      }
    })
  }
}
