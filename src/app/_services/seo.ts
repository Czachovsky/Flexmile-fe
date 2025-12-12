import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { OfferModel } from '@models/offers.types';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly baseUrl = 'https://flexmile.pl';

  /**
   * Ustawia podstawowe meta tagi dla strony głównej
   */
  setHomePageMeta(): void {
    this.setTitle('Flexmile - Wynajem samochodów dla Firm');
    this.setDescription('Flexmile – nowoczesna platforma najmu samochodów dla Firm. Zero wpłaty własnej, szybki proces, atrakcyjne niskie raty. Wybierz auto, a My zajmiemy się resztą! 1,2,3…Jeździsz Ty!');
    this.setCanonicalUrl(this.baseUrl);
    this.setOpenGraph({
      title: 'Flexmile - Wynajem samochodów dla Firm',
      description: 'Flexmile – nowoczesna platforma najmu samochodów dla Firm. Zero wpłaty własnej, szybki proces, atrakcyjne niskie raty. Wybierz auto, a My zajmiemy się resztą! 1,2,3…Jeździsz Ty!',
      image: `${this.baseUrl}/layout/images/og-image.jpg`,
      url: this.baseUrl
    });
  }

  /**
   * Ustawia meta tagi dla strony z listą ofert
   */
  setOffersPageMeta(): void {
    this.setTitle('Flexmile - Oferty wynajmu samochodów');
    this.setDescription('Przeglądaj szeroką ofertę samochodów do wynajmu dla firm. Nowe auta, elastyczne warunki finansowania, zero ukrytych kosztów. Znajdź idealny samochód dla swojej firmy.');
    this.setCanonicalUrl(`${this.baseUrl}/oferty`);
    this.setOpenGraph({
      title: 'Flexmile - Oferty wynajmu samochodów',
      description: 'Przeglądaj szeroką ofertę samochodów do wynajmu dla firm. Nowe auta, elastyczne warunki finansowania, zero ukrytych kosztów.',
      image: `${this.baseUrl}/layout/images/og-image.jpg`,
      url: `${this.baseUrl}/oferty`
    });
  }

  /**
   * Ustawia meta tagi dla strony szczegółów oferty
   */
  setOfferPageMeta(offer: OfferModel): void {
    const offerTitle = `${offer.brand.name} ${offer.model} - Wynajem od ${offer.pricing.lowest_price} PLN/netto mies.`;
    const offerDescription = `Wynajmij ${offer.brand.name} ${offer.model} ${offer.specs.year} od ${offer.pricing.lowest_price} PLN/netto miesięcznie. ${offer.specs.engine}, ${offer.specs.horsepower}KM, ${offer.specs.transmission === 'automatic' ? 'automatyczna' : 'manualna'} skrzynia biegów. Zero wpłaty własnej, pełne ubezpieczenie w cenie.`;
    const offerImage = offer.gallery && offer.gallery.length > 0
      ? offer.gallery[0].large
      : `${this.baseUrl}/layout/images/og-image.jpg`;
    const offerUrl = `${this.baseUrl}/oferta/${offer.id}`;

    this.setTitle(offerTitle);
    this.setDescription(offerDescription);
    this.setCanonicalUrl(offerUrl);
    this.setOpenGraph({
      title: offerTitle,
      description: offerDescription,
      image: offerImage,
      url: offerUrl
    });
    this.setStructuredData(offer);
  }

  /**
   * Ustawia tytuł strony
   */
  private setTitle(title: string): void {
    this.title.setTitle(title);
  }

  /**
   * Ustawia meta description
   */
  private setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Ustawia canonical URL
   */
  private setCanonicalUrl(url: string): void {
    // Usuń istniejący canonical link jeśli istnieje
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Dodaj nowy canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  /**
   * Ustawia Open Graph tags
   */
  private setOpenGraph(data: {
    title: string;
    description: string;
    image: string;
    url: string;
  }): void {
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:image', content: data.image });
    this.meta.updateTag({ property: 'og:url', content: data.url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'pl_PL' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: data.image });
  }

  /**
   * Ustawia structured data (JSON-LD) dla produktu
   */
  private setStructuredData(offer: OfferModel): void {
    // Usuń istniejący structured data jeśli istnieje
    const existingScript = document.querySelector('script[type="application/ld+json"][data-seo="offer"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${offer.brand.name} ${offer.model}`,
      description: `Wynajem ${offer.brand.name} ${offer.model} ${offer.specs.year} - ${offer.specs.engine}, ${offer.specs.horsepower}KM`,
      brand: {
        '@type': 'Brand',
        name: offer.brand.name
      },
      category: 'Vehicle Rental',
      offers: {
        '@type': 'Offer',
        price: offer.pricing.lowest_price,
        priceCurrency: 'PLN',
        availability: offer.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${this.baseUrl}/oferta/${offer.id}`,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: offer.pricing.lowest_price,
          priceCurrency: 'PLN',
          unitText: 'MONTH'
        }
      },
      image: offer.gallery && offer.gallery.length > 0
        ? offer.gallery.map(img => img.large)
        : [`${this.baseUrl}/layout/images/og-image.jpg`],
      vehicleIdentificationNumber: offer.car_reference_id,
      vehicleConfiguration: `${offer.specs.engine}, ${offer.specs.horsepower}KM`,
      vehicleTransmission: offer.specs.transmission === 'automatic'
        ? 'https://schema.org/AutomaticTransmission'
        : 'https://schema.org/ManualTransmission',
      fuelType: this.mapFuelType(offer.fuel_type),
      numberOfDoors: offer.specs.doors,
      seatingCapacity: offer.specs.seats,
      productionDate: `${offer.specs.year}-01-01`
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'offer');
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Mapuje typ paliwa na format schema.org
   */
  private mapFuelType(fuelType: string): string {
    const fuelMap: { [key: string]: string } = {
      'petrol': 'https://schema.org/Gasoline',
      'diesel': 'https://schema.org/DieselFuel',
      'electric': 'https://schema.org/Electric',
      'hybrid': 'https://schema.org/Hybrid',
      'plug_in_hybrid': 'https://schema.org/Hybrid'
    };
    return fuelMap[fuelType] || 'https://schema.org/Gasoline';
  }

  /**
   * Ustawia meta tagi dla strony polityki prywatności
   */
  setPrivacyPolicyMeta(): void {
    this.setTitle('Flexmile - Polityka prywatności');
    this.setDescription('Polityka prywatności Flexmile - dowiedz się jak chronimy Twoje dane osobowe.');
    this.setCanonicalUrl(`${this.baseUrl}/polityka-prywatnosci`);
  }

  /**
   * Ustawia meta tagi dla strony regulaminu
   */
  setTermsConditionsMeta(): void {
    this.setTitle('Flexmile - Regulamin');
    this.setDescription('Regulamin korzystania z platformy Flexmile - wynajem samochodów dla firm.');
    this.setCanonicalUrl(`${this.baseUrl}/regulamin`);
  }

  /**
   * Ustawia meta tagi dla strony polityki cookies
   */
  setCookiesPolicyMeta(): void {
    this.setTitle('Flexmile - Polityka cookies');
    this.setDescription('Polityka cookies Flexmile - informacje o wykorzystaniu plików cookies na naszej stronie.');
    this.setCanonicalUrl(`${this.baseUrl}/polityka-cookies`);
  }
}

