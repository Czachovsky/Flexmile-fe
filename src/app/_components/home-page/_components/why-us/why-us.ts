import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Animation} from '@components/home-page/_components/animation/animation';
import {Router} from '@angular/router';

@Component({
  selector: 'flexmile-why-us',
  imports: [
    ButtonComponent,
    Animation
  ],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
})
export class WhyUs {
  private router: Router = inject(Router);

  public goToOffer(): void {
    this.router.navigate(['/oferty']);
  }
}
