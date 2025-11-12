import { Component } from '@angular/core';
import {Hero} from '@components/home-page/_components/hero/hero';
import {badgeSizes, badgeTypes} from '@models/common.types';
import {Link} from '@components/utilities/link/link';
import {List} from '@components/utilities/list/list';
import {WhyUs} from '@components/home-page/_components/why-us/why-us';
import {Faq} from '@components/home-page/_components/faq/faq';
import {Opinions} from '@components/home-page/_components/opinions/opinions';

@Component({
  selector: 'flexmile-home-page',
  imports: [
    Hero,
    Link,
    List,
    WhyUs,
    Faq,
    Opinions,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

  protected readonly badgeSizes = badgeSizes;
  protected readonly badgeTypes = badgeTypes;
}
