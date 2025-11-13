import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Dropdown, DropdownOption} from '@components/utilities/dropdown/dropdown';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {Input} from '@components/utilities/input/input';
import {InputType} from '@models/common.types';
import {OffersService} from '@services/offers';
import {MakeListModel} from '@models/hero-search.types';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'flexmile-filters',
  imports: [
    Dropdown,
    ReactiveFormsModule,
    NgxSliderModule,
    Input,
  ],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnInit {
  public readonly inputType = InputType;
  public readonly offersService: OffersService = inject(OffersService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public carBrands: DropdownOption[] = [];
  public carModels: DropdownOption[] = [];

  ngOnInit() {
    this.getBrands();
    this.listenValueChanges();
  }



  public priceRangeChanged(obj: { min: number, max: number }): void {
    this.offersService.filtersForm.patchValue({
      price_from: obj.min,
      price_to: obj.max,
    });
  }

  public resetFilters(): void {
  this.offersService.filtersForm.reset({'price_from': 500, 'price_to': 10000});
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
    this.offersService.filtersForm.get('make')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      console.log(value);
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
    this.offersService.filtersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      console.log(this.offersService.filtersForm.getRawValue());
      this.offersService.filterOffers(this.offersService.filtersForm.getRawValue())
    })
  };
}
