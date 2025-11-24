import {OfferFormValues, pickupLocation} from '@models/offer.type';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

export class OfferBuilder {
  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^(\+48)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : {invalidPhone: true};
  }
static build(): FormGroup<OfferFormValues> {
  return new FormGroup<OfferFormValues>({
    offer_id: new FormControl<number | null>(null, [Validators.required]),
    rental_months: new FormControl<number | null>(null, [Validators.required]),
    annual_mileage_limit: new FormControl<number | null>(null, [Validators.required]),
    monthly_price: new FormControl<number | null>(null, [Validators.required]),
    company_name: new FormControl<string | null>(null, [Validators.required]),
    tax_id: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('[0-9]*')]),
    phone: new FormControl<string | null>(null, [Validators.required, this.phoneValidator]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    pickup_location: new FormControl<pickupLocation | null>(pickupLocation.salon),
    consent_phone: new FormControl<boolean>(false, {nonNullable: true}),
    consent_email: new FormControl<boolean>(false, {nonNullable: true}),
  })
}
}
