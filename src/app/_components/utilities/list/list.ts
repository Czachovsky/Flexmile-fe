import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Car} from '@components/utilities/car/car';
import {OfferListModel, OfferModel} from '@models/offers.types';
import {NothingFound} from '@components/utilities/list/nothing-found/nothing-found';
import {OffersService} from '@services/offers';
import {toSignal} from '@angular/core/rxjs-interop';
import {Loader} from '@components/utilities/loader/loader';
import {SortBy} from '@components/utilities/list/sort-by/sort-by';

@Component({
    selector: 'flexmile-list',
  imports: [
    Car,
    NothingFound,
    Loader,
    SortBy
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class List {
  private readonly offersService: OffersService = inject(OffersService);
  hideHeader = input<boolean>(false);
  offerList = toSignal<OfferListModel | null>(this.offersService.offersList$, {initialValue: null});
  loading = toSignal<boolean>(this.offersService.loading$, {requireSync: true});
  public sortBy: string = 'name';
  public openSortBy: boolean = false;

  trackByOfferId(index: number, offer: OfferModel): number {
    return offer.id;
  }
}
