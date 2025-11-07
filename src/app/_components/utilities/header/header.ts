import {Component, HostListener, inject} from '@angular/core';
import {menuElements} from '@models/header.types';
import {Screen} from '@services/screen';
import {NgClass, NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'flexmile-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly screen: Screen = inject(Screen);
  public readonly menuElements = menuElements;
  public isScrolled = window.scrollY > 10 && !this.screen.isMobile();
  public mobileMenuState: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10 && !this.screen.isMobile();
  }
}
