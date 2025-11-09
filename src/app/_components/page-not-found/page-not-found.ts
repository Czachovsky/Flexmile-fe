import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Router} from '@angular/router';

@Component({
  selector: 'flexmile-page-not-found',
  imports: [
    ButtonComponent
  ],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound {
  private router: Router = inject(Router);
  public backToHome(): void {
    this.router.navigate(['/']);
  }
}
