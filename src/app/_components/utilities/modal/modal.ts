import {
  booleanAttribute,
  Component,
  EventEmitter,
  Output,
  TemplateRef,
  input,
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

type ModalContent = string | TemplateRef<unknown>;

@Component({
  selector: 'flexmile-modal',
  imports: [
    NgTemplateOutlet,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
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
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  isTemplate(value: ModalContent | null | undefined): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }

}
