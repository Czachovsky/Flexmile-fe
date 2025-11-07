import { Component } from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {HeroSearch} from '@components/home-page/_components/hero-search/hero-search';

@Component({
  selector: 'flexmile-hero',
  imports: [
    ButtonComponent,
    HeroSearch
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {

}
