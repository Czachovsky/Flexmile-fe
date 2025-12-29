import {AfterViewInit, Component, DestroyRef, ElementRef, inject, input, InputSignal, OnDestroy, OnInit, output, ViewChild} from '@angular/core';
import {
  BodyType,
  ConditionType,
  FuelType,
  OfferListOffersModel,
  OfferModel,
  TransmissionType
} from '@models/offers.types';
import {DecimalPipe, SlicePipe} from '@angular/common';
import {Badge} from '@components/utilities/badge/badge';
import {OfferGallery} from '@components/utilities/offer-gallery/offer-gallery';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {ButtonComponent} from '@components/utilities/button/button';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {OffersCarousel} from '@components/utilities/offers-carousel/offers-carousel';
import {descriptionBanner, offerDescription, offerFirstStepModel} from '@models/offer.type';
import {OfferService} from '@services/offer';
import {NullsafePipe} from '@pipes/nullsafe-pipe';
import {Screen} from '@services/screen'
import {Link} from '@components/utilities/link/link';
import {fromEvent} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {throttleTime} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'flexmile-offer-details',
  imports: [
    Badge,
    OfferGallery,
    ButtonComponent,
    DecimalPipe,
    BannerList,
    OffersCarousel,
    SlicePipe,
    NullsafePipe,
    Link
  ],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.scss',
  animations: [
    trigger('slideUpDown', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('0.35s cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition(':leave', [
        animate('0.25s cubic-bezier(0.7, 0, 0.84, 0)')
      ])
    ])
  ]
})
export class OfferDetails implements OnInit, AfterViewInit, OnDestroy {
  public offerService: OfferService = inject(OfferService);
  public details: InputSignal<OfferModel> = input.required<OfferModel>();
  public similarOffers: InputSignal<OfferListOffersModel[] | []> = input.required<OfferListOffersModel[] | []>();
  public nextStep = output<offerFirstStepModel>();
  public readonly badgeTypes = badgeTypes;
  public readonly badgeSizes = badgeSizes;
  public readonly transmissionType = TransmissionType;
  public readonly fuelType = FuelType;
  public readonly conditionType = ConditionType;
  public readonly bodyType = BodyType;
  public readonly standardEquipmentDefaultVisible = 9;
  public standardEquipmentDisplayCount = this.standardEquipmentDefaultVisible;
  public readonly technicalsArray: { value: string; label: string }[] = [
    {label: 'Stan', value: 'specs.condition'},
    {label: 'Paliwo', value: 'fuel_type'},
    {label: 'Emisja CO2', value: 'specs.co2_emission'},
    {label: 'Skrzynia biegów', value: 'specs.transmission'},
    {label: 'Silnik', value: 'specs.engine'},
    {label: 'Moc', value: 'specs.horsepower'},
    {label: 'Napęd', value: 'specs.drivetrain'},
    {label: 'Nadwozie', value: 'body_type'},
    {label: 'Liczba drzwi', value: 'specs.doors'},
    {label: 'Liczba miejsc', value: 'specs.seats'},
    {label: 'Kolor', value: 'specs.color'},
    {label: 'Kolor wnętrza', value: 'specs.interior_color'}
  ];
  public readonly screen: Screen = inject(Screen);
  private readonly destroyRef = inject(DestroyRef);
  public readonly descriptionList = offerDescription;
  public readonly descriptionBanner = descriptionBanner;
  @ViewChild('offerInfoSection', { static: false }) offerInfoSection!: ElementRef<HTMLElement>;
  public isOfferInfoAtTop = false;
  private intersectionObserver?: IntersectionObserver;

  ngOnInit(): void {
    if (this.details().pricing.rental_periods.length > 0 && !this.offerService.selectedPeriod) {
      this.offerService.selectedPeriod = this.details().pricing.rental_periods[0];
    }
    if (this.details().pricing.mileage_limits.length > 0 && !this.offerService.selectedMileageLimit) {
      this.offerService.selectedMileageLimit = this.details().pricing.mileage_limits[0];
    }
    if (this.details().pricing.initial_payments.length > 0 && !this.offerService.selectedInitialPayment) {
      console.log(this.details().pricing.initial_payments[0])
      this.offerService.selectedInitialPayment = this.details().pricing.initial_payments[0];
    }
    this.offerService.calculatePrice(this.details());
  }

  ngAfterViewInit(): void {
    if (this.screen.isMobile() && this.offerInfoSection?.nativeElement) {
      this.setupScrollListener();
    }
  }

  private setupScrollListener(): void {
    if (!this.offerInfoSection?.nativeElement || typeof window === 'undefined') {
      return;
    }

    const checkPosition = () => {
      if (!this.offerInfoSection?.nativeElement) {
        return;
      }
      const rect = this.offerInfoSection.nativeElement.getBoundingClientRect();
      this.isOfferInfoAtTop = rect.top <= 157.3125;
    };
    setTimeout(() => checkPosition(), 0);
    fromEvent(window, 'scroll', { passive: true })
      .pipe(
        throttleTime(10),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        checkPosition();
      });
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  public checkIfAnyTrue(): boolean {
    return Object.values(this.details().additional_services).some(value => value);
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

  public getConditionLabel(type:string): string {
    return this.conditionType[type as keyof typeof ConditionType];
  }

  public selectMileageLimit(limit: number): void {
    this.offerService.selectMileageLimit(limit, this.details());
  }

  public selectInitialPayment(price: number): void {
    this.offerService.selectInitialPayment(price, this.details());
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

  public isInitialPaymentActive(limit: number): boolean {
    return this.offerService.selectedInitialPayment === limit;
  }

  public canOrder(): boolean {
    return this.details().available && this.offerService.canOrder();
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
    window.scrollTo(0, 0);
    this.nextStep.emit({
      offer_id: this.details().id,
      rental_months: this.offerService.selectedPeriod!,
      annual_mileage_limit: this.offerService.selectedMileageLimit!,
      monthly_price: this.offerService.calculatedPrice,
      initial_payment: this.offerService.selectedInitialPayment!
    })

  }



}
