# Interactieve Kaart

Een lichte interactieve kaart gebouwd met [Leaflet](https://leafletjs.com/) en OpenStreetMap.

## Bestanden

- `index.html` — structuur van de pagina
- `styles.css` — alle styling
- `app.js` — alle logica (kaart, markers, zoeken, locatie)

## Gebruik

Open `index.html` in een browser. Geen build-stap nodig. Voor lokale
ontwikkeling kun je een simpele server gebruiken:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

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
