import {inject, Injectable} from '@angular/core';
import {API_URL} from '@tokens/api-url.token';
import {HttpClient, HttpParams} from '@angular/common/http';
import {OfferFilters, OfferListModel, OfferModel} from '@models/offers.types';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CarModelsModel, MakeListModel} from '@models/hero-search.types';
import {FormGroup} from '@angular/forms';
import {FilterBuilder} from '@builders/filters-builder';
import {FiltersType} from '@models/filters.types';
import {delay, finalize, tap, shareReplay, filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  public filtersForm: FormGroup = FilterBuilder.build();
  private http: HttpClient = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private currentOfferSubject = new BehaviorSubject<OfferModel | null>(null);
  private offersListSubject = new BehaviorSubject<OfferListModel | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMoreSubject = new BehaviorSubject<boolean>(false);
  private loadMoreErrorSubject = new BehaviorSubject<boolean>(false);
  private makesSubject = new BehaviorSubject<MakeListModel[]>([]);
  private makesLoadingSubject = new BehaviorSubject<boolean>(false);
  private modelsCache = new Map<string, BehaviorSubject<CarModelsModel | null>>();
  private modelsLoadingCache = new Map<string, BehaviorSubject<boolean>>();
  private modelsLoadSubscriptions = new Map<string, Subscription>();
  private filterSubscription?: Subscription;
  private loadMoreSubscription?: Subscription;
  private makesLoadSubscription?: Subscription;
  public readonly offersList$ = this.offersListSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly loadingMore$ = this.loadingMoreSubject.asObservable();
  public readonly loadMoreError$ = this.loadMoreErrorSubject.asObservable();
  public readonly makes$ = this.makesSubject.asObservable();
  public readonly makesLoading$ = this.makesLoadingSubject.asObservable();
  private readonly defaultPerPage = 29;
  private latestFilters: OfferFilters = {};

  filterOffers(filters: Partial<FiltersType> = {}): void {
    const mappedFilters = this.mapFilters(filters);
    this.loadingSubject.next(true);
    this.resetPaginationState();
    this.latestFilters = { ...mappedFilters };
    this.offersListSubject.next(null);

    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    this.filterSubscription = this.getOffers({ ...mappedFilters, page: 1 })
      .pipe(
        delay(1000),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (offerList: OfferListModel) => {
          this.offersListSubject.next(offerList);
          this.loadMoreErrorSubject.next(false);
        },
        error: (error) => {
          console.error('Error loading offers:', error);
          this.offersListSubject.next({
            offers: [],
            meta: {
              current_page: 1,
              per_page: mappedFilters.per_page ?? this.defaultPerPage,
              total: 0,
              total_pages: 0
            }
          });
        }
      });
  }

  loadNextPage(): void {
    const currentList = this.offersListSubject.value;

    if (!currentList || this.loadingMoreSubject.value || this.loadingSubject.value) {
      return;
    }

    if (currentList.meta.current_page >= currentList.meta.total_pages) {
      return;
    }

    this.loadingMoreSubject.next(true);
    this.loadMoreErrorSubject.next(false);

    const nextPage = currentList.meta.current_page + 1;
    const filters = { ...this.latestFilters, page: nextPage };

    if (this.loadMoreSubscription) {
      this.loadMoreSubscription.unsubscribe();
    }

    this.loadMoreSubscription = this.getOffers(filters)
      .pipe(finalize(() => this.loadingMoreSubject.next(false)))
      .subscribe({
        next: (offerList: OfferListModel) => {
          const mergedOffers = [
            ...(this.offersListSubject.value?.offers ?? []),
            ...offerList.offers
          ];

          this.offersListSubject.next({
            offers: mergedOffers,
            meta: offerList.meta
          });

          this.loadMoreErrorSubject.next(false);
        },
        error: (error) => {
          console.error('Error loading additional offers:', error);
          this.loadMoreErrorSubject.next(true);
        }
      });
  }

  getOffers(filters: OfferFilters = {}): Observable<OfferListModel> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof OfferFilters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

     return this.http.get<OfferListModel>(this.apiUrl+'/offers', {params});
  }

  getOffer(id: number): Observable<OfferModel> {
    return this.http.get<OfferModel>(this.apiUrl + '/offers/' + id);
  }

  getMakes(): Observable<MakeListModel[]> {
    if (this.makesSubject.value.length > 0) {
      return this.makes$;
    }
    if (this.makesLoadingSubject.value) {
      return this.makes$;
    }
    this.loadMakes();
    return this.makes$;
  }

  private loadMakes(): void {
    if (this.makesLoadingSubject.value) {
      return;
    }

    this.makesLoadingSubject.next(true);

    if (this.makesLoadSubscription) {
      this.makesLoadSubscription.unsubscribe();
    }

    this.makesLoadSubscription = this.http.get<MakeListModel[]>(this.apiUrl + '/offers/brands')
      .pipe(
        shareReplay(1),
        finalize(() => this.makesLoadingSubject.next(false))
      )
      .subscribe({
        next: (data: MakeListModel[]) => {
          this.makesSubject.next(data);
        },
        error: (error) => {
          console.error('Error loading makes:', error);
          this.makesSubject.next([]);
        }
      });
  }

  getModelsForBrand(brandName: string): Observable<CarModelsModel> {
    const normalizedBrand = brandName.toLowerCase();

    // Sprawdź czy modele są już w cache
    if (!this.modelsCache.has(normalizedBrand)) {
      this.modelsCache.set(normalizedBrand, new BehaviorSubject<CarModelsModel | null>(null));
      this.modelsLoadingCache.set(normalizedBrand, new BehaviorSubject<boolean>(false));
    }

    const modelsSubject = this.modelsCache.get(normalizedBrand)!;
    const loadingSubject = this.modelsLoadingCache.get(normalizedBrand)!;

    // Jeśli dane są już załadowane, zwróć je natychmiast
    if (modelsSubject.value !== null) {
      return modelsSubject.asObservable().pipe(
        filter((data): data is CarModelsModel => data !== null),
        shareReplay(1)
      );
    }

    // Jeśli trwa już ładowanie, zwróć istniejący observable
    if (loadingSubject.value) {
      return modelsSubject.asObservable().pipe(
        filter((data): data is CarModelsModel => data !== null),
        shareReplay(1)
      );
    }

    // Rozpocznij ładowanie danych
    this.loadModelsForBrand(normalizedBrand);
    return modelsSubject.asObservable().pipe(
      filter((data): data is CarModelsModel => data !== null),
      shareReplay(1)
    );
  }

  private loadModelsForBrand(brandName: string): void {
    const normalizedBrand = brandName.toLowerCase();
    const loadingSubject = this.modelsLoadingCache.get(normalizedBrand);
    const modelsSubject = this.modelsCache.get(normalizedBrand);

    if (!loadingSubject || !modelsSubject) {
      return;
    }

    if (loadingSubject.value) {
      return;
    }

    loadingSubject.next(true);

    const existingSubscription = this.modelsLoadSubscriptions.get(normalizedBrand);
    if (existingSubscription) {
      existingSubscription.unsubscribe();
    }

    const subscription = this.http.get<CarModelsModel>(this.apiUrl + `/offers/brands/${normalizedBrand}/models`)
      .pipe(
        shareReplay(1),
        finalize(() => loadingSubject.next(false))
      )
      .subscribe({
        next: (data: CarModelsModel) => {
          modelsSubject.next(data);
        },
        error: (error) => {
          console.error(`Error loading models for brand ${brandName}:`, error);
          modelsSubject.next(null);
        }
      });

    this.modelsLoadSubscriptions.set(normalizedBrand, subscription);
  }

  setCurrentOffer(offer: OfferModel | null): void {
    this.currentOfferSubject.next(offer);
  }

  getCurrentOffert(): OfferModel | null {
    return this.currentOfferSubject.value;
  }

  private mapFilters(filters: Partial<FiltersType> = {}): OfferFilters {
    return {
      car_brand: this.normalize(filters.make),
      car_model: this.normalize(filters.model),
      fuel_type: this.normalize(filters.fuel),
      transmission: this.normalize(filters.transmission),
      price_from: this.toNumber(filters.price_from),
      price_to: this.toNumber(filters.price_to),
      order: this.normalize(filters.order),
      orderby: this.normalize(filters.orderby),
      per_page: this.defaultPerPage,
      available_immediately: filters.available_immediately

  };
  }

  private normalize(value?: string | null): string | undefined {
    return value && value !== '' ? value : undefined;
  }

  private toNumber(value?: string | null): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private resetPaginationState(): void {
    this.loadingMoreSubject.next(false);
    this.loadMoreErrorSubject.next(false);

    if (this.loadMoreSubscription) {
      this.loadMoreSubscription.unsubscribe();
      this.loadMoreSubscription = undefined;
    }
  }
}
