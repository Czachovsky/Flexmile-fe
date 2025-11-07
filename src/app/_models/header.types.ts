interface MenuElementsModel {
  label: string;
  url?: string;
  icon?: string;
  section?: string;
}

export const menuElements: MenuElementsModel[] = [
  {
    label: 'Strona główna',
    url: '/'
  },
  {
    label: 'Oferta',
    url: '/cars'
  },
  {
    label: 'Jak to działa?',
    section: 'how-it-works'
  },
  {
    label: 'Dlaczego Flexmile',
    section: 'why-flexmile'
  },
  {
    label: 'FAQ',
    section: 'faq'
  },
  {
    label: 'Opinie',
    section: 'reviews'
  },
  {
    label: 'Kontakt',
    url: '/contact'
  },
  {
    label: 'Profil',
    url: '/profile',
    icon: 'user'
  }
];
