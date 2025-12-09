import {Component, HostListener, inject, OnInit, OnDestroy, Renderer2, effect} from '@angular/core';
import {menuElements, MenuElementsModel} from '@models/header.types';
import {Screen} from '@services/screen';
import {NgClass} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {scrollToSectionById} from '../../../helpers';

@Component({
  selector: 'flexmile-header',
  imports: [
    NgClass,
    RouterLink
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
  scrollPosition: any;
  private renderer: Renderer2 = inject(Renderer2);

  constructor() {
    // Automatically close mobile menu when screen size changes to desktop
    effect(() => {
      const screenWidth = this.screen.screenSize();
      // Close menu when switching to desktop (>= 1024px)
      if (screenWidth >= 1024 && this.mobileMenuState) {
        this.mobileMenuState = false;
        this.removeStyles();
      }
    });
  }

  ngOnInit() {
    this.updateActiveMenuItem();
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > this.scrollTriggerOffset && !this.screen.isMobile();
    this.updateActiveMenuItem();
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
    console.log(item)

    // Close mobile menu first if on mobile
    const isMobile = this.screen.isMobile();
    if (isMobile) {
      this.mobileMenuState = false;
      this.removeStyles();
    }

    // If we're not on the home page, navigate to home first
    const isOnHomePage = this.router.url === '/';

    if (!isOnHomePage) {
      this.router.navigate(['/']).then(() => {
        // Wait for navigation, DOM update, and mobile menu to close
        const delay = isMobile ? 300 : 100;
        setTimeout(() => {
          if (item.type === 'section' && item.section) {
            this.scrollToSection(item.section);
          } else if (item.type === 'url' && item.url && item.url !== '/') {
            // Navigate to the URL after reaching home page
            this.router.navigate([item.url]);
          }
        }, delay);
      });
    } else {
      // We're already on home page
      if (item.type === 'section' && item.section) {
        // Wait for mobile menu to close before scrolling
        const delay = isMobile ? 200 : 0;
        setTimeout(() => {
          this.scrollToSection(item.section!);
        }, delay);
      } else if (item.type === 'url' && item.url) {
        this.router.navigate([item.url]);
      }
    }
  }

  private scrollToSection(sectionId: string) {
    const headerHeight = 100;
    const scrolled = scrollToSectionById(sectionId, {offset: headerHeight});

    if (scrolled) {
      // Update active menu item after scroll
      this.scrollTimeout = setTimeout(() => {
        this.updateActiveMenuItem();
      }, 300);
    }
  }

  private updateActiveMenuItem() {
    // Only update active menu item if we're on the home page
    if (this.router.url !== '/') {
      this.activeMenuItem = null;
      return;
    }

    const sections = this.menuElements.filter(item => item.type === 'section' && item.section);
    const headerHeight = 100;
    const viewportOffset = 150; // Offset to trigger active state

    let activeSection: string | null = null;
    let minDistance = Infinity;

    // Check which section is currently in viewport or closest to viewport top
    for (const item of sections) {
      if (!item.section) continue;

      const element = document.getElementById(item.section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const distanceFromTop = Math.abs(rect.top - headerHeight);

        // Check if element is in viewport (with offset for header)
        if (
          rect.top <= headerHeight + viewportOffset &&
          rect.bottom >= headerHeight
        ) {
          // Element is in viewport, prioritize by distance from top
          if (distanceFromTop < minDistance) {
            minDistance = distanceFromTop;
            activeSection = item.section;
          }
        }
      }
    }

    this.activeMenuItem = activeSection;
  }

  isMenuItemActive(item: MenuElementsModel): boolean {
    if (item.type === 'section' && item.section) {
      return this.activeMenuItem === item.section;
    }
    if (item.type === 'url' && item.url) {
      const currentUrl = this.router.url;
      // Handle root path
      if (item.url === '/' && currentUrl === '/') {
        return true;
      }
      // Handle other paths
      if (item.url !== '/' && currentUrl.startsWith(item.url)) {
        return true;
      }
    }
    return false;
  }

  public goToList(): void {
   void this.router.navigate(['/oferty']);
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
