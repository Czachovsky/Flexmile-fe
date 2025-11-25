import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {HeroSearch} from '@components/home-page/_components/hero-search/hero-search';
import {Router} from '@angular/router';
import {scrollToSectionById} from '../../../../helpers';

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
  private readonly router: Router = inject(Router);

  goToOffer(): void{
    this.router.navigate(['/oferty']);
  }
  goToSection(section: string): void {
    scrollToSectionById(section, {offset: 125})
  }
}
