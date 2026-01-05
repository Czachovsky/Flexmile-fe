import {inject, Injectable} from '@angular/core';
import {OfferModel} from '@models/offers.types';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {offerOrderModel, OrderResponse} from '@models/offer.type';
import {API_URL} from '@tokens/api-url.token';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  public selectedPeriod: number | null = null;
  public selectedMileageLimit: number | null = null;
  public selectedInitialPayment: number | null = null;
  public calculatedPrice: number = 0;
  private readonly http: HttpClient = inject(HttpClient);
  private apiUrl = inject(API_URL);

  public selectMileageLimit(limit: number, offerDetail: OfferModel): void {
    this.selectedMileageLimit = limit;
    this.calculatePrice(offerDetail);
  }

  public selectPeriod(period: number, offerDetail: OfferModel): void {
    this.selectedPeriod = period;
    this.calculatePrice(offerDetail);
  }

  public selectInitialPayment(price: number, offerDetail: OfferModel): void {
    this.selectedInitialPayment = price;
    this.calculatePrice(offerDetail);
  }

  public isPeriodActive(period: number): boolean {
    return this.selectedPeriod === period;
  }

  public isMileageLimitActive(limit: number): boolean {
    return this.selectedMileageLimit === limit;
  }

  public freshInit(): void {
    this.selectedPeriod = null;
    this.selectedMileageLimit = null;
    this.selectedInitialPayment = null;

  }

  public canOrder(): boolean {
    return this.selectedPeriod !== null &&
      this.selectedMileageLimit !== null &&
      this.calculatedPrice > 0;
  }

  public calculatePrice(offerDetail: OfferModel): void {
    if (this.selectedPeriod != null &&
      this.selectedMileageLimit != null &&
      this.selectedInitialPayment != null) {
      const priceKey = `${this.selectedPeriod}_${this.selectedMileageLimit}_${this.selectedInitialPayment}`;
      this.calculatedPrice = offerDetail.pricing.price_matrix[priceKey] || 0;
    } else {
      this.calculatedPrice = 0;
    }
  }

  public selectLowestPriceOption(offerDetail: OfferModel): void {
    const { pricing } = offerDetail;
    const { lowest_price, display_price, rental_periods, mileage_limits, initial_payments, price_matrix } = pricing;

    // If display_price is set, use it; otherwise use lowest_price
    const targetPrice = display_price ?? lowest_price;

    // Find the combination that matches the target price
    for (const period of rental_periods) {
      for (const mileageLimit of mileage_limits) {
        for (const initialPayment of initial_payments) {
          const priceKey = `${period}_${mileageLimit}_${initialPayment}`;
          const price = price_matrix[priceKey];

          if (price === targetPrice) {
            this.selectedPeriod = period;
            this.selectedMileageLimit = mileageLimit;
            this.selectedInitialPayment = initialPayment;
            this.calculatedPrice = price;
            return;
          }
        }
      }
    }

    // Fallback: if no exact match found, select first options
    if (rental_periods.length > 0) {
      this.selectedPeriod = rental_periods[0];
    }
    if (mileage_limits.length > 0) {
      this.selectedMileageLimit = mileage_limits[0];
    }
    if (initial_payments.length > 0) {
      this.selectedInitialPayment = initial_payments[0];
    }
    this.calculatePrice(offerDetail);
  }

  public orderOrReserve(reservationObject: offerOrderModel, orderType: 'reservation' | 'order'): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl + `/reservations?type=${orderType}`, reservationObject);
  }
}
