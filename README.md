# FlexMile

Platforma do wynajmu samochodów dla firm. FlexMile oferuje nowe auta w najmie z niską ratą miesięczną, bez wpłaty wstępnej i bez dodatkowych kosztów za ubezpieczenie, serwis czy opony.

## Opis projektu

FlexMile to nowoczesna aplikacja webowa umożliwiająca firmom przeglądanie i rezerwację samochodów w systemie najmu długoterminowego. Aplikacja oferuje intuicyjny interfejs do przeglądania ofert, wyszukiwania pojazdów według różnych kryteriów oraz składania rezerwacji.

## Funkcjonalności

- **Strona główna** z sekcją hero i wyszukiwarką samochodów
- **Lista ofert** z możliwością filtrowania i sortowania
- **Szczegóły oferty** z galerią zdjęć i formularzem rezerwacji
- **Wyszukiwarka** z zaawansowanymi filtrami (marka, model, cena, moc, itp.)
- **Sekcja FAQ** z odpowiedziami na najczęściej zadawane pytania
- **Opinie klientów** z carousel prezentującym rekomendacje
- **Formularz kontaktowy** do komunikacji z firmą
- **Tryb konserwacji** umożliwiający wyłączenie strony podczas prac technicznych
- **System banerów** dynamicznie ładowanych z API
- **Responsywny design** dostosowany do wszystkich urządzeń

## Technologie

- **Angular 20** - framework aplikacji
- **TypeScript** - język programowania
- **SCSS** - preprocesor CSS
- **PrimeFlex** - biblioteka utility classes
- **RxJS** - programowanie reaktywne
- **Lottie** - animacje JSON
- **ngx-owl-carousel-o** - karuzele i slidery
- **Angular Router** - routing i nawigacja
- **WordPress REST API** - backend API

## Wymagania

- Node.js (wersja zgodna z Angular 20)
- npm lub yarn
- Angular CLI 20.3.7

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone <repository-url>
cd flexmile
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj URL API w pliku `src/app/app.config.ts`:
```typescript
{ provide: API_URL, useValue: 'http://twoj-api-url/wp-json/flexmile/v1' }
```

## Rozwój

### Uruchomienie serwera deweloperskiego

```bash
npm start
```

Aplikacja będzie dostępna pod adresem `http://localhost:4200/`. Aplikacja automatycznie przeładuje się po wprowadzeniu zmian w plikach źródłowych.

### Tryb watch

Aby automatycznie kompilować projekt podczas wprowadzania zmian:

```bash
npm run watch
```

### Generowanie komponentów

Angular CLI oferuje narzędzia do generowania kodu. Aby utworzyć nowy komponent:

```bash
ng generate component component-name
```

Dla pełnej listy dostępnych schematów (komponenty, dyrektywy, pipe'y, serwisy), uruchom:

```bash
ng generate --help
```

## Budowanie

### Build produkcyjny

```bash
npm run build
```

Zbudowane pliki zostaną umieszczone w katalogu `dist/`. Build produkcyjny jest zoptymalizowany pod kątem wydajności i szybkości.

### Konfiguracja budowania

Projekt zawiera dwie konfiguracje budowania:
- **production** - zoptymalizowany build z minifikacją i hashowaniem plików
- **development** - build deweloperski z source maps i bez optymalizacji

## Testy

### Testy jednostkowe

Aby uruchomić testy jednostkowe za pomocą Karma:

```bash
npm test
```

## Struktura projektu

```
flexmile/
├── public/                 # Zasoby statyczne
│   ├── layout/            # Fonty, obrazy, animacje Lottie, style SCSS
│   └── app-config.json    # Konfiguracja aplikacji (tryb konserwacji)
├── src/
│   ├── app/
│   │   ├── _builders/     # Buildery do konstruowania obiektów
│   │   ├── _components/   # Komponenty aplikacji
│   │   │   ├── home-page/ # Strona główna
│   │   │   ├── offers/    # Lista ofert
│   │   │   ├── offer-new/ # Szczegóły oferty
│   │   │   └── utilities/ # Komponenty pomocnicze (header, footer, formularze)
│   │   ├── _guards/       # Strażnicy routingu
│   │   ├── _models/       # Modele TypeScript
│   │   ├── _pipes/        # Pipe'y Angular
│   │   ├── _resolvers/    # Resolvery danych
│   │   ├── _services/     # Serwisy Angular
│   │   ├── _tokens/       # Injection tokens
│   │   ├── app.config.ts  # Konfiguracja aplikacji
│   │   ├── app.routes.ts  # Definicje tras
│   │   └── app.ts         # Główny komponent aplikacji
│   ├── index.html         # Główny plik HTML
│   ├── main.ts            # Punkt wejścia aplikacji
│   └── styles.scss        # Globalne style
├── angular.json           # Konfiguracja Angular CLI
├── package.json           # Zależności projektu
└── tsconfig.json          # Konfiguracja TypeScript
```

## Konfiguracja

### Tryb konserwacji

Aby włączyć tryb konserwacji, ustaw w pliku `public/app-config.json`:

```json
{
  "maintenance": true
}
```

Gdy tryb konserwacji jest aktywny, wszystkie trasy są przekierowywane do strony konserwacji.

### API Endpoint

Domyślny endpoint API jest skonfigurowany w `src/app/app.config.ts`. Aplikacja komunikuje się z WordPress REST API pod adresem:

```
http://flexmile.local/wp-json/flexmile/v1
```

Główne endpointy:
- `/banners` - pobieranie banerów
- `/offers` - lista ofert samochodów
- `/offer/:id` - szczegóły konkretnej oferty

## Formatowanie kodu

Projekt używa Prettier do formatowania kodu. Konfiguracja znajduje się w `package.json`:

- Print width: 100 znaków
- Single quotes: true
- Angular HTML parser dla plików `.html`

## Lokalizacja

Aplikacja jest skonfigurowana dla lokalizacji polskiej (`pl-PL`). Formatowanie dat, liczb i walut jest dostosowane do standardów polskich.

## Wsparcie

W razie pytań lub problemów, skontaktuj się z zespołem deweloperskim lub utwórz issue w repozytorium projektu.

## Licencja

Projekt jest własnością prywatną FlexMile.
