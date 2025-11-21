import {Component, effect, inject, input, InputSignal, output} from '@angular/core';
import {descriptionBanner, offerFirstStepModel, OfferFormValues, pickupLocation} from '@models/offer.type';
import {OfferBuilder} from '@builders/offer-builder';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DecimalPipe, JsonPipe} from '@angular/common';
import {OfferModel} from '@models/offers.types';
import {ButtonComponent} from '@components/utilities/button/button';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Input} from '@components/utilities/input/input';
import {OfferService} from '@services/offer';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {InputType} from '@models/common.types';

@Component({
  selector: 'flexmile-offer-order',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    ButtonComponent,
    DecimalPipe,
    Tooltip,
    Input,
    BannerList
  ],
  templateUrl: './offer-order.html',
  styleUrl: './offer-order.scss',
})
export class OfferOrder {
  public offerService: OfferService = inject(OfferService);
  orderObject = input.required<offerFirstStepModel>();
  public details: InputSignal<OfferModel> = input.required<OfferModel>();
  orderForm: FormGroup<OfferFormValues> = OfferBuilder.build()
  public previousStep = output<boolean>();
  public readonly pickupLocation = pickupLocation;
  public readonly descriptionBanner = descriptionBanner;
  public readonly inputType = InputType;

  constructor() {

    effect(() => {
      const offers = this.orderObject();
      this.orderForm.patchValue(offers);
      console.log('Offers changed:', offers, this.orderForm);
    });
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

  public isPeriodActive(period: number): boolean {
    return this.offerService.selectedPeriod === period;
  }

  public isMileageLimitActive(limit: number): boolean {
    return this.offerService.selectedMileageLimit === limit;
  }

  public canOrder(): boolean {
    return Boolean(this.orderForm.get('consent_email')?.value) && this.orderForm.valid;
  }
}
