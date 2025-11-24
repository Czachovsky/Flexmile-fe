import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {List} from "@components/utilities/list/list";
import {Filters} from '@components/utilities/filters/filters';
import {ActivatedRoute, Params, Router} from '@angular/router';
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
  private router: Router = inject(Router);
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
      // If price params are missing, add default values to URL
      if (!params['price_from'] || !params['price_to']) {
        const newParams = { ...params };
        if (!params['price_from']) {
          newParams['price_from'] = '500';
        }
        if (!params['price_to']) {
          newParams['price_to'] = '10000';
        }
        this.router.navigate([], {
          queryParams: newParams,
          replaceUrl: true
        });
        return;
      }

      this.currentFilters = {
        make: params['make'] || '',
        model: params['model'] || '',
        fuel: params['fuel'] || '',
        transmission: params['transmission'] || '',
        price_from: params['price_from'] || '500',
        price_to: params['price_to'] || '10000',
        order: params['order'] || '',
        orderby: params['orderby'] || '',
        available_immediately: params['available_immediately'] === 'true' || params['available_immediately'] === true ? true : undefined,
      }
      // Use emitEvent: false to prevent triggering valueChanges which would cause double requests
      // Convert undefined to null for form controls
      const formValue = { ...this.currentFilters };
      if (formValue.available_immediately === undefined) {
        formValue.available_immediately = null as any;
      }
      this.offersService.filtersForm.patchValue(formValue, { emitEvent: false });
      this.offersService.filterOffers(this.currentFilters);
    })
  }
}
