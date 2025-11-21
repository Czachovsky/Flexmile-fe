import {Component, input, InputSignal, TemplateRef} from '@angular/core';
import {SanitizePipe} from '../../../_pipes/sanitize-pipe';
import {NgClass, NgTemplateOutlet} from '@angular/common';



@Component({
  selector: 'flexmile-banner-list',
  imports: [
    SanitizePipe,
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})
export class BannerList {
  label: InputSignal<string> = input<string>('');
  bannerTemplate = input<TemplateRef<any> | null>(null);
  size: InputSignal<'small' | 'large'> = input<'small' | 'large'>('large');
  position: InputSignal<string> = input<string>('');
  icon: InputSignal<string | null> = input<string | null>(null);
  description: InputSignal<string> = input<string>('');
  separator: InputSignal<string> = input<string>(' - ');
}
