import { Component } from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Animation} from '@components/home-page/_components/animation/animation';

@Component({
  selector: 'flexmile-why-us',
  imports: [
    ButtonComponent,
    Animation
  ],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
})
export class WhyUs {

}
