import { Component, output, input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'flexmile-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class ButtonComponent {
  onlyIcon = input<boolean>(false);
  label = input<string | number>('Kliknij');
  type = input<'button' | 'submit' | 'reset'>('button');
  color = input<'primary' | 'secondary' | 'outline'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  disabled = input<boolean>(false);
  icon = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  btnClass = input<string>('');

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
