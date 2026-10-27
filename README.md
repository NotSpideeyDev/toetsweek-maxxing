# Studiehulp

Interactieve samenvattingen met begrippen en zelftoetsen, om mee te leren en te delen.
Alles is gewone HTML — geen installatie nodig. Open `index.html` of zet de repo online met **GitHub Pages**.

## Online zetten (GitHub Pages)
1. Push deze map naar je repository.
2. Ga naar **Settings → Pages**.
3. Kies bij *Source* de branch (meestal `main`) en map `/ (root)`.
4. Na een minuutje staat je site op `https://<gebruikersnaam>.github.io/<repo>/`.

## Structuur
```
.
├── index.html              # homepage: kies jaar, vak + hoofdstuk
├── README.md
└── vakken/
    ├── jaar-4/
    │   ├── aardrijkskunde/
    │   ├── biologie/
    │   ├── maatschappijleer/
    │   └── scheikunde/
    └── jaar-5/
        └── toetsweek-1/
            └── <vaknaam>/
```
De homepage opent standaard het nieuwste jaar; met `index.html#jaar-4` kom je direct bij jaar 4.

## Een hoofdstuk toevoegen
1. Zet je `.html`-bestand in de juiste map, bijv. `vakken/jaar-5/toetsweek-1/biologie/h1-...html`.
2. Open `index.html` en zoek bovenin de lijst `JAREN`.
3. Zoek het juiste jaar → toetsweek → vak en voeg een regel toe in `hoofdstukken`:
```js
{ code:"H1", titel:"Titel", omschrijving:"Korte beschrijving.", link:"vakken/jaar-5/toetsweek-1/biologie/h1-...html", status:"klaar" }
```

## Een nieuw vak toevoegen
1. Maak een map, bijv. `vakken/jaar-5/toetsweek-1/wiskunde/`.
2. Voeg een blok toe aan `vakken` van de juiste toetsweek in `index.html`:
```js
{
  naam: "Wiskunde",
  initiaal: "Wi",
  kleur: "#3c6e54",
  omschrijving: "VWO · ...",
  hoofdstukken: [
    { code:"H1", titel:"...", omschrijving:"...", link:"vakken/jaar-5/toetsweek-1/wiskunde/h1.html", status:"klaar" }
  ]
}
```

## Een nieuwe toetsweek toevoegen
Voeg bij het juiste jaar in `JAREN` een blok toe aan `toetsweken`:
```js
{ naam: "Toetsweek 2", vakken: [ /* vakken zoals hierboven */ ] }
```
en maak de map `vakken/jaar-5/toetsweek-2/`.
`status:"binnenkort"` toont een grijze placeholder in plaats van een link.

## Stijl van een nieuw hoofdstuk
De bestaande biologie-bestanden zijn een goed sjabloon: kopieer er één, vervang de inhoud
en houd dezelfde kleuren en opbouw aan (begrippen vetgedrukt, een zelftoets onderaan).
