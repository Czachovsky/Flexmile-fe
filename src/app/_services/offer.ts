import {Injectable} from '@angular/core';
import {OfferModel} from '@models/offers.types';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  public selectedPeriod: number | null = null;
  public selectedMileageLimit: number | null = null;
  public calculatedPrice: number = 0;


  public selectMileageLimit(limit: number, offerDetail: OfferModel): void {
    this.selectedMileageLimit = limit;
    this.calculatePrice(offerDetail);
  }

  public selectPeriod(period: number, offerDetail: OfferModel): void {
    this.selectedPeriod = period;
    this.calculatePrice(offerDetail);
  }

  public isPeriodActive(period: number): boolean {
    return this.selectedPeriod === period;
  }

  public isMileageLimitActive(limit: number): boolean {
    return this.selectedMileageLimit === limit;
  }

  public canOrder(): boolean {
    return this.selectedPeriod !== null &&
      this.selectedMileageLimit !== null &&
      this.calculatedPrice > 0;
  }

  public calculatePrice(offerDetail: OfferModel): void {
    if (this.selectedPeriod && this.selectedMileageLimit) {
      const priceKey = `${this.selectedPeriod}_${this.selectedMileageLimit}`;
      this.calculatedPrice = offerDetail.pricing.price_matrix[priceKey] || 0;
    } else {
      this.calculatedPrice = 0;
    }
  }
}
