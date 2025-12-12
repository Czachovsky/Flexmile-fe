import {Component, inject, OnInit} from '@angular/core';
import {Link} from '@components/utilities/link/link';
import {SeoService} from '@services/seo';

@Component({
  selector: 'flexmile-privacy-policy',
  imports: [
    Link
  ],
  templateUrl: './privacy-policy.html'
})
export class PrivacyPolicy implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPrivacyPolicyMeta();
  }
}
