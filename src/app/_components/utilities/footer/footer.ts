import {Component, inject} from '@angular/core';
import {ContactForm} from '@components/utilities/contact-form/contact-form';
import {Link} from '@components/utilities/link/link';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs';
import {NgClass} from '@angular/common';

@Component({
  selector: 'flexmile-footer',
  imports: [
    ContactForm,
    Link,
    NgClass
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private router = inject(Router);

  hideContactForm = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url.includes('/oferta/'))
    ),
    {initialValue: false}
  );
}
