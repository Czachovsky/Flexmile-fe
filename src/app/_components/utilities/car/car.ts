import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Badge} from '@components/utilities/badge/badge';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Router} from '@angular/router';
import {NgTemplateOutlet} from '@angular/common';
import {ButtonComponent} from '@components/utilities/button/button';
import {FuelType, OfferListOffersModel, TransmissionType} from '@models/offers.types';

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
  public readonly transmissionType = TransmissionType;
  public readonly fuelType = FuelType;


  public goToOffer(id: number): void {
    this.router.navigateByUrl(`/oferta/${id}`);
  }

  public getTransmissionLabel(type: string): string {
    return this.transmissionType[type as keyof typeof TransmissionType];
  }

  public getFuelLabel(type: string): string {
    return this.fuelType[type as keyof typeof FuelType];
  }
}
