import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {List} from "@components/utilities/list/list";
import {Filters} from '@components/utilities/filters/filters';
import {ActivatedRoute, Params} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FiltersType} from '@models/filters.types';
import {OffersService} from '@services/offers';

@Component({
  selector: 'flexmile-offers',
  imports: [
    List,
    Filters
  ],
  templateUrl: './offers.html',
  styleUrl: './offers.scss',
})
export class Offers implements OnInit {
  private readonly offersService: OffersService = inject(OffersService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private currentFilters: FiltersType = {
    make: '',
    model: '',
    fuel: '',
    transmission: '',
    price_from: '',
    price_to: '',

  };

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      console.log(params);
      this.currentFilters = {
        make: params['make'] || '',
        model: params['model'] || '',
        fuel: params['fuel'] || '',
        transmission: params['transmission'] || '',
        price_from: params['price_from'] || '',
        price_to: params['price_to'] || '',
        available: params['available'] || null
      }
      this.offersService.filtersForm.patchValue(this.currentFilters);
      console.log(this.offersService.filtersForm);
      console.log(this.currentFilters);
    })
  }
}
