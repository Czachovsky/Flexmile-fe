import {Component, HostListener, inject, OnInit, OnDestroy, Renderer2, effect} from '@angular/core';
import {menuElements, MenuElementsModel} from '@models/header.types';
import {Screen} from '@services/screen';
import {NgClass} from '@angular/common';
import {Router, RouterLink, NavigationEnd} from '@angular/router';
import {filter, Subscription} from 'rxjs';
import {scrollToSectionById} from '../../../helpers';

@Component({
  selector: 'flexmile-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  public readonly screen: Screen = inject(Screen);
  public readonly menuElements = menuElements;
  private readonly scrollTriggerOffset = 200;
  public isScrolled = window.scrollY > this.scrollTriggerOffset && !this.screen.isMobile();
  public mobileMenuState: boolean = false;
  public activeMenuItem: string | null = null;
  private readonly router: Router = inject(Router);
  private scrollTimeout: any;
  private scrollUpdateTimeout: any;
  private routerSubscription?: Subscription;
  scrollPosition: any;
  private renderer: Renderer2 = inject(Renderer2);

  constructor() {
    effect(() => {
      const screenWidth = this.screen.screenSize();
      if (screenWidth >= 1024 && this.mobileMenuState) {
        this.mobileMenuState = false;
        this.removeStyles();
      }
    });
  }

  ngOnInit() {
    this.updateActiveMenuItem();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.updateActiveMenuItem();
        }, 100);
      });
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.scrollUpdateTimeout) {
      clearTimeout(this.scrollUpdateTimeout);
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > this.scrollTriggerOffset && !this.screen.isMobile();

    if (this.scrollUpdateTimeout) {
      clearTimeout(this.scrollUpdateTimeout);
    }
    this.scrollUpdateTimeout = setTimeout(() => {
      this.updateActiveMenuItem();
    }, 100);
  }

  public openMobileMenu(): void {
    this.mobileMenuState = !this.mobileMenuState;

    if (this.mobileMenuState) {
      this.setStyles();
    } else {
      this.removeStyles();
      window.scrollTo(0, this.scrollPosition);
    }
  }

  handleMenuItemClick(event: Event, item: MenuElementsModel) {
    event.preventDefault();
    const isMobile = this.screen.isMobile();
    if (isMobile) {
      this.mobileMenuState = false;
      this.removeStyles();
    }

    const isOnHomePage = this.router.url === '/';

    if (!isOnHomePage) {
      if (item.type === 'section' && item.section) {
        this.router.navigate(['/']).then(() => {

          const delay = isMobile ? 500 : 300;
          setTimeout(() => {
            this.scrollToSection(item.section!);
          }, delay);
        });
      } else if (item.type === 'url' && item.url === '/') {
        this.router.navigate(['/']).then(() => {
          const delay = isMobile ? 300 : 100;
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              this.updateActiveMenuItem();
            }, 300);
          }, delay);
        });
      } else if (item.type === 'url' && item.url && item.url !== '/') {
        this.router.navigate([item.url]);
      }
    } else {
      if (item.type === 'section' && item.section) {
        const delay = isMobile ? 200 : 0;
        setTimeout(() => {
          this.scrollToSection(item.section!);
        }, delay);
      } else if (item.type === 'url' && item.url === '/') {
        const delay = isMobile ? 200 : 0;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            this.updateActiveMenuItem();
          }, 300);
        }, delay);
      } else if (item.type === 'url' && item.url && item.url !== '/') {
        this.router.navigate([item.url]);
      }
    }
  }

  private getHeaderHeight(): number {
    const headerElement = document.querySelector('.header');
    if (headerElement) {
      return headerElement.getBoundingClientRect().height;
    }
    return this.screen.isMobile() ? 80 : 100;
  }

  private scrollToSection(sectionId: string) {
    const headerHeight = this.getHeaderHeight();
    const mobileOffset = this.screen.isMobile() ? 20 : 0;
    const totalOffset = headerHeight + mobileOffset;

    const scrolled = scrollToSectionById(sectionId, {
      offset: totalOffset,
      maxRetries: 5,
      retryDelay: 200,
      threshold: 10
    });

    if (scrolled) {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        this.updateActiveMenuItem();
      }, 400);
    }
  }

  private updateActiveMenuItem() {
    if (this.router.url !== '/') {
      this.activeMenuItem = null;
      this.menuElements.forEach(item => {
        if (item.type === 'url') {
          item.active = this.isMenuItemActive(item);
        } else {
          item.active = false;
        }
      });
      return;
    }

    const sections = this.menuElements.filter(item => item.type === 'section' && item.section);
    const headerHeight = this.getHeaderHeight();
    const viewportOffset = this.screen.isMobile() ? 100 : 150;
    const scrollY = window.scrollY || window.pageYOffset;
    const topThreshold = 200;

    let activeSection: string | null = null;
    let minDistance = Infinity;

    for (const item of sections) {
      if (!item.section) continue;

      const element = document.getElementById(item.section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const distanceFromTop = Math.abs(rect.top - headerHeight);

        const topThresholdViewport = headerHeight + viewportOffset;
        const bottomThreshold = headerHeight;

        if (
          rect.top <= topThresholdViewport &&
          rect.bottom >= bottomThreshold
        ) {
          if (distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            activeSection = item.section;
          }
        }
      }
    }

    this.activeMenuItem = activeSection;

    this.menuElements.forEach(item => {
      if (item.type === 'section' && item.section) {
        item.active = item.section === activeSection;
      } else if (item.type === 'url') {
        if (item.url === '/') {
          item.active = scrollY < topThreshold && activeSection === null;
        } else {
          item.active = this.isMenuItemActive(item);
        }
      }
    });
  }

  isMenuItemActive(item: MenuElementsModel): boolean {
    if (item.type === 'url' && item.url) {
      const currentUrl = this.router.url;
      if (item.url === '/' && currentUrl === '/') {
        return true;
      }
      if (item.url !== '/' && currentUrl.startsWith(item.url)) {
        return true;
      }
    }
    return false;
  }

  public goToList(): void {
    void this.router.navigate(['/oferty']);
  }

  public goToMainPage(): void {
    const isOnHomePage = this.router.url === '/';

    if (isOnHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      void this.router.navigate(['/']);
    }
  }

  private setStyles(): void {
    this.scrollPosition = window.pageYOffset;
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.renderer.setStyle(document.body, 'top', `-${this.scrollPosition}px`);
    this.renderer.setStyle(document.body, 'width', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  private removeStyles(): void {
    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'top');
    this.renderer.removeStyle(document.body, 'width');
    this.renderer.removeStyle(document.body, 'overflow');
  }
}
