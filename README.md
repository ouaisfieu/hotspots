# Hotspots — Trafic de drogue et lutte antidrogue à Bruxelles

Site statique (JAMstack, **sans étape de build**) consacré au trafic de stupéfiants en Région de Bruxelles-Capitale et aux politiques de lutte (2022-2026) : marché, réseaux, fusillades, 19 hotspots, police, justice, santé publique, débats.

- Adresse prévue : <https://ouaisfieu.github.io/hotspots/>
- Rédaction, vérification et code : **Claude** (modèle d'IA, Anthropic). Commanditaire anonyme.
- État des connaissances : 24 septembre 2026.

## Publier sur GitHub Pages

1. Copier **le contenu** de ce dossier à la racine du dépôt `ouaisfieu/hotspots` (y compris le fichier caché `.nojekyll`).
2. *Settings → Pages → Build and deployment* : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est servi sous `/hotspots/`. Les liens internes sont relatifs ; seules les URL canoniques, le sitemap, `robots.txt`, `llms.txt`, le manifeste et la page `404.html` contiennent le chemin absolu.

**Autre domaine ?** Remplacer `https://ouaisfieu.github.io/hotspots/` et `/hotspots/` partout (recherche-remplacement globale) — balises `canonical`, `og:*`, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, `404.html`.

## Structure

```
index.html              Accueil : chiffres clés, dossiers, l'essentiel en dix points
trafic/                 Le marché : Anvers, produits, organisations, petites mains, blanchiment
violences/              Fusillades : séries 2022-2026, géographie, tireurs, réponse judiciaire
hotspots/               Carte Leaflet + fiches des 19 hotspots, mesures, bilans
lutte/                  Acteurs, parquet, plan Grandes Villes, armée, fusion des polices, droit
sante/                  Crack, GATE, LINKup, revalidation, acteurs de la réduction des risques
debats/                 Arguments en présence (répression / santé, médias, budget, modèles étrangers)
chronologie/            Frise 2021-2026 filtrable
chiffres/               Tableaux d'indicateurs + données ouvertes
glossaire/              Définitions (DefinedTermSet)
sources/                Bibliographie complète (≈100 sources)
a-propos/               Méthode, corrections du corpus, licence
404.html
data/                   hotspots.geojson, hotspots.csv, indicateurs.csv, fusillades.csv, chronologie.csv
assets/css/style.css    Feuille de style unique (clair/sombre)
assets/js/main.js       Thème, menu mobile, infobulles, filtres (amélioration progressive)
assets/js/map.js        Carte des hotspots
assets/vendor/leaflet/  Leaflet 1.9.4 (BSD-2), hébergé localement
sitemap.xml, robots.txt, llms.txt, humans.txt, site.webmanifest, favicon.svg/.ico
```

## Choix techniques

- **HTML sémantique** (`header`, `nav`, `main`, `article`, `section`, `figure`, `time`, `dfn`, `cite`, `data`, tableaux avec `caption`/`scope`), validé sans erreur ni avertissement par le Nu HTML Checker.
- **Web sémantique** : JSON-LD schema.org sur chaque page (`WebSite`, `Article`, `BreadcrumbList`, `ItemList` de `Place` géolocalisés, `Dataset` avec `DataDownload`, `DefinedTermSet`, `Event`), citations structurées, données ouvertes CSV/GeoJSON liées par `<link rel="alternate">`.
- **SEO** : titres et descriptions uniques, URL canoniques, Open Graph et Twitter Cards (image 1200×630), sitemap, fil d'Ariane, `llms.txt`.
- **Graphiques** en SVG statique inscrit dans le HTML (lisibles sans JavaScript), avec tableau de données et infobulles au survol/au clavier.
- **Accessibilité** : lien d'évitement, focus visible, contrastes, mode sombre, `prefers-reduced-motion`, graphiques décrits.
- **Vie privée** : aucun cookie ni mesure d'audience. Seules les tuiles de la carte proviennent d'OpenStreetMap.
- Aucune dépendance à installer ; ouvrir `index.html` suffit pour relire (la carte a besoin d'un accès réseau pour les tuiles).

## Mettre à jour

Les pages sont du HTML autonome : modifier directement le fichier concerné. Penser à :
- mettre à jour la date `dateModified` (JSON-LD), `article:modified_time` et le texte « Mis à jour le » ;
- ajouter la source dans la section « Sources citées sur cette page » et sur `sources/` ;
- répercuter les chiffres dans `data/*.csv` et, pour un nouveau hotspot, dans `data/hotspots.geojson`, `data/hotspots.csv` **et** le bloc `<script type="application/geo+json" id="geo-data">` de `hotspots/index.html`.

Les coordonnées des hotspots sont des centres **indicatifs** (±200 m) : les périmètres officiels, fixés par ordonnances de police, ne sont pas publiés en données ouvertes.

## Licence

Textes et données : [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr). Leaflet : BSD-2 (voir `assets/vendor/leaflet/LICENSE.txt`). Fond de carte © contributeurs OpenStreetMap (ODbL).
