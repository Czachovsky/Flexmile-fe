export interface OpinionsModel {
  rate: 1 | 2 | 3 | 4 | 5;
  opinion: string;
  name: string;
  city: string;
}

export const OPINIONS: OpinionsModel[] = [
  {
    rate: 5,
    opinion: "Najbardziej spodobało mi się to, że na stronie Flexmile mogłem sam wybrać auto, ustawić okres najmu i przebieg — a rata wyliczyła się od razu. Zero dzwonienia, czekania na ofertę czy negocjacji. Szybko, jasno i konkretnie..",
    name: "Michał",
    city: "Wrocław"
  },
  {
    rate: 5,
    opinion: "Potrzebowałem nowego samochodu do firmy, ale zależało mi na pełnej kontroli kosztów. Na Flexmile skonfigurowałem ofertę w kilka minut — zmieniłem przebieg i długość umowy, aż rata idealnie dopasowała się do mojego budżetu. Rewelacja!",
    name: "Paweł",
    city: "Warszawa"
  },
  {
    rate: 5,
    opinion: "Najem długoterminowy kojarzył mi się z papierologią i długim oczekiwaniem na wyceny. A tu? Wchodzę na stronę, wybieram samochód, ustawiam parametry i widzę finalną ratę. Wszystko przejrzyste i bez niespodzianek.",
    name: "Katarzyna",
    city: "Poznań"
  },
  {
    rate: 5,
    opinion: "Podoba mi się, że mam wybór. Mogę porównać kilka modeli, zmieniać przebieg i okres najmu, a system od razu przelicza ratę. Dzięki temu wiedziałem dokładnie, na co mnie stać — zanim wysłałem zapytanie.",
    name: "Tomasz",
    city: "Gdańsk"
  },
  {
    rate: 5,
    opinion: "Zanim trafiłam na Flexmile, dostawałam oferty dopiero po kilku dniach od wysłania zapytania. Tutaj wszystko zobaczyłam od ręki. Wybrałam auto, dopasowałam warunki i od razu wiedziałam, ile zapłacę miesięcznie. To ogromna wygoda.",
    name: "Anna",
    city: "Katowice"
  },
  {
    rate: 5,
    opinion: "Cenię sobie niezależność — dlatego spodobało mi się, że ofertę konfiguruję sam. Bez presji, bez rozmów sprzedażowych. A kiedy już wybrałem model i warunki, doradca tylko dopiął formalności. Profesjonalnie i bez stresu.",
    name: "Marek",
    city: "Lublin"
  }
];

