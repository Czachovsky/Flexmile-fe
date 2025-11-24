import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Dropdown, DropdownOption} from '@components/utilities/dropdown/dropdown';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {Input} from '@components/utilities/input/input';
import {InputType} from '@models/common.types';
import {OffersService} from '@services/offers';
import {MakeListModel} from '@models/hero-search.types';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {distinctUntilChanged, EMPTY, startWith, switchMap} from 'rxjs';
import {enumToList} from '../../../helpers';
import {FuelType, TransmissionType} from '@models/offers.types';
import {JsonPipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

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
  public readonly inputType = InputType;
  public readonly offersService: OffersService = inject(OffersService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public carBrands: DropdownOption[] = [];
  public carModels: DropdownOption[] = [];
  public fuelList: DropdownOption[] = enumToList(FuelType)
  public transmissionTypeList: DropdownOption[] = enumToList(TransmissionType);
  private router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

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
    const makeControl = this.offersService.filtersForm.get('make');
    const modelControl = this.offersService.filtersForm.get('model');

    if (makeControl) {
      const resetModels = () => {
        this.carModels = [];
        if (modelControl?.value !== null && modelControl?.value !== undefined && modelControl.value !== '') {
          modelControl.setValue(null);
        }
      };

      makeControl.valueChanges
        .pipe(
          startWith(makeControl.value),
          distinctUntilChanged(),
          switchMap(value => {
            if (!value) {
              resetModels();
              return EMPTY;
            }

            return this.offersService.getModelsForBrand(value);
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: data => {
            this.carModels = data.models.map(model => ({
              value: model.toLowerCase(),
              label: model
            }));

            if (modelControl?.value) {
              const normalizedValue = modelControl.value.toLowerCase();
              const existsInList = this.carModels.some(option => option.value === normalizedValue);

              if (!existsInList) {
                modelControl.setValue(null);
              }
            }
          }
        });
    }

    this.offersService.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(formValue => {
        console.log(formValue);
        const cleaned = Object.fromEntries(
          Object.entries(formValue).filter(([_, value]) =>
            value !== null && value !== '' && value !== undefined
          )
        );
        const currentParams = this.route.snapshot.queryParams;
        const isDifferent = Object.keys(cleaned).length !== Object.keys(currentParams).length
          || Object.entries(cleaned).some(([key, value]) => currentParams[key] !== String(value));
        console.log(isDifferent, cleaned);
        if (isDifferent) {
          console.log('this.router.navigate', cleaned)
          this.router.navigate([], {
            queryParams: cleaned
          });
        }

        this.offersService.filterOffers(formValue);
      });
  };
}
