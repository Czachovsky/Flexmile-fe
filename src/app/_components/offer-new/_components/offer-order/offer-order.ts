import {Component, effect, inject, input, InputSignal, output} from '@angular/core';
import {offerFirstStepModel, OfferFormValues, pickupLocation} from '@models/offer.type';
import {OfferBuilder} from '@builders/offer-builder';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DecimalPipe, JsonPipe} from '@angular/common';
import {OfferModel} from '@models/offers.types';
import {ButtonComponent} from '@components/utilities/button/button';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Input} from '@components/utilities/input/input';
import {OfferService} from '@services/offer';

@Component({
  selector: 'flexmile-offer-order',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    ButtonComponent,
    DecimalPipe,
    Tooltip,
    Input
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


}
