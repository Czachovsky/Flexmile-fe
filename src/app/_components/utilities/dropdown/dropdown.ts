import {Component, input, signal, effect, forwardRef, HostListener, ElementRef, computed, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  label: string;
  value: any;
}

@Component({
  selector: 'flexmile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true
    }
  ]
})
export class Dropdown implements ControlValueAccessor {
  label = input<string | null>(null);
  options = input.required<DropdownOption[]>();
  placeholder = input<string>('Wybierz opcję');
  theme = input<'light' | 'dark'>('light');
  ariaLabel = input<string>('Dropdown menu');
  disabledInput = input<boolean>(false, { alias: 'disabled' }); // DODANE
  hideSearch = input<boolean>(false);

  isOpen = signal(false);
  selectedValue = signal<any>(null);
  disabled = signal(false);
  focusedIndex = signal(-1);
  searchQuery = signal<string>('');

  filteredOptions = computed(() =>
    this.options().filter(opt =>
      opt.label.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  showNoResults = computed(() =>
    this.searchQuery().length > 0 && this.filteredOptions().length === 0
  );

  @ViewChild('searchInput', { static: false }) searchInput?: ElementRef<HTMLInputElement>;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  displayLabel = signal<string>('');

  constructor(private elementRef: ElementRef) {
    effect(() => {
      this.disabled.set(this.disabledInput());
    });


    effect(() => {
      const value = this.selectedValue();
      const opts = this.options();

      if (value === null || value === undefined) {
        this.displayLabel.set(this.placeholder());
      } else {
        const option = opts.find(opt => opt.value === value);
        this.displayLabel.set(option?.label || this.placeholder());
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      // Tylko Escape może być obsługiwany gdy dropdown zamknięty
      if (event.key === 'Escape') {
        this.closeDropdown();
      }
      return;
    }

    const opts = this.options();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = this.focusedIndex() < opts.length - 1
          ? this.focusedIndex() + 1
          : 0;
        this.setFocusedIndex(nextIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = this.focusedIndex() > 0
          ? this.focusedIndex() - 1
          : opts.length - 1;
        this.setFocusedIndex(prevIndex);
        break;

      case 'Enter':
        if (this.focusedIndex() >= 0) {
          event.preventDefault();
          const option = opts[this.focusedIndex()];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
    }
  }

  toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
      if (this.isOpen()) {
        this.searchQuery.set('');
        // Jeśli wyszukiwanie jest włączone, fokusuj input po renderowaniu
        if (!this.hideSearch()) {
          setTimeout(() => {
            this.searchInput?.nativeElement?.focus();
          }, 0);
        } else {
          const selectedIndex = this.options().findIndex(
            opt => opt.value === this.selectedValue()
          );
          this.setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }
      } else {
        this.onTouched();
        this.focusedIndex.set(-1);
      }
    }
  }

  closeDropdown(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.focusedIndex.set(-1);
      this.onTouched();
    }
  }

  selectOption(option: DropdownOption): void {
    this.selectedValue.set(option.value);
    this.closeDropdown();
    this.onChange(option.value);
  }

  setFocusedIndex(index: number): void {
    this.focusedIndex.set(index);
  }

  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
