# Interactieve Kaart

Een lichte, single-file interactieve kaart gebouwd met [Leaflet](https://leafletjs.com/) en OpenStreetMap.

## Gebruik

Open `index.html` in een browser. Geen build-stap of server nodig.

Voor lokale ontwikkeling met een simpele server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Functies

- Drie kaartlagen: standaard (OSM), topografisch (OpenTopoMap), satelliet (Esri).
- Vooringevulde markers voor Nederlandse steden met popups.
- Klik op de kaart om eigen markers toe te voegen.
- Zoekveld (geocoding via Nominatim).
- Knop "Mijn locatie" (browser geolocation).
- Live coördinaten onderaan het scherm.
- Knop om zelf toegevoegde markers te wissen.
