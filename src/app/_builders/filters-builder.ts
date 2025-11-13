import {FiltersFormValues} from '@models/filters.types';
import {FormControl, FormGroup} from '@angular/forms';

export class FilterBuilder {
  static build(): FormGroup<FiltersFormValues> {
    return new FormGroup<FiltersFormValues>({
      make: new FormControl<string | null>(null),
      model: new FormControl<string | null>(null),
      transmission: new FormControl<string | null>(null),
      fuel: new FormControl<string | null>(null),
      price_from: new FormControl<string | null>('500'),
      price_to: new FormControl<string | null>('10000'),
      available: new FormControl<boolean>(false, { nonNullable: true }),
    })
  }
}
