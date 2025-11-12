import { Component } from '@angular/core';
import {ContactForm} from '@components/utilities/contact-form/contact-form';

@Component({
  selector: 'flexmile-footer',
  imports: [
    ContactForm
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

}
