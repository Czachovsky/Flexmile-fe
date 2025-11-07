import {Component, input, InputSignal} from '@angular/core';

@Component({
  selector: 'flexmile-banner-list',
  imports: [],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.scss',
})
export class BannerList {
  label: InputSignal<string> = input<string>('');
  description: InputSignal<string> = input<string>('');
}
