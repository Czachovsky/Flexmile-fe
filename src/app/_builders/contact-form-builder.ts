import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ContactFormValues} from '@models/contact-form.types';

export class ContactFormBuilder {
  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^(\+48)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : {invalidPhone: true};
  }

  static build(): FormGroup<ContactFormValues> {
    return new FormGroup<ContactFormValues>(<ContactFormValues>{
      first_name: new FormControl<string | null>('', [Validators.required]),
      last_name: new FormControl<string | null>(null, [Validators.required]),
      phone: new FormControl<string | null>(null, [Validators.required, this.phoneValidator]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      monthly_budget_from: new FormControl<string>('500'),
      monthly_budget_to: new FormControl<string>('10000'),
      consent_phone: new FormControl(false, {nonNullable: true}),
      consent_email: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]}),
      message: new FormControl<string | null>(null),
    })

  }
}

