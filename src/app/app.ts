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

interface AppConfig {
  maintenance?: boolean;
  version?: string;
  build?: string;
}

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
    this.http.get<AppConfig>('/app-config.json').subscribe({
      next: config => {
        this.logAppBanner(config);
        if (config?.maintenance) {
          this.activateMaintenanceMode();
        } else {
          this.isConfigLoaded.set(true);
          this.updateFooterVisibility();
        }
      },
      error: () => {
        this.logAppBanner();
        this.isConfigLoaded.set(true);
        this.updateFooterVisibility();
      }
    });
  }

  private logAppBanner(config?: AppConfig): void {
    const APP_NAME = 'Flexmile';
    const VERSION = config?.version ?? '1.0.0';
    const BUILD = config?.build ?? 'local';
    const ENV = window?.location?.hostname ?? 'unknown';
    const TIME = new Date().toISOString();
    const MAINTENANCE = config?.maintenance;
    const accentStyle = 'color:#863087;font-weight:700;font-size:13px;';
    const baseStyle = 'color:#e5e7eb;font-size:12px;';
    const labelStyle = 'color:#9ca3af;font-weight:600;font-size:11px;';
    const valueStyle = 'color:#e5e7eb;font-weight:500;font-size:11px;';

    console.log('%cFLEXMILE%c app started', accentStyle, baseStyle);
    console.log('%cName                 %c%s', labelStyle, valueStyle, APP_NAME);
    console.log('%cVersion              %c%s', labelStyle, valueStyle, VERSION);
    console.log('%cBuild                %c%s', labelStyle, valueStyle, BUILD);
    console.log('%cEnv                  %c%s', labelStyle, valueStyle, ENV);
    console.log('%cTime                 %c%s', labelStyle, valueStyle, TIME);
    console.log('%cMaintenance mode     %c%s', labelStyle, valueStyle, MAINTENANCE);
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
