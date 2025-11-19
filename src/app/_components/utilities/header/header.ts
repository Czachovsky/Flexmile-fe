import {Component, HostListener, inject} from '@angular/core';
import {menuElements} from '@models/header.types';
import {Screen} from '@services/screen';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'flexmile-header',
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly screen: Screen = inject(Screen);
  public readonly menuElements = menuElements;
  private readonly scrollTriggerOffset = 200;
  public isScrolled = window.scrollY > this.scrollTriggerOffset && !this.screen.isMobile();
  public mobileMenuState: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > this.scrollTriggerOffset && !this.screen.isMobile();
  }
}
