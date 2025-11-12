import {FormControl} from '@angular/forms';

export interface ContactFormValues {
  first_name: FormControl<string | null>;
  last_name: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  monthly_budget_from: FormControl<string>;
  monthly_budget_to: FormControl<string>;
  consent_phone: FormControl<boolean>;
  consent_email: FormControl<boolean>;
  message: FormControl<string | null>;
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
