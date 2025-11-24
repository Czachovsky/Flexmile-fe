import {inject, Injectable} from '@angular/core';
import {API_URL} from '@tokens/api-url.token';
import {HttpClient, HttpParams} from '@angular/common/http';
import {OfferFilters, OfferListModel, OfferModel} from '@models/offers.types';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CarModelsModel, MakeListModel} from '@models/hero-search.types';
import {FormGroup} from '@angular/forms';
import {FilterBuilder} from '@builders/filters-builder';
import {FiltersType} from '@models/filters.types';
import {delay, finalize} from 'rxjs/operators';

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
  private filterSubscription?: Subscription;
  public readonly offersList$ = this.offersListSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  private readonly defaultPerPage = 12;

  filterOffers(filters: Partial<FiltersType> = {}): void{
    const mappedFilters = this.mapFilters(filters);
    this.loadingSubject.next(true);

    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    this.filterSubscription = this.getOffers(mappedFilters)
      .pipe(
        delay(1000),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        next: (offerList: OfferListModel) => {
          this.offersListSubject.next(offerList);
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

  getOffers(filters: OfferFilters = {}): Observable<OfferListModel> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof OfferFilters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

     return this.http.get<OfferListModel>(this.apiUrl+'/offers', {params});
    // return this.http.get<OfferListModel>('/example.json');
  }

  getOffer(id: number): Observable<OfferModel> {
    return this.http.get<OfferModel>(this.apiUrl + '/offers/' + id);
  }

  getMakes() {
    return this.http.get<MakeListModel[]>(this.apiUrl + '/offers/brands');
  }

  getModelsForBrand(brandName: string) {
    return this.http.get<CarModelsModel>(this.apiUrl + `/offers/brands/${brandName}/models`);
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
      per_page: this.defaultPerPage
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
}
