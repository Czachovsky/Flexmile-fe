export interface OpinionsModel {
  rate: 1 | 2 | 3 | 4 | 5;
  opinion: string;
  name: string;
  city: string;
}

export const OPINIONS: OpinionsModel[] = [
  {
    rate: 5,
    opinion: "Polecam serdecznie. Leasing praktycznie bezobsługowy. Wszystko poszło sprawnie. Pan Łukasz ultra profesjonalista.",
    name: "Emil P.",
    city: "Wrocław"
  },
  {
    rate: 5,
    opinion: "Polecamy serdecznie! Pełen profesjonalizm, doskonała obsługa. Samochody sprawdzone i z pewnego źródła.",
    name: "Bogusław Z.",
    city: "Warszawa"
  },
  {
    rate: 5,
    opinion: "Polecam bardzo Next-car 🥰 trzecie autko i jak zawsze najlepszy zakup 😍\n",
    name: "Karolina R.",
    city: "Poznań"
  },
  {
    rate: 5,
    opinion: "Polecam wszystkim... Można śmiało robić zakup w ciemno. Szybko, fachowo i sprawnie. Świetny kontakt i serwis przy zakupie...",
    name: "Michał M.",
    city: "Gdańsk"
  },
  {
    rate: 5,
    opinion: "Świetna obsługa,zakup samochodu realizowany przez NEXT CAR od A do Z. Pełne zaangażowanie przez Pana Łukasza. Polecam serdecznie",
    name: "Paweł S.",
    city: "Katowice"
  },
  {
    rate: 5,
    opinion: "Świetna współpraca, polecam serdecznie Pana Łukasza.",
    name: "Joanna L.",
    city: "Lublin"
  }
];

