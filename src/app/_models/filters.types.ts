import {FormControl} from '@angular/forms';

export interface FiltersFormValues {
  make: FormControl<string | null>;
  model: FormControl<string | null>;
  fuel: FormControl<string | null>;
  transmission: FormControl<string | null>;
  price_from: FormControl<string | null>;
  price_to: FormControl<string | null>;
  available_immediately: FormControl<boolean | null>;
}

export interface FiltersType {
  make: string;
  model: string;
  fuel: string;
  transmission: string;
  price_from: string;
  price_to: string;
  order?: string;
  orderby?: string;
  available_immediately?: boolean;
}
