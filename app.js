const map = L.map('map', { zoomControl: true }).setView([52.3676, 4.9041], 6);

const layers = {
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; OpenStreetMap, SRTM | Style: &copy; OpenTopoMap (CC-BY-SA)',
    maxZoom: 17,
  }),
  satellite: L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
  ),
};
layers.osm.addTo(map);
let activeLayer = layers.osm;

const poi = [
  { name: 'Amsterdam', coords: [52.3676, 4.9041], info: 'Hoofdstad van Nederland' },
  { name: 'Rotterdam', coords: [51.9244, 4.4777], info: 'Grootste haven van Europa' },
  { name: 'Den Haag', coords: [52.0705, 4.3007], info: 'Regeringszetel' },
  { name: 'Utrecht', coords: [52.0907, 5.1214], info: 'Historisch centrum met de Dom' },
  { name: 'Eindhoven', coords: [51.4416, 5.4697], info: 'Technologie- en designstad' },
  { name: 'Groningen', coords: [53.2194, 6.5665], info: 'Studentenstad in het noorden' },
  { name: 'Maastricht', coords: [50.8514, 5.6910], info: 'Bourgondische stad in Limburg' },
];

const markerLayer = L.layerGroup().addTo(map);
poi.forEach(p => {
  L.marker(p.coords)
    .bindPopup(`<strong>${p.name}</strong><br/>${p.info}`)
    .addTo(markerLayer);
});

const legend = L.control({ position: 'bottomright' });
legend.onAdd = () => {
  const div = L.DomUtil.create('div', 'legend');
  div.innerHTML =
    '<strong>Legenda</strong>Klik op een marker voor info.<br/>' +
    'Gebruik "Voeg punt toe" om eigen markers te plaatsen.';
  return div;
};
legend.addTo(map);

const coordsEl = document.getElementById('coords');
map.on('mousemove', e => {
  coordsEl.textContent = `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`;
});

const userMarkers = L.layerGroup().addTo(map);

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
  const description = prompt('Beschrijving (optioneel):') || '';
  const label = name.trim() || 'Eigen punt';
  const popup = `<strong>${label}</strong>` +
    (description ? `<br/>${description}` : '') +
    `<br/><small>${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}</small>`;
  L.marker(e.latlng).bindPopup(popup).addTo(userMarkers).openPopup();
});

document.getElementById('clear').addEventListener('click', () => userMarkers.clearLayers());

document.getElementById('layer').addEventListener('change', e => {
  map.removeLayer(activeLayer);
  activeLayer = layers[e.target.value];
  activeLayer.addTo(map);
});

document.getElementById('locate').addEventListener('click', () => {
  map.locate({ setView: true, maxZoom: 13 });
});
map.on('locationfound', e => {
  L.circleMarker(e.latlng, { radius: 8, color: '#2563eb', fillOpacity: 0.6 })
    .bindPopup('Je bent hier')
    .addTo(userMarkers)
    .openPopup();
});
map.on('locationerror', () => alert('Locatie kon niet worden bepaald.'));

async function search(query) {
  if (!query.trim()) return;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'nl' } });
  const data = await res.json();
  if (!data.length) { alert('Niets gevonden.'); return; }
  const { lat, lon, display_name } = data[0];
  const latlng = [parseFloat(lat), parseFloat(lon)];
  map.setView(latlng, 12);
  L.marker(latlng).bindPopup(display_name).addTo(userMarkers).openPopup();
}

document.getElementById('search-btn').addEventListener('click', () => {
  search(document.getElementById('search').value);
});
document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Enter') search(e.target.value);
});
