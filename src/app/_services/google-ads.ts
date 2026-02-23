import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAdsService {
  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js?id=AW-17883080050"]')) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17883080050';
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17883080050');
    `;
    document.head.appendChild(inlineScript);
  }
}

