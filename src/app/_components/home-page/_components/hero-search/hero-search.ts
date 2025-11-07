import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MakeListModel, HeroSearchFormValues} from '@models/hero-search.types';
import {HeroSearchBuilder} from '@builders/hero-search-buider';
import {Dropdown, DropdownOption} from '@components/utilities/dropdown/dropdown';
import {ButtonComponent} from '@components/utilities/button/button';
import {Offers} from '@services/offers';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  private readonly offerService: Offers = inject(Offers);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
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

  private listenValueChanges(): void {
    this.searchForm.get('make')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        this.offerService.getModelsForBrand(value).subscribe({
          next: (data) => {
            this.carModels = data.models.map(model => ({
              value: model.toLowerCase(),
              label: model
            }))
            console.log(this.carModels)
          }
        })
      }
    })
  }

}
