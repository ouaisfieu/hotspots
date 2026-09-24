/* Carte des hotspots — Leaflet (copie locale) + tuiles OpenStreetMap.
   Les données sont lues dans le bloc <script type="application/geo+json" id="geo-data"> de la page,
   identique au fichier /data/hotspots.geojson. */
(function () {
  'use strict';
  var el = document.getElementById('map');
  var src = document.getElementById('geo-data');
  if (!el || !src || typeof L === 'undefined') return;

  var data;
  try { data = JSON.parse(src.textContent); } catch (e) { return; }

  var map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.5 }).setView([50.848, 4.352], 12.5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">contributeurs OpenStreetMap</a>'
  }).addTo(map);

  var STYLE = {
    hotspot: { radius: 9, color: '#ffffff', weight: 2, fillColor: '#eb6834', fillOpacity: 0.95 },
    rdr: { radius: 8, color: '#ffffff', weight: 2, fillColor: '#1baf7a', fillOpacity: 0.95 },
    cite: { radius: 8, color: '#2a78d6', weight: 3, fillColor: '#2a78d6', fillOpacity: 0.08 }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function popup(p) {
    var h = '<h3>' + esc(p.nom) + '</h3>';
    if (p.categorie === 'hotspot') {
      h += '<p><strong>Hotspot régional n° ' + esc(p.rang) + '</strong> · ' + esc(p.commune) + '</p>';
      h += '<p>Désigné : ' + esc(p.ajout) + '<br>Zone de police : ' + esc(p.zone_police) + '</p>';
    } else if (p.categorie === 'rdr') {
      h += '<p><strong>Dispositif socio-sanitaire</strong> · ' + esc(p.commune) + '</p>';
    } else {
      h += '<p><strong>Zone citée, hors liste officielle</strong> · ' + esc(p.commune) + '</p>';
    }
    if (p.resume) h += '<p>' + esc(p.resume) + '</p>';
    h += '<p><small>Position indicative (centre approximatif du périmètre).</small></p>';
    return h;
  }

  var groups = { hotspot: L.layerGroup(), rdr: L.layerGroup(), cite: L.layerGroup() };
  var byId = {};
  (data.features || []).forEach(function (f) {
    var p = f.properties || {};
    var c = f.geometry && f.geometry.coordinates;
    if (!c) return;
    var st = STYLE[p.categorie] || STYLE.cite;
    var m = L.circleMarker([c[1], c[0]], st).bindPopup(popup(p));
    m.bindTooltip(esc(p.nom), { direction: 'top', offset: [0, -8] });
    (groups[p.categorie] || groups.cite).addLayer(m);
    byId[p.id] = m;
  });
  groups.hotspot.addTo(map);
  groups.rdr.addTo(map);
  groups.cite.addTo(map);
  var all = L.featureGroup([].concat(groups.hotspot.getLayers(), groups.rdr.getLayers(), groups.cite.getLayers()));
  if (all.getLayers().length) map.fitBounds(all.getBounds(), { padding: [30, 30] });
  L.control.layers(null, {
    'Hotspots régionaux (19)': groups.hotspot,
    'Salles de consommation (GATE, LINKup)': groups.rdr,
    'Zones citées hors liste officielle': groups.cite
  }, { collapsed: true }).addTo(map);

  /* Boutons « Voir sur la carte » dans les fiches */
  document.querySelectorAll('button.locate[data-id]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var m = byId[b.getAttribute('data-id')];
      if (!m) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      map.setView(m.getLatLng(), 15);
      m.openPopup();
    });
  });
})();
