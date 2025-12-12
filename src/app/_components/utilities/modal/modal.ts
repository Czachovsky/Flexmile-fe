import {
  booleanAttribute,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  input,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {trigger, state, style, transition, animate} from '@angular/animations';

type ModalContent = string | TemplateRef<unknown>;

@Component({
  selector: 'flexmile-modal',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  animations: [
    trigger('slideUpDown', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('0.35s cubic-bezier(0.16, 1, 0.3, 1)')
      ]),
      transition(':leave', [
        animate('0.25s cubic-bezier(0.7, 0, 0.84, 0)')
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition(':enter', [
        animate('0.25s ease-in')
      ]),
      transition(':leave', [
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class Modal {
  public readonly isOpen = input(false, {transform: booleanAttribute});
  public readonly content = input<ModalContent | null>(null);
  public readonly context = input<Record<string, unknown> | null>(null);
  public readonly closeOnBackdrop = input(true, {transform: booleanAttribute});
  public readonly hideCloseButton = input<boolean>(false);
  @Output() closed = new EventEmitter<void>();

  get hasContent(): boolean {
    const value = this.content();
    return value !== undefined && value !== null;
  }

  get templateContent(): TemplateRef<unknown> | null {
    const value = this.content();
    return this.isTemplate(value) ? value : null;
  }

  get textContent(): string | null {
    const value = this.content();
    return typeof value === 'string' ? value : null;
  }

  get outletContext(): Record<string, unknown> {
    return this.context() ?? {};
  }

  close(): void {
    this.closed.emit();
  }

  handleBackdropClick(): void {
    console.log('xxxxxxx', this.closeOnBackdrop())
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  isTemplate(value: ModalContent | null | undefined): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }

}
