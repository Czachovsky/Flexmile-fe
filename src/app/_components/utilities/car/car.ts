import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {Tooltip} from '@components/utilities/tooltip/tooltip';
import {Badge} from '@components/utilities/badge/badge';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Router} from '@angular/router';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {ButtonComponent} from '@components/utilities/button/button';
import {FuelType, OfferListOffersModel, TransmissionType} from '@models/offers.types';
import {Screen} from '@services/screen';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {offerListFeatures} from '@models/offer.type';
import {SanitizePipe} from '@pipes/sanitize-pipe';

@Component({
  selector: 'flexmile-car',
  imports: [
    Tooltip,
    Badge,
    NgTemplateOutlet,
    ButtonComponent,
    SanitizePipe,
    NgClass
  ],
  templateUrl: './car.html',
  styleUrl: './car.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideUpDown', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('0.35s cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition(':leave', [
        animate('0.25s cubic-bezier(0.7, 0, 0.84, 0)')
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition(':enter', [
        animate('0.25s ease-in')
      ]),
      transition(':leave', [
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class Car {
  cardSize = input<badgeSizes>(badgeSizes.MD);
  offer = input.required<OfferListOffersModel>()
  disableLazyLoad = input<boolean>(false);
  protected readonly badgeTypes = badgeTypes;
  protected readonly badgeSizes = badgeSizes;
  private router: Router = inject(Router);
  public readonly screen: Screen = inject(Screen);
  public readonly transmissionType = TransmissionType;
  public readonly fuelType = FuelType;
  public featuresState: boolean = false;
  public offerListFeatures = offerListFeatures;

  public goToOffer(id: number): void {
    this.router.navigateByUrl(`/oferta/${id}`);
  }
 public goToOfferList(): void {
    this.router.navigate(['/oferty']);
  }
  public getTransmissionLabel(type: string): string {
    return this.transmissionType[type as keyof typeof TransmissionType];
  }

  public getFuelLabel(type: string): string {
    return this.fuelType[type as keyof typeof FuelType];
  }

  public showFeatures(event: Event): void {
    event.stopPropagation();
    this.featuresState = this.screen.isMobile();
  }

  public checkIfAnyTrue(): boolean {
    return Object.values(this.offer().additional_services).some(value => value.enabled);
  }
}
