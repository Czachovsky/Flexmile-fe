import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MakeListModel, HeroSearchFormValues} from '@models/hero-search.types';
import {HeroSearchBuilder} from '@builders/hero-search-buider';
import {Dropdown, DropdownOption} from '@components/utilities/dropdown/dropdown';
import {ButtonComponent} from '@components/utilities/button/button';
import {OffersService} from '@services/offers';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

@Component({
  selector: 'flexmile-hero-search',
  imports: [
    ReactiveFormsModule,
    Dropdown,
    ButtonComponent
  ],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.scss',
})
export class HeroSearch implements OnInit {
  private readonly offerService: OffersService = inject(OffersService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  public searchForm: FormGroup<HeroSearchFormValues> = HeroSearchBuilder.build();
  public carBrands: DropdownOption[] = [];
  public carModels: DropdownOption[] = [];

  ngOnInit() {
    this.getBrands();
    this.listenValueChanges();
  }

  private getBrands(): void {
    this.offerService.getMakes().subscribe({
      next: (data: MakeListModel[]) => {
        this.carBrands = data.map(item => ({
          value: item.slug,
          label: item.name
        }));
      }
    })
  }

  public goToFiltered(): void {
    const queryParams: any = {};
    if (this.searchForm.get('make')?.value) {
      queryParams.make = this.searchForm.get('make')?.value;
    }
    if (this.searchForm.get('model')?.value) {
      queryParams.model = this.searchForm.get('model')?.value;
    }
    this.router.navigate(['/oferty'], {
      queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined
    });
  }

  private listenValueChanges(): void {
    this.searchForm.get('make')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        this.offerService.getModelsForBrand(value).subscribe({
          next: (data) => {
            this.carModels = data.models.map(model => ({
              value: model.toLowerCase(),
              label: model
            }))
          }
        })
      }
    })
  }

}
