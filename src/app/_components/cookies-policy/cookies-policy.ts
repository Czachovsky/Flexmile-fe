import {Component, inject, OnInit} from '@angular/core';
import {Link} from '@components/utilities/link/link';
import {SeoService} from '@services/seo';

@Component({
  selector: 'flexmile-cookies-policy',
  imports: [
    Link
  ],
  templateUrl: './cookies-policy.html',
})
export class CookiesPolicy implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setCookiesPolicyMeta();
  }
}
