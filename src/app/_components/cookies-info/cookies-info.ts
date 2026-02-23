import {Component, effect, signal} from '@angular/core';
import {ButtonComponent} from '@components/utilities/button/button';
import {Link} from '@components/utilities/link/link';
import {Modal} from '@components/utilities/modal/modal';
import {Input} from '@components/utilities/input/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputType} from '@models/common.types';
import {GoogleAdsService} from '@services/google-ads';

@Component({
  selector: 'flexmile-cookies-info',
  imports: [
    ButtonComponent,
    Link,
    Modal,
    Input,
    ReactiveFormsModule
  ],
  templateUrl: './cookies-info.html',
  styleUrl: './cookies-info.scss',
})
export class CookiesInfo {
  public showCookiesInfo = signal(true);
  public showMoreInfo = signal(false);
  public marketingCookiesAllowed = signal(false);
  public cookiesAcceptedControl = new FormControl({ value: true, disabled: true });
  public marketingControl = new FormControl<boolean | null>(null);
  public readonly inputType = InputType;

  constructor(private googleAds: GoogleAdsService) {
    const accepted = localStorage.getItem('flxCookiesAccepted');
    const marketing = localStorage.getItem('flxCookiesMarketing');

    if (accepted === 'true') {
      this.showCookiesInfo.set(false);
    }

    this.marketingCookiesAllowed.set(marketing === 'true');
    if (this.marketingCookiesAllowed()) {
      this.googleAds.init();
    }
    this.marketingControl.setValue(this.marketingCookiesAllowed(), {emitEvent: false});

    effect(() => {
      console.log('Cookies info effect:', this.showCookiesInfo());
      if (!this.showCookiesInfo()) {
        localStorage.setItem('flxCookiesAccepted', 'true');
      }
    })

    this.marketingControl.valueChanges.subscribe((val) => {
      this.marketingCookiesAllowed.set(!!val);
      if (this.marketingCookiesAllowed()) {
        this.googleAds.init();
      }
    });
  }

  public acceptCookies(): void {
    this.marketingCookiesAllowed.set(true);
    this.marketingControl.setValue(true, {emitEvent: false});
    localStorage.setItem('flxCookiesMarketing', 'true');
    this.googleAds.init();
    this.showMoreInfo.set(false);
    this.showCookiesInfo.set(false);
  }

  public showMore(val: boolean): void {
    this.showMoreInfo.set(val);
  }

  public toggleMarketingCookies(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.marketingCookiesAllowed.set(!!target?.checked);
  }

  public saveCookiesSettings(): void {
    localStorage.setItem('flxCookiesMarketing', this.marketingCookiesAllowed() ? 'true' : 'false');
    if (this.marketingCookiesAllowed()) {
      this.googleAds.init();
    }
    this.showMoreInfo.set(false);
    this.showCookiesInfo.set(false);
  }
}
