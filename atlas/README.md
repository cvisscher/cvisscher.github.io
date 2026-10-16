# Worlds in proportion

An educational mass–radius atlas and snapshot of the author's research, ready for GitHub Pages. Visitors explore Solar System objects, exoplanets, brown dwarfs, low-mass stars and the Sun using population checkboxes, search, hover details, density guides and optional uncertainties. **Objects in my research** shows objects associated with the author's work.

## Preview and deploy

```sh
python3 scripts/validate.py
node tests/importer.cjs
python3 -m http.server 8000
```

Visit http://localhost:8000. Directly opening index.html is not supported. Plotly loads from a pinned CDN URL and requires an internet connection.

Follow [DEPLOY.md](DEPLOY.md) for GitHub Pages installation, including adding the atlas to an existing website. Copy the complete repository contents, including `.github/`, and choose GitHub Actions as the Pages source.

## Maintain the published data

The public page has no upload, import, catalog-management or browser-storage controls. It always loads the published data files, so visitors see a reproducible research snapshot. Browser imports saved by earlier development versions are ignored.

For additions, edit `data/custom-objects.csv` in Excel or a text editor, save as UTF-8 CSV, then commit and deploy. Keep the header row. Required columns are name, mass and radius; declare mass_unit and radius_unit explicitly. Accepted units are Earth, Jupiter, Sun, kg for mass, and km for radius. Use `personal=yes` for the research-only filter. Optional errors use the same units as their central value. A blank error means unknown. For alternate Earth-unit headers use mass_earth and radius_earth. The template in data/import-template.csv contains a fictional example to replace.

To rebuild the bundled lists from the original local workbooks:

```sh
node scripts/prepare_supplied.cjs /path/to/research.xlsx /path/to/carmichael.xlsx /path/to/nasa.xlsx
```

This reads the first worksheet of each file, preserves source metadata/checksums and never changes the originals. Review changes before committing. The vendored SheetJS reader is used only for this maintainer command; it is not loaded by the public page. Its license is in vendor/SHEETJS-LICENSE.

## Data and behavior

Published records load from data/catalog.json, data/supplied-datasets.json and data/custom-objects.csv. Priority is custom file, research list, Carmichael, NASA, then starter. One plotted point is retained per normalized name. NASA repeat entries are summarized with coordinate medians; other dataset overlaps follow the stated priority. The NASA workbook contains repeated solutions and limit flags. Each object uses the unweighted median mass and median radius across eligible positive, non-limit paired rows. Density is derived from that coordinate pair. These medians need not correspond to a single publication; aggregated rows have no error bars because no combined uncertainty is estimated. See [PROVENANCE.md](PROVENANCE.md) for all source and conversion details.

The Moon is the smallest displayed object. Bennu and Eros are excluded. The corrected Moon and separate Sun reference are included. Brown dwarfs use the chosen lower display cutoff of 1000 Earth masses, with identified low-mass stars kept separate. This is a visualization convention, not a universal physical definition.

Source and method metadata remain in the data and provenance details, while hover labels stay concise. CSV and PNG downloads are read-only exports of the visualization. The research associations in the published JSON are part of the public site.

## Checks

Run scripts/validate.py and tests/importer.cjs after data changes. Check population filters, research-only mode, search/reset and object details in a browser before deployment.

Code license: MIT. Scientific values retain source attribution and source reuse terms. The original reference image is not redistributed.


## Related research links

Selecting a point or an object in the table opens its detail card and related ADS publications. `data/research-publications.json` maps the 51 research objects to paper IDs; the shared `papers` registry stores author/year labels and direct ADS URLs. Original spreadsheet citation labels, corrections, evidence URLs and unresolved labels are retained for review. Research-paper associations are separate from mass/radius measurement provenance.

Links were matched to the author's publications page on 2026-10-15. Kataria labels spanning multiple years were reconciled against the 2016 paper's Table 1, and Vos 2022 labels resolve to the 2023 publication of that preprint. Earlier Gliese 229B papers refer to the unresolved system. The supplied Visscher+2020 labels on Ba/Bb remain unresolved and were not linked to the unrelated Jupiter commentary. ADS can require JavaScript or access checks; no live ADS API token is required by the website.

To add a paper, add a registry entry with its ADS bibcode/URL and associate its ID with the relevant object. This is a curated list, not an automatically refreshed bibliography.


## Carmichael companions and hosts

The table's MBD/MJ and RBD/RJ columns populate companion objects in Jupiter units. The M⋆/M⊙ and R⋆/R⊙ columns separately populate 37 **Host stars** in solar units. The Host stars checkbox is off by default and resets to off. This population includes stars above one solar mass; they are not classified as low-mass dwarfs. Labels such as “Host of HATS-70b” explicitly identify the relationship without guessing alternate catalog names. The full-range plot expands vertically when hosts are shown.

NASA aggregation uses 2522 eligible rows for 1298 objects, combining 1224 repeated-name rows rather than discarding them. The 229 limit-flagged rows remain excluded. Every aggregate retains contributing row numbers, central values and original per-row uncertainties in its measurements array. Research and companion datasets still take precedence over the NASA aggregate when the same object appears in more than one dataset.
