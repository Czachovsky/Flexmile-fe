import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

export interface HeroSearchType {
  make: string;
  model: string;
}

export interface HeroSearchFormValues {
  make: FormControl<string | null>;
  model: FormControl<string | null>;
}

export interface MakeListModel {
  name: string;
  slug: string;
}

export interface CarModelsModel {
  brand_slug: string;
  brand_name: string;
  models: string[];
}
