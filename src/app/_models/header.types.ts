export interface MenuElementsModel {
  label: string;
  url?: string;
  icon?: string;
  section?: string;
  type: 'url' | 'section';
}

export const menuElements: MenuElementsModel[] = [
  { label: 'Strona główna', url: '/', type: 'url' },
  { label: 'Oferta', url: '/oferty', type: 'url' },
  { label: 'Jak to działa?', section: 'how-it-works', type: 'section' },
  { label: 'Dlaczego Flexmile', section: 'why-us', type: 'section' },
  { label: 'FAQ', section: 'faq', type: 'section' },
  { label: 'Opinie', section: 'opinions', type: 'section' },
  { label: 'Kontakt', url: 'footer', type: 'section' },
];
