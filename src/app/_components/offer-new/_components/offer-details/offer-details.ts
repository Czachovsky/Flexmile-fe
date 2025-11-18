import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {BodyType, FuelType, OfferModel, TransmissionType} from '@models/offers.types';
import {DecimalPipe, JsonPipe, SlicePipe} from '@angular/common';
import {Badge} from '@components/utilities/badge/badge';
import {OfferGallery} from '@components/utilities/offer-gallery/offer-gallery';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {ButtonComponent} from '@components/utilities/button/button';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {OffersCarousel} from '@components/utilities/offers-carousel/offers-carousel';
import {descriptionBanner, offerDescription, offerFirstStepModel} from '@models/offer.type';
import {OfferService} from '@services/offer';

@Component({
  selector: 'flexmile-offer-details',
  imports: [
    Badge,
    OfferGallery,
    ButtonComponent,
    DecimalPipe,
    BannerList,
    OffersCarousel,
    SlicePipe
  ],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.scss',
})
export class OfferDetails implements OnInit {
  public offerService: OfferService = inject(OfferService);
  public details: InputSignal<OfferModel> = input.required<OfferModel>();
  public similarOffers: InputSignal<OfferModel[] | []> = input.required<OfferModel[] | []>();
  public nextStep = output<offerFirstStepModel>();
  public readonly badgeTypes = badgeTypes;
  public readonly badgeSizes = badgeSizes;
  public readonly transmissionType = TransmissionType;
  public readonly fuelType = FuelType;
  public readonly bodyType = BodyType;
  public readonly standardEquipmentDefaultVisible = 9;
  public standardEquipmentDisplayCount = this.standardEquipmentDefaultVisible;
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

  ngOnInit(): void {
    if (this.details().pricing.rental_periods.length > 0 && !this.offerService.selectedPeriod) {
      this.offerService.selectedPeriod = this.details().pricing.rental_periods[0];
    }
    if (this.details().pricing.mileage_limits.length > 0 && !this.offerService.selectedMileageLimit) {
      this.offerService.selectedMileageLimit = this.details().pricing.mileage_limits[0];
    }
    this.offerService.calculatePrice(this.details());
  }

  public getTransmissionLabel(type: string): string {
    return this.transmissionType[type as keyof typeof TransmissionType];
  }

  public getBodyTypeLabel(type: string): string {
    return this.bodyType[type as keyof typeof BodyType];
  }

  public getFuelLabel(type: string): string {
    return this.fuelType[type as keyof typeof FuelType];
  }

  public selectMileageLimit(limit: number): void {
    this.offerService.selectMileageLimit(limit, this.details());
  }

  public selectPeriod(period: number): void {
    this.offerService.selectPeriod(period, this.details());
  }

  public isPeriodActive(period: number): boolean {
    return this.offerService.selectedPeriod === period;
  }

  public isMileageLimitActive(limit: number): boolean {
    return this.offerService.selectedMileageLimit === limit;
  }

  public canOrder(): boolean {
    return this.offerService.canOrder();
  }

  public getSpecValue(value: string): string {
    const getValueByPath = (obj: any, path: string) =>
      path.split('.').reduce((acc, part) => acc?.[part], obj);

    const result = getValueByPath(this.details(), value);
    return result ?? '';
  }

  public get showStandardEquipmentToggle(): boolean {
    return (this.details().standard_equipment?.length ?? 0) > this.standardEquipmentDefaultVisible;
  }

  public get isShowingAllStandardEquipment(): boolean {
    const total = this.details().standard_equipment?.length ?? 0;
    return total > 0 && this.standardEquipmentDisplayCount >= total;
  }

  public toggleStandardEquipment(): void {
    const total = this.details().standard_equipment?.length ?? 0;
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
    this.nextStep.emit({
      offer_id: this.details().id,
      rental_months: this.offerService.selectedPeriod!,
      annual_mileage_limit: this.offerService.selectedMileageLimit!,
      monthly_price: this.offerService.calculatedPrice
    })

  }


  protected readonly descriptionList = offerDescription;
  protected readonly descriptionBanner = descriptionBanner;
}
