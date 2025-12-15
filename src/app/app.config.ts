import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {API_URL} from '@tokens/api-url.token';
import {provideHttpClient} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    { provide: API_URL, useValue: 'https://api.flexmile.mr-creations.pl/wp-json/flexmile/v1' },
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    provideHttpClient(),
  ]
};
