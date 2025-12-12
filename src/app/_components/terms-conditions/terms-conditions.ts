import { Component, inject, OnInit } from '@angular/core';
import {Link} from '@components/utilities/link/link';
import {SeoService} from '@services/seo';

@Component({
  selector: 'flexmile-terms-conditions',
  imports: [
    Link
  ],
  templateUrl: './terms-conditions.html'
})
export class TermsConditions implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setTermsConditionsMeta();
  }
}
