export interface OpinionsModel {
  rate: 1 | 2 | 3 | 4 | 5;
  opinion: string;
  name: string;
  city: string;
}

export const OPINIONS: OpinionsModel[] = [
  {
    rate: 5,
    opinion: "Terminowo, solidnie i bez kombinowania. Widać doświadczenie.",
    name: "Marek K.",
    city: "Wrocław"
  },
  {
    rate: 4,
    opinion: "Dobra jakość, ale komunikacja mogłaby być szybsza. Poza tym bez zastrzeżeń.",
    name: "Agnieszka P.",
    city: "Warszawa"
  },
  {
    rate: 3,
    opinion: "Poprawnie, choć liczyłem na większą dbałość o szczegóły.",
    name: "Łukasz R.",
    city: "Poznań"
  },
  {
    rate: 5,
    opinion: "Profesjonalne podejście od początku do końca. Zero stresu.",
    name: "Karolina M.",
    city: "Gdańsk"
  },
  {
    rate: 2,
    opinion: "Sama usługa wykonana, ale obsługa klienta do poprawy.",
    name: "Paweł S.",
    city: "Katowice"
  },
  {
    rate: 4,
    opinion: "Dobra robota. Małe opóźnienie, ale końcowy efekt na plus.",
    name: "Joanna L.",
    city: "Lublin"
  }
]
