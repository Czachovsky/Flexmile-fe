import { Component } from '@angular/core';
import {ContactForm} from '@components/utilities/contact-form/contact-form';
import {Link} from '@components/utilities/link/link';

@Component({
  selector: 'flexmile-footer',
  imports: [
    ContactForm,
    Link
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

}
