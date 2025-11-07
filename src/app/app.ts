import {Component, HostListener, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './_components/utilities/header/header';
import {Footer} from './_components/utilities/footer/footer';
import {Screen} from '@services/screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public readonly screen: Screen = inject(Screen);
  public isScrolled = window.scrollY > 10 && !this.screen.isMobile();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10 && !this.screen.isMobile();
  }
}
