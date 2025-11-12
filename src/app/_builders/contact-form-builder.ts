import {FormControl, FormGroup} from '@angular/forms';
import {ContactFormValues} from '@models/contact-form.types';

export class ContactFormBuilder {
  static build(): FormGroup<ContactFormValues> {
    return new FormGroup<ContactFormValues>(<ContactFormValues>{
      first_name: new FormControl<string | null>(null),
      last_name: new FormControl<string | null>(null),
      phone: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null),
      monthly_budget_from: new FormControl<string>('500'),
      monthly_budget_to: new FormControl<string>('10000'),
      consent_phone: new FormControl(false, {nonNullable: true}),
      consent_email: new FormControl(false, {nonNullable: true}),
      message: new FormControl<string | null>(null),
    })

  }
}

