import {Component, inject, OnInit} from '@angular/core';
import {Badge} from "@components/utilities/badge/badge";
import {badgeSizes, badgeTypes} from "@models/common.types";
import {ButtonComponent} from '@components/utilities/button/button';
import {OfferGallery} from '@components/utilities/offer-gallery/offer-gallery';
import {DrivetrainType, OfferGalleryModel, OfferModel, TransmissionType} from '@models/offers.types';
import {Offers} from '@services/offers';
import {DecimalPipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'flexmile-offer',
  imports: [
    Badge,
    ButtonComponent,
    OfferGallery,
    JsonPipe,
    DecimalPipe
  ],
  templateUrl: './offer.html',
  styleUrl: './offer.scss',
})
export class Offer implements OnInit {
  private readonly offerService: Offers = inject(Offers);

  public readonly badgeTypes = badgeTypes;
  public readonly badgeSizes = badgeSizes;
  public readonly transmissionType = TransmissionType;
  public readonly drivetrainType = DrivetrainType;
  public readonly technicalsArray: { value: string; label: string }[] = [
    {label: 'Paliwo', value: 'fuel_type.name'},
    {label: 'Skrzynia biegów', value: 'specs.transmission'},
    {label: 'Silnik', value: 'specs.engine'},
    {label: 'Moc', value: 'specs.horsepower'},
    {label: 'Napęd', value: 'specs.drivetrain'},
    {label: 'Nadwozie', value: 'body_type.name'},
    {label: 'Liczba drzwi', value: 'specs.doors'},
    {label: 'Liczba miejsc', value: 'specs.seats'},
    {label: 'Kolor', value: 'specs.color'}
  ];

  public readonly offerData: OfferModel = this.offerService.getCurrentOffern()!;
  public selectedPeriod: number | null = null;
  public selectedMileageLimit: number | null = null;
  public calculatedPrice: number = 0;


  ngOnInit(): void {
    if (this.offerData.pricing.rental_periods.length > 0) {
      this.selectedPeriod = this.offerData.pricing.rental_periods[0];
    }
    if (this.offerData.pricing.mileage_limits.length > 0) {
      this.selectedMileageLimit = this.offerData.pricing.mileage_limits[0];
    }
    this.calculatePrice();
  }


  public getTransmissionLabel(type: string): string {
    return this.transmissionType[type as keyof typeof TransmissionType];
  }

  public getDrivetrainLabel(type: string): string {
    return this.drivetrainType[type as keyof typeof DrivetrainType];
  }

  public selectMileageLimit(limit: number): void {
    this.selectedMileageLimit = limit;
    this.calculatePrice();
  }

  public selectPeriod(period: number): void {
    this.selectedPeriod = period;
    this.calculatePrice();
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

  public getSpecValue(value: string): string {
    const getValueByPath = (obj: any, path: string) =>
      path.split('.').reduce((acc, part) => acc?.[part], obj);

    const result = getValueByPath(this.offerData, value);
    return result ?? '';
  }

  public onOrderClick(): void {
    if (!this.canOrder()) {
      alert('Wybierz okres wynajmu i roczny limit kilometrów');
      return;
    }


    console.log({
      offer_id: this.offerData.id,
      rental_months: this.selectedPeriod,
      annual_mileage_limit: this.selectedMileageLimit,
      monthly_price: this.calculatedPrice
    });
  }

  private calculatePrice(): void {
    if (this.selectedPeriod && this.selectedMileageLimit) {
      const priceKey = `${this.selectedPeriod}_${this.selectedMileageLimit}`;
      this.calculatedPrice = this.offerData.pricing.price_matrix[priceKey] || 0;
    } else {
      this.calculatedPrice = 0;
    }
  }


}
