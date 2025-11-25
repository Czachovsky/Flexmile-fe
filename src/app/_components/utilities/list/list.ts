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
import {OfferListModel, OfferModel} from '@models/offers.types';
import {NothingFound} from '@components/utilities/list/nothing-found/nothing-found';
import {OffersService} from '@services/offers';
import {toSignal} from '@angular/core/rxjs-interop';
import {Loader} from '@components/utilities/loader/loader';
import {SortBy} from '@components/utilities/list/sort-by/sort-by';
import {ButtonComponent} from '@components/utilities/button/button';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'flexmile-list',
  imports: [
    Car,
    NothingFound,
    Loader,
    SortBy,
    ButtonComponent
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List implements AfterViewInit {
  private readonly offersService: OffersService = inject(OffersService);
  private readonly destroyRef = inject(DestroyRef);
  hideHeader = input<boolean>(false);
  offerList = toSignal<OfferListModel | null>(this.offersService.offersList$, {initialValue: null});
  loading = toSignal<boolean>(this.offersService.loading$, {requireSync: true});
  loadingMore = toSignal<boolean>(this.offersService.loadingMore$, {requireSync: true});
  loadMoreError = toSignal<boolean>(this.offersService.loadMoreError$, {requireSync: true});
  hasMorePages = computed(() => {
    const list = this.offerList();
    if (!list) {
      return false;
    }
    return list.meta.current_page < list.meta.total_pages;
  });
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

  trackByOfferId(index: number, offer: OfferModel): number {
    return offer.id;
  }

  retryLoadMore(): void {
    this.offersService.loadNextPage();
  }

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

  private shouldTrigger(entry: IntersectionObserverEntry): boolean {
    if (!entry.isIntersecting || !entry.rootBounds) {
      return false;
    }

    const viewportHeight = entry.rootBounds.height;
    const threshold = viewportHeight * 0.1;
    const distanceFromBottom = entry.rootBounds.bottom - entry.boundingClientRect.bottom;

    return distanceFromBottom <= threshold;
  }
}
