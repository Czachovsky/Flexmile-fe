export interface FaqTypes {
  header: string;
  body: string;
  isExpanded: boolean;
  icon?: string;
  contentHeight: number;
}


export const FaqObject: FaqTypes[] = [
  {
    header: 'Jak długo trwa cały proces?',
    body: 'Kontaktujemy się z Tobą i przedstawiamy finalną ofertę dopasowaną do Twoich potrzeb.',
    isExpanded: true,
    contentHeight: 0
  },
  {
    header: 'Co jest potrzebne, żeby wynająć samochód?',
    body: 'Kontaktujemy się z Tobą i przedstawiamy finalną ofertę dopasowaną do Twoich potrzeb.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Czy mogę wykupić samochód po zakończeniu umowy?',
    body: 'Kontaktujemy się z Tobą i przedstawiamy finalną ofertę dopasowaną do Twoich potrzeb.',
    isExpanded: false,
    contentHeight: 0
  }
]
