import {inject, Injectable} from '@angular/core';
import {API_URL} from '@tokens/api-url.token';
import {HttpClient, HttpParams} from '@angular/common/http';
import {OfferFilters, OfferModel} from '@models/offers.types';
import {BehaviorSubject, Observable} from 'rxjs';
import {CarModelsModel, MakeListModel} from '@models/hero-search.types';

@Injectable({
  providedIn: 'root'
})
export class Offers {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = inject(API_URL);
  private currentOfferSubject = new BehaviorSubject<OfferModel | null>(null);

  filterOffers(filters: OfferFilters = {}): void{

  }

  getOffers(filters: OfferFilters = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof OfferFilters];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.apiUrl, {params});
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
}
