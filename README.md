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
├── index.html              # homepage: kies vak + hoofdstuk
├── README.md
└── vakken/
    └── biologie/
        ├── h5-ecologie.html
        └── h6-mens-en-milieu.html
```

## Een hoofdstuk toevoegen
1. Zet je `.html`-bestand in de juiste vakmap, bijv. `vakken/biologie/h7-...html`.
2. Open `index.html` en zoek bovenin de lijst `VAKKEN`.
3. Voeg bij het juiste vak een regel toe in `hoofdstukken`:
```js
{ code:"H7", titel:"Titel", omschrijving:"Korte beschrijving.", link:"vakken/biologie/h7-...html", status:"klaar" }
```

## Een nieuw vak toevoegen
1. Maak een map `vakken/<vaknaam>/`.
2. Voeg een blok toe aan `VAKKEN` in `index.html`:
```js
{
  naam: "Wiskunde",
  initiaal: "Wi",
  kleur: "#3c6e54",
  omschrijving: "VWO · ...",
  hoofdstukken: [
    { code:"H1", titel:"...", omschrijving:"...", link:"vakken/wiskunde/h1.html", status:"klaar" }
  ]
}
```
`status:"binnenkort"` toont een grijze placeholder in plaats van een link.

## Stijl van een nieuw hoofdstuk
De bestaande biologie-bestanden zijn een goed sjabloon: kopieer er één, vervang de inhoud
en houd dezelfde kleuren en opbouw aan (begrippen vetgedrukt, een zelftoets onderaan).
