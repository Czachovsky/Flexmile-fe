import {Component, effect, inject, input, InputSignal, output, OnDestroy, OnInit} from '@angular/core';
import {
  descriptionBanner,
  offerFirstStepModel,
  OfferFormValues,
  offerOrderModel,
  pickupLocation
} from '@models/offer.type';
import {OfferBuilder} from '@builders/offer-builder';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DecimalPipe, NgClass, NgTemplateOutlet} from '@angular/common';
import {OfferModel} from '@models/offers.types';
import {ButtonComponent} from '@components/utilities/button/button';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Input} from '@components/utilities/input/input';
import {OfferService} from '@services/offer';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {InputType} from '@models/common.types';
import {Loader} from '@components/utilities/loader/loader';
import {Modal} from '@components/utilities/modal/modal';
import {Router} from '@angular/router';
import {Screen} from '@services/screen';
import {ComponentVisibilityService} from '@services/component-visibility';

@Component({
  selector: 'flexmile-offer-order',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    DecimalPipe,
    Tooltip,
    Input,
    BannerList,
    Loader,
    Modal,
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './offer-order.html',
  styleUrl: './offer-order.scss',
})
export class OfferOrder implements OnInit, OnDestroy {
  public offerService: OfferService = inject(OfferService);
  public screen: Screen = inject(Screen);
  orderObject = input.required<offerFirstStepModel>();
  public details: InputSignal<OfferModel> = input.required<OfferModel>();
  orderForm: FormGroup<OfferFormValues> = OfferBuilder.build()
  public previousStep = output<boolean>();
  public readonly pickupLocation = pickupLocation;
  public readonly descriptionBanner = descriptionBanner;
  public readonly inputType = InputType;
  public ordering: boolean = false;
  public ordered: boolean = false;
  private router: Router = inject(Router);
  private componentVisibilityService: ComponentVisibilityService = inject(ComponentVisibilityService);

  constructor() {
    effect(() => {
      const offers = this.orderObject();
      this.orderForm.patchValue(offers);
      console.log('Offers changed:', offers, this.orderForm, this.details());
    });
  }
  ngOnInit(): void {
    this.componentVisibilityService.setContactFormVisibility(false);
  }

  ngOnDestroy(): void {
    this.componentVisibilityService.setContactFormVisibility(true);
  }

  public backToDetails(): void {
    this.previousStep.emit(true);
  }

  public selectMileageLimit(limit: number): void {
    this.orderForm.get('annual_mileage_limit')?.setValue(limit);
    this.offerService.selectMileageLimit(limit, this.details());
  }

  public selectPeriod(period: number): void {
    this.orderForm.get('rental_months')?.setValue(period);
    this.offerService.selectPeriod(period, this.details());
  }

  public selectInitialPayment(price: number): void {
    this.orderForm.get('initial_payment')?.setValue(price);
    this.offerService.selectInitialPayment(price, this.details());
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
    return Boolean(this.orderForm.get('consent_email')?.value) && this.orderForm.valid;
  }

  public closeModal(): void {
    this.ordered = false;
    void this.router.navigate(['/']);
  }

  public orderCar(): void {
    this.ordering = true;
    const orderObject: offerOrderModel = this.orderForm.getRawValue() as offerOrderModel;
    const orderType: 'order' | 'reservation' = this.details().attributes.coming_soon ? 'reservation' : 'order';
    this.offerService.orderOrReserve(orderObject, orderType).subscribe({
      next: result => {
        this.ordering = false;
        this.ordered = true;
      },
      error: error => {
        console.log(error);
        this.ordering = false;
      },
    })

  }
}
