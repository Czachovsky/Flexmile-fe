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
import {ActivatedRoute, Router} from '@angular/router';
import {Screen} from '@services/screen';
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
  public readonly screen: Screen = inject(Screen);
  public readonly inputType = InputType;
  public readonly offersService: OffersService = inject(OffersService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public carBrands: DropdownOption[] = [];
  public carModels: DropdownOption[] = [];
  public fuelList: DropdownOption[] = enumToList(FuelType)
  public transmissionTypeList: DropdownOption[] = enumToList(TransmissionType);
  private router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  public isMobileFiltersOpen: boolean = false;

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
    this.offersService.filtersForm.reset({'price_from': 500, 'price_to': 10000, 'available_immediately': null});
  }

  public toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
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
        const currentParams = this.route.snapshot.queryParams;
        const cleaned = Object.fromEntries(
          Object.entries(formValue).filter(([key, value]) => {
            // For boolean: only keep true values (false means unchecked, so don't include in query params)
            if (typeof value === 'boolean') {
              return value;
            }
            // Always include price_from and price_to if they have values (they are required for form inputs)
            if (key === 'price_from' || key === 'price_to') {
              return value !== null && value !== '' && value !== undefined;
            }
            // For other types: filter out null, undefined, and empty strings
            return value !== null && value !== '' && value !== undefined;
          })
        );

        // Convert boolean values to strings for query params
        const queryParams: any = {};
        Object.entries(cleaned).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            queryParams[key] = String(value);
          } else {
            queryParams[key] = value;
          }
        });

        // Preserve sort parameters (order, order_by) from current query params
        if (currentParams['order']) {
          queryParams['order'] = currentParams['order'];
        }
        if (currentParams['orderby']) {
          queryParams['orderby'] = currentParams['order_by'];
        }

        // Compare only filter parameters (not sort parameters) to avoid unnecessary updates
        const filterKeys = Object.keys(cleaned);
        const currentFilterParams = Object.fromEntries(
          Object.entries(currentParams).filter(([key]) =>
            !['order', 'orderby'].includes(key)
          )
        );

        const isDifferent = filterKeys.length !== Object.keys(currentFilterParams).length
          || filterKeys.some(key => {
            const currentValue = currentFilterParams[key];
            const newValue = cleaned[key];
            // Compare boolean values properly
            if (typeof newValue === 'boolean') {
              return currentValue !== String(newValue);
            }
            return currentValue !== String(newValue);
          });

        if (isDifferent) {
          this.router.navigate([], {
            queryParams: queryParams
          });
        }
      });
  };
}
