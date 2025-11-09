import {Component, input, InputSignal} from '@angular/core';
import {SanitizePipe} from '../../../_pipes/sanitize-pipe';

@Component({
  selector: 'flexmile-banner-list',
  imports: [
    SanitizePipe
  ],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})
export class BannerList {
  label: InputSignal<string> = input<string>('');
  size: InputSignal<'small' | 'large'> = input<'small' | 'large'>('large');
  icon: InputSignal<string | null> = input<string | null>(null);
  description: InputSignal<string> = input<string>('');
  separator: InputSignal<string> = input<string>(' - ');
}
