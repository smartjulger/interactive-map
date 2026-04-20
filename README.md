# Interactieve Kaart

Een lichte interactieve kaart gebouwd met [Leaflet](https://leafletjs.com/) en OpenStreetMap.

## Bestanden

- `index.html` — structuur van de pagina
- `styles.css` — alle styling
- `app.js` — alle logica (kaart, markers, zoeken, locatie)

## Project draaiend krijgen

Je hebt **geen** Node, npm of build-stap nodig. De enige vereisten:

- Een moderne browser (Chrome, Firefox, Safari, Edge).
- Een internetverbinding (Leaflet, de kaarttiles en de zoekfunctie
  worden vanaf een CDN geladen).

### Optie 1 — Repo ophalen

```bash
git clone https://github.com/smartjulger/interactive-map.git
cd interactive-map
```

Of download de ZIP via GitHub en pak hem uit.

### Optie 2 — Bestanden zelf aanmaken

Als je geen git gebruikt, maak dan een map aan met deze drie bestanden
naast elkaar:

```
interactive-map/
├── index.html
├── styles.css
└── app.js
```

Kopieer de inhoud van elk bestand uit deze repo. De bestanden moeten in
dezelfde map staan, want `index.html` verwijst met relatieve paden naar
`styles.css` en `app.js`.

### Openen in de browser

Er zijn twee manieren:

**1. Direct openen (snelst).** Dubbelklik op `index.html` of sleep het
bestand in een browser-tab. Dit werkt voor alle functies behalve
mogelijk de zoekfunctie en geolocation, want sommige browsers blokkeren
`fetch` en `navigator.geolocation` op het `file://`-protocol.

**2. Via een lokale server (aanbevolen).** Start in de projectmap een
van onderstaande servers en open daarna <http://localhost:8000> in je
browser:

```bash
# Python 3 (bijna overal voorgeïnstalleerd)
python3 -m http.server 8000

# Node.js (als je die toch hebt)
npx serve .

# PHP
php -S localhost:8000
```

Stop de server met `Ctrl+C`.

### Verifiëren dat het werkt

Je ziet een donkere header met knoppen en daaronder een kaart van
Nederland met zeven markers (Amsterdam, Rotterdam, Den Haag, Utrecht,
Eindhoven, Groningen, Maastricht). Klik op een marker om de popup te
zien. Onderaan het scherm volgt een badge met de coördinaten je
muiscursor.

### Veelvoorkomende problemen

- **Lege pagina / geen kaart.** Open de developer tools (F12) en
  controleer of `styles.css` en `app.js` geladen zijn. Ze moeten naast
  `index.html` staan.
- **Zoeken werkt niet / geen markers bij klik.** Je hebt het bestand
  waarschijnlijk via `file://` geopend. Gebruik een lokale server
  (zie hierboven).
- **Geen tiles zichtbaar.** Controleer je internetverbinding; de tiles
  komen van `tile.openstreetmap.org`, `tile.opentopomap.org` en
  `server.arcgisonline.com`.
- **"Mijn locatie" werkt niet.** Browsers staan geolocation alleen toe
  op `https://` of `http://localhost`. Via een lokale server op
  `localhost` werkt het dus wel.

## Functies

- Drie kaartlagen: standaard (OSM), topografisch (OpenTopoMap), satelliet (Esri).
- Vooringevulde markers voor Nederlandse steden met popups.
- **Knop "Voeg punt toe"** om eigen markers te plaatsen (zie hieronder).
- Zoekveld (geocoding via Nominatim).
- Knop "Mijn locatie" (browser geolocation).
- Live coördinaten onderaan het scherm.
- Knop om zelf toegevoegde markers te wissen.

## Punten toevoegen met de knop

De kaart heeft een **"Voeg punt toe"**-knop in de header.

1. Klik op de knop. De knop wordt groen en de cursor verandert in een kruisje.
2. Klik ergens op de kaart. Er verschijnt een prompt voor een naam, daarna
   optioneel een beschrijving.
3. Een marker wordt geplaatst met een popup (naam, beschrijving, coördinaten).
4. Klik opnieuw op de knop (die nu "Stop toevoegen" heet) om de modus uit te zetten.

### Hoe het werkt in de code

De knop staat in `index.html`:

```html
<button id="add-point" aria-pressed="false">Voeg punt toe</button>
```

De logica in `app.js` gebruikt een vlag `addingPoint` en een helper:

```js
let addingPoint = false;
const addBtn = document.getElementById('add-point');

function setAddingPoint(on) {
  addingPoint = on;
  addBtn.setAttribute('aria-pressed', String(on));
  addBtn.textContent = on ? 'Stop toevoegen' : 'Voeg punt toe';
  document.body.classList.toggle('adding-point', on);
}

addBtn.addEventListener('click', () => setAddingPoint(!addingPoint));

map.on('click', e => {
  if (!addingPoint) return;
  const name = prompt('Naam van dit punt?');
  if (name === null) return;
  L.marker(e.latlng).bindPopup(name).addTo(userMarkers).openPopup();
});
```

De bijbehorende styling in `styles.css` zorgt voor de cursor en de "aan"-kleur:

```css
header button[aria-pressed="true"] { background: #16a34a; border-color: #16a34a; }
body.adding-point #map { cursor: crosshair; }
```

Wil je het uitbreiden? Een paar ideeën:

- Sla de markers op in `localStorage` zodat ze bewaard blijven.
- Voeg een categorie-dropdown toe en gebruik verschillende marker-iconen.
- Exporteer alle eigen punten als GeoJSON.
