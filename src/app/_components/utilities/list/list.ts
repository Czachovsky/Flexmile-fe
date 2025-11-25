import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  ViewChild
} from '@angular/core';
import {Car} from '@components/utilities/car/car';
import {OfferListModel, OfferListOffersModel} from '@models/offers.types';
import {NothingFound} from '@components/utilities/list/nothing-found/nothing-found';
import {OffersService} from '@services/offers';
import {toSignal} from '@angular/core/rxjs-interop';
import {Loader} from '@components/utilities/loader/loader';
import {SortBy} from '@components/utilities/list/sort-by/sort-by';
import {ButtonComponent} from '@components/utilities/button/button';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BannersService} from '@services/banners';
import {BannerTypes} from '@models/banners.types';
import {badgeSizes} from '@models/common.types';
import {ReservedList} from '@components/utilities/reserved-list/reserved-list';

type PatternItem = number | 'banner';

interface LayoutItem {
  type: 'offer' | 'banner';
  offer?: OfferListOffersModel;
  bannerIndex?: number;
  bannerKey?: string;
  isFullWidth?: boolean;
}

@Component({
    selector: 'flexmile-list',
  imports: [
    Car,
    NothingFound,
    Loader,
    SortBy,
    ButtonComponent,
    BannerList,
    ReservedList
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List implements AfterViewInit {
  private readonly offersService: OffersService = inject(OffersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bannersService: BannersService = inject(BannersService);
  hideHeader = input<boolean>(false);
  offerList = toSignal<OfferListModel | null>(this.offersService.offersList$, {initialValue: null});
  loading = toSignal<boolean>(this.offersService.loading$, {requireSync: true});
  loadingMore = toSignal<boolean>(this.offersService.loadingMore$, {requireSync: true});
  loadMoreError = toSignal<boolean>(this.offersService.loadMoreError$, {requireSync: true});
  banners = toSignal<BannerTypes[] | undefined>(this.bannersService.banners$);
  hasMorePages = computed(() => {
    const list = this.offerList();
    if (!list) {
      return false;
    }
    return list.meta.current_page < list.meta.total_pages;
  });
  layoutItems = computed<LayoutItem[]>(() => this.buildLayout());
  private loadMoreTrigger$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  private sentinelElement?: ElementRef<HTMLDivElement>;
  @ViewChild('loadMoreSentinel')
  set loadMoreSentinel(element: ElementRef<HTMLDivElement> | undefined) {
    if (this.sentinelElement?.nativeElement) {
      this.intersectionObserver?.unobserve(this.sentinelElement.nativeElement);
    }
    this.sentinelElement = element;

    if (element && this.intersectionObserver) {
      this.intersectionObserver.observe(element.nativeElement);
    }
  }

  constructor() {
    this.loadMoreTrigger$
      .pipe(
        debounceTime(250),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.offersService.loadNextPage());

    this.destroyRef.onDestroy(() => this.intersectionObserver?.disconnect());
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  retryLoadMore(): void {
    this.offersService.loadNextPage();
  }

  getBanner(index: number): BannerTypes | null {
    const banners = this.banners();
    if (!banners || !banners.length) {
      return null;
    }
    return banners[index % banners.length];
  }

  protected readonly badgeSizes = badgeSizes;
  private readonly pattern: PatternItem[] = [3, 3, 'banner', 3, 1, 3, 3, 'banner', 3, 1, 3, 3, 'banner', 3];
  private readonly patternOfferCount = this.pattern.reduce<number>((total, item) => {
    return total + (typeof item === 'number' ? item : 0);
  }, 0);

  private setupObserver(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (this.shouldTrigger(entry)) {
          this.requestNextPage();
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0,
    });

    const sentinel = this.sentinelElement?.nativeElement;
    if (sentinel) {
      this.intersectionObserver.observe(sentinel);
    }
  }

  private requestNextPage(): void {
    if (!this.hasMorePages() || this.loadingMore() || this.loading()) {
      return;
    }

    this.loadMoreTrigger$.next();
  }

  private buildLayout(): LayoutItem[] {
    const offerList = this.offerList();
    const offers = offerList?.offers ?? [];
    const banners = this.banners() ?? [];
    if (!offers.length) {
      return [];
    }

    const perPage = offerList?.meta?.per_page ?? this.patternOfferCount;
    const items: LayoutItem[] = [];
    let chunkIndex = 0;

    for (let start = 0; start < offers.length; start += perPage) {
      const chunkOffers = offers.slice(start, start + perPage);
      if (!chunkOffers.length) {
        continue;
      }
      items.push(...this.buildChunkLayout(chunkOffers, chunkIndex, banners));
      chunkIndex++;
    }

    return items;
  }

  private buildChunkLayout(chunkOffers: OfferListOffersModel[], chunkIndex: number, banners: BannerTypes[]): LayoutItem[] {
    const chunkItems: LayoutItem[] = [];
    let offerIndex = 0;
    let bannerCounter = 0;

    for (const patternItem of this.pattern) {
      if (patternItem === 'banner') {
        if (banners.length) {
          const bannerIndex = bannerCounter % banners.length;
          chunkItems.push({
            type: 'banner',
            bannerIndex,
            bannerKey: `chunk-${chunkIndex}-banner-${bannerCounter}`
          });
        }
        bannerCounter++;
        continue;
      }



      const count = patternItem;
      const isFullWidth = count === 1;

      for (let i = 0; i < count && offerIndex < chunkOffers.length; i++) {
        chunkItems.push({
          type: 'offer',
          offer: chunkOffers[offerIndex],
          isFullWidth
        });
        offerIndex++;
      }

      if (offerIndex >= chunkOffers.length) {
        break;
      }
    }

    if (offerIndex < chunkOffers.length) {
      while (offerIndex < chunkOffers.length) {
        for (let i = 0; i < 3 && offerIndex < chunkOffers.length; i++) {
          chunkItems.push({
            type: 'offer',
            offer: chunkOffers[offerIndex],
            isFullWidth: false
          });
          offerIndex++;
        }
      }
    }

    return chunkItems;
  }

  trackByItem(index: number, item: LayoutItem): string | number {
    if (item.type === 'offer' && item.offer) {
      return item.offer.id;
    }
    return item.bannerKey ?? index;
  }

  private shouldTrigger(entry: IntersectionObserverEntry): boolean {
    if (!entry.isIntersecting || !entry.rootBounds) {
      return false;
    }

    const viewportHeight = entry.rootBounds.height;
    const threshold = viewportHeight * 0.3;
    const distanceFromBottom = entry.rootBounds.bottom - entry.boundingClientRect.bottom;

    return distanceFromBottom <= threshold;
  }
}
