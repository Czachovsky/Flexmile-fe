import {Component, inject} from '@angular/core';
import {ContactForm} from '@components/utilities/contact-form/contact-form';
import {Link} from '@components/utilities/link/link';
import {ComponentVisibilityService} from '@services/component-visibility';
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
  private componentVisibilityService: ComponentVisibilityService = inject(ComponentVisibilityService);
  public readonly isContactFormVisible = this.componentVisibilityService.isContactFormVisible;
}
