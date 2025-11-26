import {Component, DestroyRef, inject, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Header} from '@components/utilities/header/header';
import {Footer} from '@components/utilities/footer/footer';
import {Screen} from '@services/screen';
import {filter} from 'rxjs';
import {PageNotFound} from '@components/page-not-found/page-not-found';
import {BannersService} from '@services/banners';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '@tokens/api-url.token';
import {BannerTypes} from '@models/banners.types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public readonly screen: Screen = inject(Screen);
  public readonly showFooter = signal(true);
  public readonly isMaintenance = signal(false);
  public readonly isConfigLoaded = signal(false);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly banners: BannersService = inject(BannersService);
  private http: HttpClient = inject(HttpClient);
  private apiUrl = inject(API_URL);

  constructor() {
    this.loadAppConfig();

    const subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateFooterVisibility();
        this.scrollToTop();
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
    this.updateFooterVisibility();
    this.http.get<BannerTypes[]>(this.apiUrl + '/banners').subscribe({
      next: data => {
        this.banners.setBanners(data);
      },
    })
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  private updateFooterVisibility(): void {
    // Dopóki konfiguracja się nie załaduje, nie pokazujemy stopki
    if (!this.isConfigLoaded()) {
      this.showFooter.set(false);
      return;
    }

    if (this.isMaintenance()) {
      this.showFooter.set(false);
      return;
    }

    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const routeConfig = route.routeConfig;
    const component = routeConfig?.component;
    const path = routeConfig?.path;
    const isNotFoundRoute = component === PageNotFound || path === '404' || path === '**';
    this.showFooter.set(!isNotFoundRoute);
  }

  private loadAppConfig(): void {
    this.http.get<{ maintenance?: boolean }>('/app-config.json').subscribe({
      next: config => {
        if (config?.maintenance) {
          this.activateMaintenanceMode();
        } else {
          this.isConfigLoaded.set(true);
          this.updateFooterVisibility();
        }
      },
      error: () => {
        this.isConfigLoaded.set(true);
        this.updateFooterVisibility();
      }
    });
  }

  private activateMaintenanceMode(): void {
    this.isMaintenance.set(true);
    this.isConfigLoaded.set(true);
    this.showFooter.set(false);

    this.router.resetConfig([
      {
        path: 'maintenance',
        loadComponent: () =>
          import('@components/maintenance/maintenance').then(m => m.Maintenance),
        title: 'Flexmile - Strona w budowie',
      },
      { path: '**', redirectTo: 'maintenance' },
    ]);

    this.router.navigateByUrl('/maintenance', { replaceUrl: true });
  }
}
