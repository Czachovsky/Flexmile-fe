import { Component } from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Car} from '@components/utilities/car/car';
import {Hero} from '@components/home-page/_components/hero/hero';
import {Badge} from '@components/utilities/badge/badge';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {BannerList} from '@components/utilities/banner-list/banner-list';
import {Link} from '@components/utilities/link/link';
import {List} from '@components/utilities/list/list';

@Component({
  selector: 'flexmile-home-page',
  imports: [
    Hero,
    Link,
    List,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

  protected readonly badgeSizes = badgeSizes;
  protected readonly badgeTypes = badgeTypes;
}
