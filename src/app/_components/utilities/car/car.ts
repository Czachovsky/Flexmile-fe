import {Component, inject, input} from '@angular/core';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Badge} from '@components/utilities/badge/badge';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Router} from '@angular/router';

@Component({
  selector: 'flexmile-car',
  imports: [
    Tooltip,
    Badge
  ],
  templateUrl: './car.html',
  styleUrl: './car.scss',
})
export class Car {
  cardSize = input<badgeSizes>(badgeSizes.MD);
  protected readonly badgeTypes = badgeTypes;
  private router: Router = inject(Router);


  public goToOffer(id: number): void {
    this.router.navigateByUrl(`/oferta/${id}`);
  }
}
