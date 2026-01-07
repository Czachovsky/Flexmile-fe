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
  private scrollUpdateTimeout: any;
  private routerSubscription?: Subscription;
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
    
    // Listen to route changes to update active menu items
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Small delay to ensure DOM is updated
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
    
    // Debounce active menu item updates during scroll for better performance
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
    // Close mobile menu first if on mobile
    const isMobile = this.screen.isMobile();
    if (isMobile) {
      this.mobileMenuState = false;
      this.removeStyles();
    }

    // If we're not on the home page, navigate to home first
    const isOnHomePage = this.router.url === '/';

    if (!isOnHomePage) {
      // If clicking on a section from another page, navigate to home then scroll
      if (item.type === 'section' && item.section) {
        this.router.navigate(['/']).then(() => {
          // Wait for navigation, DOM update, and mobile menu to close
          // Longer delay to ensure page is fully loaded and rendered
          const delay = isMobile ? 500 : 300;
          setTimeout(() => {
            this.scrollToSection(item.section!);
          }, delay);
        });
      } else if (item.type === 'url' && item.url === '/') {
        // Clicking on "Strona główna" - navigate to home and scroll to top
        this.router.navigate(['/']).then(() => {
          const delay = isMobile ? 300 : 100;
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Update active menu item after scroll
            setTimeout(() => {
              this.updateActiveMenuItem();
            }, 300);
          }, delay);
        });
      } else if (item.type === 'url' && item.url && item.url !== '/') {
        // Navigate to the URL directly
        this.router.navigate([item.url]);
      }
    } else {
      // We're already on home page
      if (item.type === 'section' && item.section) {
        // Wait for mobile menu to close before scrolling
        const delay = isMobile ? 200 : 0;
        setTimeout(() => {
          this.scrollToSection(item.section!);
        }, delay);
      } else if (item.type === 'url' && item.url === '/') {
        // Clicking on "Strona główna" - scroll to top
        const delay = isMobile ? 200 : 0;
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Update active menu item after scroll
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
    // Get actual header element height dynamically
    const headerElement = document.querySelector('.header');
    if (headerElement) {
      return headerElement.getBoundingClientRect().height;
    }
    // Fallback: use responsive height based on screen size
    return this.screen.isMobile() ? 80 : 100;
  }

  private scrollToSection(sectionId: string) {
    const headerHeight = this.getHeaderHeight();
    // Add extra offset for mobile devices to account for viewport issues
    const mobileOffset = this.screen.isMobile() ? 20 : 0;
    const totalOffset = headerHeight + mobileOffset;
    
    const scrolled = scrollToSectionById(sectionId, {
      offset: totalOffset,
      maxRetries: 5,
      retryDelay: 200,
      threshold: 10
    });

    if (scrolled) {
      // Update active menu item after scroll with multiple checks
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        this.updateActiveMenuItem();
      }, 400);
    }
  }

  private updateActiveMenuItem() {
    // Handle non-home pages
    if (this.router.url !== '/') {
      this.activeMenuItem = null;
      // Reset all menu items active state - only URL items can be active
      this.menuElements.forEach(item => {
        if (item.type === 'url') {
          item.active = this.isMenuItemActive(item);
        } else {
          item.active = false;
        }
      });
      return;
    }

    // We're on home page - check sections
    const sections = this.menuElements.filter(item => item.type === 'section' && item.section);
    const headerHeight = this.getHeaderHeight();
    const viewportOffset = this.screen.isMobile() ? 100 : 150; // Smaller offset for mobile
    const scrollY = window.scrollY || window.pageYOffset;
    const topThreshold = 200; // If scroll is less than this, we're at the top

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
        // More lenient check for mobile devices
        const topThresholdViewport = headerHeight + viewportOffset;
        const bottomThreshold = headerHeight;
        
        if (
          rect.top <= topThresholdViewport &&
          rect.bottom >= bottomThreshold
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
    
    // Update active state in menuElements array to sync with template
    // Only one item should be active at a time
    this.menuElements.forEach(item => {
      if (item.type === 'section' && item.section) {
        // Section is active only if it matches activeSection
        item.active = item.section === activeSection;
      } else if (item.type === 'url') {
        if (item.url === '/') {
          // "Strona główna" is active only if we're at the top AND no section is active
          item.active = scrollY < topThreshold && activeSection === null;
        } else {
          // Other URL items (like "Oferta") use normal URL matching
          item.active = this.isMenuItemActive(item);
        }
      }
    });
  }

  isMenuItemActive(item: MenuElementsModel): boolean {
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
