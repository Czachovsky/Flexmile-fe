import {Component, input, InputSignal} from '@angular/core';
import {badgeIcons, badgeLabels, badgeSizes, badgeTypes} from '@models/common.types';
import {LowerCasePipe, NgClass} from '@angular/common';
import {SanitizePipe} from '../../../_pipes/sanitize-pipe';

@Component({
  selector: 'flexmile-badge',
  imports: [
    LowerCasePipe,
    SanitizePipe,
    NgClass
  ],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  size = input<badgeSizes>(badgeSizes.MD);
  label = input<string>();
  date = input<string>();
  type = input<badgeTypes>(badgeTypes.HOT);
  protected readonly badgeLabels = badgeLabels;
  protected readonly badgeIcons = badgeIcons;
}
