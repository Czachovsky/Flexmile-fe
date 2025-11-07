import {HeroSearchFormValues} from '@models/hero-search.types';
import {FormControl, FormGroup} from '@angular/forms';

export class HeroSearchBuilder {
  static build(): FormGroup<HeroSearchFormValues> {
    return new FormGroup<HeroSearchFormValues>({
      make: new FormControl<string | null>(null),
      model: new FormControl<string | null>(null)
    })
  }
}

