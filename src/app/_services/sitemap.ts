import { inject, Injectable } from '@angular/core';
import { OffersService } from './offers';
import { OfferListModel } from '@models/offers.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private readonly offersService = inject(OffersService);
  private readonly baseUrl = 'https://flexmile.pl';

  /**
   * Generuje XML sitemap dla wszystkich stron
   */
  async generateSitemap(): Promise<string> {
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/oferty', priority: '0.9', changefreq: 'daily' },
      { url: '/polityka-prywatnosci', priority: '0.3', changefreq: 'monthly' },
      { url: '/regulamin', priority: '0.3', changefreq: 'monthly' },
      { url: '/polityka-cookies', priority: '0.3', changefreq: 'monthly' }
    ];

    // Pobierz wszystkie oferty
    let offers: any[] = [];
    try {
      const offersData: OfferListModel = await firstValueFrom(
        this.offersService.getOffers({ per_page: 1000 })
      );
      offers = offersData.offers || [];
    } catch (error) {
      console.error('Error fetching offers for sitemap:', error);
    }

    const urls = [
      ...staticPages.map(page => this.generateUrlEntry(page.url, page.priority, page.changefreq)),
      ...offers.map(offer => this.generateUrlEntry(`/oferta/${offer.id}`, '0.8', 'weekly'))
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.join('\n')}
</urlset>`;
  }

  private generateUrlEntry(path: string, priority: string, changefreq: string): string {
    const url = `${this.baseUrl}${path}`;
    const lastmod = new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${this.escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

