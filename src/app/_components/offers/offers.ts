import { Component } from '@angular/core';
import {List} from "@components/utilities/list/list";
import {Filters} from '@components/utilities/filters/filters';

@Component({
  selector: 'flexmile-offers',
  imports: [
    List,
    Filters
  ],
  templateUrl: './offers.html',
  styleUrl: './offers.scss',
})
export class Offers {

}
