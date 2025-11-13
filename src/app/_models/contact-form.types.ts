import {FormControl} from '@angular/forms';

export interface ContactFormValues {
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  monthly_budget_from: FormControl<string>;
  monthly_budget_to: FormControl<string>;
  consent_phone: FormControl<boolean>;
  consent_email: FormControl<boolean>;
  message: FormControl<string>;
}

export interface ContactFormTypes {
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  monthly_budget_from: string,
  monthly_budget_to: string,
  consent_phone: boolean,
  consent_email: boolean,
  message: string,
}
