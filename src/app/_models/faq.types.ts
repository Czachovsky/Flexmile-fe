export interface FaqTypes {
  header: string;
  body: string;
  isExpanded: boolean;
  icon?: string;
  contentHeight: number;
}


export const FaqObject: FaqTypes[] = [
  {
    header: 'Czym jest Flexmile?',
    body: 'Flexmile to platforma najmu pojazdów dla firm. Umożliwiamy korzystanie z samochodów w przewidywalnej, miesięcznej racie – bez angażowania kapitału i bez ryzyka związanego z posiadaniem auta.',
    isExpanded: true,
    contentHeight: 0
  },
  {
    header: 'Kto może skorzystać z Flexmile?',
    body: 'Flexmile obsługuje jednoosobowe działalności gospodarcze, spółki prawa handlowego oraz firmy budujące lub rozwijające floty pojazdów. Nie obsługujemy klientów indywidualnych.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Czym jest najem pojazdu?',
    body: 'Najem polega na korzystaniu z samochodu w ramach stałej miesięcznej raty, bez wykupu auta na koniec umowy. Po zakończeniu umowy pojazd jest zwracany i może zostać wymieniony na nowy.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Czy Flexmile oferuje leasing?',
    body: 'Nie. Flexmile oferuje wyłącznie najem pojazdów, bez wykupu i bez zobowiązań charakterystycznych dla leasingu.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Czy wymagany jest wkład własny?',
    body: 'W większości przypadków nie jest wymagany wkład własny. Najem często dostępny jest bez wpłaty początkowej lub z minimalnym kosztem startowym, w zależności od parametrów pojazdu i umowy.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Jak długo trwa proces zawarcia umowy?',
    body: 'Proces jest szybki i przejrzysty. Od zapytania do uruchomienia umowy często mija kilka dni roboczych. Przejmujemy formalności i prowadzimy klienta przez cały proces.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Jakie pojazdy są dostępne w ofercie?',
    body: 'Oferujemy samochody nowe, pojazdy dostępne od ręki oraz auta dopasowane do specyfiki działalności, w tym pojazdy handlowe, menedżerskie i flotowe.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Co zawiera miesięczna rata?',
    body: 'Rata zawiera: finansowanie pojazdu, serwis, assistance, ubezpieczenie, opony.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Czy formalności można załatwić zdalnie?',
    body: 'Tak. Cały proces, od oferty po podpisanie umowy, może odbyć się w pełni zdalnie.',
    isExpanded: false,
    contentHeight: 0
  },
  {
    header: 'Jak rozpocząć współpracę z Flexmile?',
    body: 'Wystarczy wybrać pojazd na stronie i złożyć zamówienie. Następnie nasz zespół kontaktuje się w celu dopełnienia formalności, aż do podpisania umowy – wszystko zdalnie.',
    isExpanded: false,
    contentHeight: 0
  }
];

