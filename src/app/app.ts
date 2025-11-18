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
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly banners: BannersService = inject(BannersService);
  private http: HttpClient = inject(HttpClient);
  private apiUrl = inject(API_URL);

  constructor() {
    const subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.updateFooterVisibility());

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
    this.updateFooterVisibility();
    this.http.get<BannerTypes[]>(this.apiUrl + '/banners').subscribe({
      next: data => {
        this.banners.setBanners(data);
      },
    })
  }

  private updateFooterVisibility(): void {
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
}
