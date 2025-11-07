import {Component, input} from '@angular/core';
import {Car} from '@components/utilities/car/car';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {badgeSizes} from '@models/common.types';

@Component({
  selector: 'flexmile-list',
  imports: [
    Car,
    BannerList
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class List {
  hideHeader = input<boolean>(false);
  protected readonly badgeSizes = badgeSizes;
}
