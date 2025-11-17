import {Component, effect, input} from '@angular/core';
import {offerFirstStepModel, OfferFormValues} from '@models/offer.type';
import {OfferBuilder} from '@builders/offer-builder';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'flexmile-offer-order',
  imports: [],
  templateUrl: './offer-order.html',
  styleUrl: './offer-order.scss',
})
export class OfferOrder {
  orderObject = input.required<offerFirstStepModel>();
  orderForm: FormGroup<OfferFormValues> = OfferBuilder.build()

  constructor() {

    effect(() => {
      const offers = this.orderObject();
      this.orderForm.patchValue(offers);
      console.log('Offers changed:', offers, this.orderForm);
    });

  }
}
