import {Component, inject, OnInit} from '@angular/core';
import {Badge} from "@components/utilities/badge/badge";
import {badgeSizes, badgeTypes} from "@models/common.types";
import {ButtonComponent} from '@components/utilities/button/button';
import {OfferGallery} from '@components/utilities/offer-gallery/offer-gallery';
import {DrivetrainType, OfferModel, TransmissionType} from '@models/offers.types';
import {Offers} from '@services/offers';
import {DecimalPipe, SlicePipe} from '@angular/common';
import {descriptionBanner, offerDescription, offerDescriptionModel} from '@models/offer.type';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {OffersCarousel} from '@components/utilities/offers-carousel/offers-carousel';

@Component({
  selector: 'flexmile-offer',
  imports: [
    Badge,
    ButtonComponent,
    OfferGallery,
    DecimalPipe,
    SlicePipe,
    BannerList,
    OffersCarousel
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
    {label: 'Paliwo', value: 'fuel_type'},
    {label: 'Skrzynia biegów', value: 'specs.transmission'},
    {label: 'Silnik', value: 'specs.engine'},
    {label: 'Moc', value: 'specs.horsepower'},
    {label: 'Napęd', value: 'specs.drivetrain'},
    {label: 'Nadwozie', value: 'body_type'},
    {label: 'Liczba drzwi', value: 'specs.doors'},
    {label: 'Liczba miejsc', value: 'specs.seats'},
    {label: 'Kolor', value: 'specs.color'}
  ];
  public descriptionList: offerDescriptionModel[] = offerDescription;
  public descriptionBanner = descriptionBanner;
  public readonly offerData: OfferModel = this.offerService.getCurrentOffert()!;
  public selectedPeriod: number | null = null;
  public selectedMileageLimit: number | null = null;
  public calculatedPrice: number = 0;
  public readonly standardEquipmentDefaultVisible = 9;
  public standardEquipmentDisplayCount = this.standardEquipmentDefaultVisible;


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

  public get showStandardEquipmentToggle(): boolean {
    return (this.offerData.standard_equipment?.length ?? 0) > this.standardEquipmentDefaultVisible;
  }

  public get isShowingAllStandardEquipment(): boolean {
    const total = this.offerData.standard_equipment?.length ?? 0;
    return total > 0 && this.standardEquipmentDisplayCount >= total;
  }

  public toggleStandardEquipment(): void {
    const total = this.offerData.standard_equipment?.length ?? 0;
    if (!total) {
      return;
    }

    if (this.isShowingAllStandardEquipment) {
      this.standardEquipmentDisplayCount = this.standardEquipmentDefaultVisible;
    } else {
      this.standardEquipmentDisplayCount = total;
    }
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
