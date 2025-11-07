import {
  Component,
  forwardRef,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output, OutputEmitterRef,
  signal,
  WritableSignal
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {InputType} from '@models/common.types';
import {NgxSliderModule, Options} from '@angular-slider/ngx-slider';
import {Subscription} from 'rxjs';

@Component({
  selector: 'flexmile-input',
  imports: [
    ReactiveFormsModule,
    NgxSliderModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class Input implements ControlValueAccessor, OnInit, OnDestroy {
  public type: InputSignal<InputType> = input<InputType>(InputType.text);
  public label: InputSignal<string> = input<string>('');
  public placeholder: InputSignal<string> = input<string>('');
  public required: InputSignal<boolean> = input<boolean>(false);
  public disabled: WritableSignal<boolean> = signal<boolean>(false);
  public control = input<AbstractControl | null>();
  public inputId: InputSignal<string> = input<string>('');
  public min: InputSignal<number> = input<number>(20);
  public max: InputSignal<number> = input<number>(500);
  public step: InputSignal<number> = input<number>(20);
  public suffix: InputSignal<string | null> = input<string | null>(null);
  public isPriceInput: InputSignal<boolean> = input<boolean>(false);
  public rangeChanged: OutputEmitterRef<{ min: number, max: number}> = output();
  public options!: Options;
  public minValue = signal<number>(20);
  public maxValue = signal<number>(500);
  public readonly inputType = InputType;
  isEditing: boolean = false;
  value: any;
  displayValue: string = '';
  private readonly internalControl: FormControl = new FormControl(null);
  private controlSubscription: Subscription | null = null;

  onChange: (value: string) => void = () => {
  };
  onTouched: () => void = () => {
  };

  get formControl(): FormControl {
    return (this.control() as FormControl | null) ?? this.internalControl;
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.minValue.set(this.min());
    this.maxValue.set(this.max());
    this.options = {
      floor: this.min(),
      ceil: this.max(),
      step: 100,
      hideLimitLabels: true,
      readOnly: false,
      translate: (value: number): string => {
        return value + ' zł';
      }
    };

    this.controlSubscription = this.formControl.valueChanges.subscribe((val) => {
      if (!this.isPriceInput()) {
        this.value = val;
        this.onChange(val);
      }
      // For price inputs, we handle value updates in onPriceInput/onPriceBlur
    });

    // Initialize display value for price inputs
    if (this.isPriceInput()) {
      const initialValue = this.formControl.value;
      if (initialValue) {
        const numericValue = initialValue.toString().replace(/[^\d]/g, '');
        if (numericValue) {
          this.displayValue = `${numericValue} zł`;
          // Ensure formControl has only numeric value (without 'zł')
          this.formControl.setValue(numericValue, {emitEvent: false});
          this.value = numericValue;
        } else {
          this.displayValue = '';
        }
      } else {
        this.displayValue = '';
      }
    }
  }

  writeValue(value: string): void {
    if (this.isPriceInput() && value) {
      const numericValue = value.toString().replace(/[^\d]/g, '');
      this.displayValue = numericValue ? `${numericValue} zł` : '';
      // Store numeric value in formControl (without 'zł')
      this.formControl.setValue(numericValue, {emitEvent: false});
      this.value = numericValue;
    } else {
      this.value = value;
      this.formControl.setValue(value, {emitEvent: false});
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) {
      this.formControl.disable({emitEvent: false});
    } else {
      this.formControl.enable({emitEvent: false});
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.valid ? null : {invalid: true};
  }

  getErrorMessage(): string {
    if (!this.control || !this.control()?.errors) return '';
    if (this.control()?.errors?.['required']) return 'To pole jest wymagane.';
    if (this.control()?.errors?.['email']) return 'Wprowadź poprawny adres e-mail.';
    if (this.control()?.errors?.['minlength']) {
      return `Minimalna długość to ${this.control()?.errors?.['minlength']?.requiredLength} znaki.`;
    }
    return 'Nieprawidłowa wartość.';
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  disableEditing(event: any): void {
    this.isEditing = false;
    this.value = (event.target as HTMLInputElement).valueAsNumber;
  }

  public onUserChangeEnd(): void {
    this.rangeChanged.emit({min: this.minValue(), max: this.maxValue()});
  }

  public onPriceInput(event: Event): void {
    if (!this.isPriceInput()) return;

    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove 'zł' and any non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');

    // Update display value with 'zł' suffix
    this.displayValue = numericValue ? `${numericValue} zł` : '';

    // Update form control with numeric value only (without 'zł')
    this.formControl.setValue(numericValue, {emitEvent: false});

    // Store numeric value and call onChange with numeric value only
    this.value = numericValue;
    this.onChange(numericValue);
  }

  public onPriceBlur(event: Event): void {
    if (!this.isPriceInput()) {
      this.onTouched();
      return;
    }

    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove 'zł' and any non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');

    // Update display value with 'zł' suffix
    this.displayValue = numericValue ? `${numericValue} zł` : '';

    // Update form control with numeric value only (without 'zł')
    this.formControl.setValue(numericValue, {emitEvent: false});

    // Store numeric value and call onChange with numeric value only
    this.value = numericValue;
    this.onChange(numericValue);
    this.onTouched();
  }

  public onPriceFocus(event: Event): void {
    if (!this.isPriceInput()) return;

    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove 'zł' for editing
    value = value.replace(/[^\d]/g, '');
    input.value = value;
  }

}
