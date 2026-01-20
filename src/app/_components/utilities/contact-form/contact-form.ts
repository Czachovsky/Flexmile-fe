import {Component, inject} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Input} from '@components/utilities/input/input';
import {InputType} from '@models/common.types';
import {ContactFormBuilder} from '@builders/contact-form-builder';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ContactFormValues} from '@models/contact-form.types';
import {JsonPipe} from '@angular/common';
import {ContactFormService} from '@services/contact-form';

@Component({
  selector: 'flexmile-contact-form',
  imports: [
    ButtonComponent,
    Input,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  public contactForm: FormGroup<ContactFormValues> = ContactFormBuilder.build();
  public readonly inputType = InputType;
  public errorChecked: boolean = false;
  public successfullySent: boolean = false;

  public priceRangeChanged(obj: { min: number, max: number }) {
    this.contactForm.patchValue({
      monthly_budget_from: String(obj.min),
      monthly_budget_to: String(obj.max),
    });
  }

  private readonly contactFormService: ContactFormService = inject(ContactFormService)

  public getValueForPriceRange(value: string): number {
    return Number(value);
  }

  public sendForm(): void {
    if (this.contactForm.invalid) {
      this.errorChecked = true;
      this.contactForm.markAllAsTouched();
    } else {
      this.contactFormService.sendContactMail(this.contactForm.getRawValue()).subscribe({
        next: () => {
          this.errorChecked = false;
          this.successfullySent = true;
          
          // Google Ads conversion tracking
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
              'send_to': 'AW-17883080050/IPQ3COz0iucbEPLKqM9C',
              'value': 1.0,
              'currency': 'PLN'
            });
          }
        }
      })
    }
  }

  public showForm(): void{
    this.contactForm.reset();
    this.successfullySent = false;
  }
}
