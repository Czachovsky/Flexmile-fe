import {FormControl} from '@angular/forms';

export interface FiltersFormValues {
  car_brand: FormControl<string | null>;
  car_model: FormControl<string | null>;
  fuel: FormControl<string | null>;
  transmission: FormControl<string | null>;
  price_from: FormControl<string | null>;
  price_to: FormControl<string | null>;
  available: FormControl<boolean>;
}
