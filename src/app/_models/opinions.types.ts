export interface OpinionsModel {
  rate: 1 | 2 | 3 | 4 | 5;
  opinion: string;
  name: string;
  city: string;
}

export const OPINIONS: OpinionsModel[] = [
  {
    rate: 5,
    opinion: "Terminowo, solidnie i bez kombinowania. Widać duże doświadczenie.",
    name: "Marek K.",
    city: "Wrocław"
  },
  {
    rate: 5,
    opinion: "Świetna jakość i bardzo dobra komunikacja. Wszystko przebiegło sprawnie.",
    name: "Agnieszka P.",
    city: "Warszawa"
  },
  {
    rate: 5,
    opinion: "Bardzo rzetelne wykonanie. Całość dopracowana i przemyślana.",
    name: "Łukasz R.",
    city: "Poznań"
  },
  {
    rate: 5,
    opinion: "Profesjonalne podejście od początku do końca. Współpraca bezproblemowa.",
    name: "Karolina M.",
    city: "Gdańsk"
  },
  {
    rate: 5,
    opinion: "Usługa wykonana na wysokim poziomie, pełna satysfakcja.",
    name: "Paweł S.",
    city: "Katowice"
  },
  {
    rate: 5,
    opinion: "Bardzo dobra robota. Wszystko zgodnie z ustaleniami i w świetnej jakości.",
    name: "Joanna L.",
    city: "Lublin"
  }
];

