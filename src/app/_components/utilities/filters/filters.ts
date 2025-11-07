import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Dropdown, DropdownOption} from '@components/utilities/dropdown/dropdown';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgxSliderModule, Options} from '@angular-slider/ngx-slider';
import {Input} from '@components/utilities/input/input';
import {InputType} from '@models/common.types';
import {FilterBuilder} from '@builders/filters-builder';
import {JsonPipe} from '@angular/common';
import {Offers} from '@services/offers';
import {MakeListModel} from '@models/hero-search.types';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'flexmile-filters',
  imports: [
    Dropdown,
    ReactiveFormsModule,
    NgxSliderModule,
    Input,
    JsonPipe,
  ],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnInit {
  public filtersForm: FormGroup = FilterBuilder.build();
  public readonly inputType = InputType;
  private readonly offersService: Offers = inject(Offers);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public carBrands: DropdownOption[] = [];
  public carModels: DropdownOption[] = [];

  ngOnInit() {
    this.getBrands();
    this.listenValueChanges();
  }

  public priceRangeChanged(obj: { min: number, max: number }): void {
    this.filtersForm.get('price_from')?.setValue(obj.min);
    this.filtersForm.get('price_to')?.setValue(obj.max);
  }

  public resetFilters(): void {
  this.filtersForm.reset({'price_from': 500, 'price_to': 10000});
  }

  private getBrands(): void {
    this.offersService.getMakes().subscribe({
      next: (data: MakeListModel[]) => {
        this.carBrands = data.map(item => ({
          value: item.slug,
          label: item.name
        }));
      }
    })
  }

  private listenValueChanges(): void {
    this.filtersForm.get('make')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        this.offersService.getModelsForBrand(value).subscribe({
          next: (data) => {
            this.carModels = data.models.map(model => ({
              value: model.toLowerCase(),
              label: model
            }))
          }
        })
      }
    })
    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(this.filtersForm.getRawValue());
    })
  };
}
