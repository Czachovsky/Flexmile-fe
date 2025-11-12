import {Component} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Input} from '@components/utilities/input/input';
import {InputType} from '@models/common.types';
import {ContactFormBuilder} from '@builders/contact-form-builder';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ContactFormValues} from '@models/contact-form.types';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'flexmile-contact-form',
  imports: [
    ButtonComponent,
    Input,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  public contactForm: FormGroup<ContactFormValues> = ContactFormBuilder.build();
  public readonly inputType = InputType;


  public priceRangeChanged(obj: { min: number, max: number }) {
    this.contactForm.patchValue({
      monthly_budget_from: String(obj.min),
      monthly_budget_to: String(obj.max),
    });
  }

  public getValueForPriceRange(value: string): number {
    return Number(value);
  }
}
