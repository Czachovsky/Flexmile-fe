export interface MenuElementsModel {
  label: string;
  url?: string;
  icon?: string;
  section?: string;
  type: 'url' | 'section';
  active: boolean;
}

export const menuElements: MenuElementsModel[] = [
  { label: 'Strona główna', url: '/', type: 'url', active: true },
  { label: 'Oferta', url: '/oferty', type: 'url', active: false },
  { label: 'Jak to działa?', section: 'how-it-works', type: 'section', active: false },
  { label: 'Dlaczego Flexmile', section: 'why-us', type: 'section', active: false },
  { label: 'FAQ', section: 'faq', type: 'section', active: false },
  { label: 'Opinie', section: 'opinions', type: 'section', active: false },
  { label: 'Kontakt', section: 'footer', type: 'section', active: false },
];
