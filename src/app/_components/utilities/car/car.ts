import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Badge} from '@components/utilities/badge/badge';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Router} from '@angular/router';
import {NgTemplateOutlet} from '@angular/common';
import {ButtonComponent} from '@components/utilities/button/button';
import {OfferListOffersModel, OfferModel} from '@models/offers.types';
import {of} from 'rxjs';

@Component({
  selector: 'flexmile-car',
  imports: [
    Tooltip,
    Badge,
    NgTemplateOutlet,
    ButtonComponent
  ],
  templateUrl: './car.html',
  styleUrl: './car.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Car {
  cardSize = input<badgeSizes>(badgeSizes.MD);
  offer = input.required<OfferListOffersModel>()
  protected readonly badgeTypes = badgeTypes;
  protected readonly badgeSizes = badgeSizes;
  private router: Router = inject(Router);


  public goToOffer(id: number): void {
    this.router.navigateByUrl(`/oferta/${id}`);
  }


  protected readonly of = of;
}
