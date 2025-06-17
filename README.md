# System organizacji treningów fitness

Aplikacja webowa do planowania i monitorowania treningów fitness, umożliwiająca personalizację programów ćwiczeniowych. Projekt realizuje wzorzec architektoniczny MVC (Model-View-Controller) z wykorzystaniem Server-Side Rendering (SSR) oraz bazą danych MongoDB.

## Opis projektu

System organizacji treningów fitness to aplikacja internetowa stworzona w Node.js, która pozwala użytkownikom na kompleksowe zarządzanie swoimi treningami. Aplikacja została zaprojektowana z myślą o osobach aktywnych fizycznie, które chcą systematycznie planować i monitorować swoje postępy w ćwiczeniach.

Głównym celem aplikacji jest umożliwienie użytkownikom:
- Tworzenia spersonalizowanych planów treningowych
- Śledzenia postępów w czasie
- Analizowania statystyk treningowych
- Zarządzania różnymi typami aktywności fizycznej

## Funkcjonalności

### Podstawowe funkcjonalności (CRUD):
- **Dodawanie treningów** - Tworzenie nowych treningów z określeniem typu, intensywności, czasu trwania i daty
- **Przeglądanie treningów** - Lista wszystkich treningów z możliwością sortowania i filtrowania
- **Edytowanie treningów** - Modyfikacja istniejących treningów
- **Usuwanie treningów** - Usuwanie niepotrzebnych rekordów treningowych

### Funkcjonalności monitorowania:
- **Dashboard z statystykami** - Przegląd kluczowych metryk (liczba treningów, łączny czas, średnia intensywność)
- **Statystyki okresowe** - Podsumowania treningów w danym miesiącu i tygodniu
- **Wizualizacja intensywności** - Graficzne przedstawienie poziomu intensywności treningów
- **Historia aktywności** - Chronologiczny przegląd wszystkich treningów

### Dodatkowe funkcjonalności:
- **Responsywny interfejs** - Aplikacja dostosowuje się do różnych rozmiarów ekranów
- **Walidacja danych** - Sprawdzanie poprawności wprowadzanych informacji
- **Powiadomienia** - System komunikatów o sukcesie/błędzie operacji
- **Intuicyjna nawigacja** - Przejrzyste menu i łatwa nawigacja między sekcjami

## Instrukcja uruchomienia

### Wymagania systemowe:
- Node.js w wersji 16.0 lub nowszej
- npm (Node Package Manager)
- Połączenie internetowe (do MongoDB Atlas)
- Przeglądarka internetowa (Chrome, Firefox, Safari, Edge)

### Kroki instalacji:

1. **Sklonuj repozytorium:**
   ```bash
   git clone <url repozytorium>
   cd fitness-training-system
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom aplikację:**
   
   **Tryb produkcyjny:**
   ```bash
   npm start
   ```
   
   **Tryb deweloperski (z automatycznym restartowaniem):**
   ```bash
   npm run dev
   ```

4. **Otwórz aplikację w przeglądarce:**
   ```
   http://localhost:4000
   ```

### Konfiguracja:
- Aplikacja domyślnie uruchamia się na porcie 4000
- Dane są przechowywane w MongoDB Atlas
- Połączenie z bazą danych jest konfigurowane w pliku app.js

## Wykorzystane biblioteki zewnętrzne

### Zależności produkcyjne:
- **express** (^4.18.2) - Framework webowy dla Node.js
- **ejs** (^3.1.9) - Template engine do renderowania widoków HTML
- **body-parser** (^1.20.2) - Middleware do parsowania danych z formularzy
- **method-override** (^3.0.0) - Middleware umożliwiający obsługę metod HTTP PUT/DELETE
- **mongoose** - ODM dla MongoDB, umożliwiający interakcję z bazą danych

### Zależności deweloperskie:
- **nodemon** (^3.0.1) - Narzędzie do automatycznego restartowania serwera podczas rozwoju

### Biblioteki frontend:
- **Bootstrap 5.3.0** - Framework CSS do responsywnego designu
- **Bootstrap Icons** - Zestaw ikon do interfejsu użytkownika

## Struktura aplikacji

### Architektura MVC:

#### Modele (`models/`):
- **Training.js** - Model mongoose reprezentujący trening z metodami:
  - `getAll()` - pobieranie wszystkich treningów
  - `getById(id)` - pobieranie treningu po ID
  - `create(data)` - tworzenie nowego treningu
  - `update(id, data)` - aktualizacja treningu
  - `delete(id)` - usuwanie treningu
  - `getStats()` - generowanie statystyk

#### Kontrolery (`controllers/`):
- **trainingController.js** - Kontroler obsługujący logikę biznesową treningów:
  - `index` - wyświetlanie dashboard z listą treningów
  - `show` - wyświetlanie szczegółów treningu
  - `new` - wyświetlanie formularza dodawania
  - `create` - przetwarzanie dodawania treningu
  - `edit` - wyświetlanie formularza edycji
  - `update` - przetwarzanie aktualizacji treningu
  - `destroy` - usuwanie treningu

#### Widoki (`views/`):
- **partials/** - Komponenty wielokrotnego użytku:
  - `header.ejs` - nagłówek strony z nawigacją
  - `footer.ejs` - stopka strony
- **trainings/** - Widoki związane z treningami:
  - `index.ejs` - dashboard z listą treningów i statystykami
  - `show.ejs` - szczegóły pojedynczego treningu
  - `new.ejs` - formularz dodawania nowego treningu
  - `edit.ejs` - formularz edycji treningu
- **error.ejs** - strona błędu (404, 500)

#### Trasy (`routes/`):
- **trainings.js** - Definicje tras RESTful:
  - `GET /trainings` - lista treningów
  - `GET /trainings/new` - formularz dodawania
  - `POST /trainings` - tworzenie treningu
  - `GET /trainings/:id` - szczegóły treningu
  - `GET /trainings/:id/edit` - formularz edycji
  - `PUT /trainings/:id` - aktualizacja treningu
  - `DELETE /trainings/:id` - usuwanie treningu

#### Pliki statyczne (`public/`):
- **css/style.css** - niestandardowe style CSS
- **js/app.js** - skrypty JavaScript po stronie klienta

## Schemat danych w MongoDB

### Kolekcja Treningów:
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}
```

### Pola treningu:
- **name** (string) - nazwa treningu (wymagane)
- **type** (string) - typ treningu: Cardio, Siła, Joga, Pilates, Crossfit, Bieganie, Pływanie, Inne (wymagane)
- **intensity** (number) - intensywność w skali 1-10 (wymagane)
- **duration** (number) - czas trwania w minutach (wymagane)
- **date** (string) - data treningu (wymagane)
- **description** (string) - opcjonalny opis treningu
- **createdAt** (date) - data utworzenia rekordu
- **updatedAt** (date) - data ostatniej aktualizacji rekordu

## Autor

Projekt wykonany przez Daniel Domżalski 51264 w ramach zaliczenia przedmiotu MVC na studiach.

## Licencja

ISC 