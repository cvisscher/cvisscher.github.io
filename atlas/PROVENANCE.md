# Data provenance and update workflow

## Scope and reference

This is a curated educational starter catalog, reviewed on 2026-10-14. It is not complete, statistically representative, or a claim about the latest accepted values. Historical published solutions are intentionally retained. The user's image informed the Earth-normalized log axes and marker vocabulary; its fit, power laws and transition boundaries are omitted until the underlying publication and model are identified.

## Conventions

- Earth: mass 5.97217 × 10²⁴ kg; **mean** radius 6371.0084 km, following JPL. Earth is exactly (1,1).
- Jupiter conversion for papers in Jupiter units: 1.89813 × 10²⁷ kg; 71492 km (**equatorial** radius convention). Solar System Jupiter itself uses a mean radius of 69911 km. This distinction is real and should be considered when comparing literature values. Older papers may use slightly different Jupiter conventions; this starter applies the stated conversion uniformly and does not claim precision beyond those conventions.
- Solar conversion: 1.98847 × 10³⁰ kg and 695700 km. These are adopted conversion constants, not fitted values. Earth-unit results should not be treated as having more precision than original measurements.
- Density: ρ = M/(4πR³/3), with SI values converted to g/cm³. Reference curves are R/R⊕ = [(ρ⊕/ρ)(M/M⊕)]^(1/3), where ρ⊕ is calculated from the adopted constants (about 5.513 g/cm³). Curves do not model self-compression or composition.
- Asteroids use volume-equivalent radii; planet transit radii and stellar radii have different observational meanings. Bennu's radius is derived from volume, Eros' from mass and density. This is not a spherical-shape claim.
- Uncertainties are `[lower magnitude, upper magnitude]`, in Earth units. Null means not transcribed; never interpret it as zero. Published marginal errors are shown independently, without covariance. Derived densities and reconstructed radii have no propagated uncertainties in this release.

## Source registry

Every catalog row has a source key, original values and units, measurement method, review date and explanatory note. The complete clickable registry is in `data/catalog.json` and object cards.

| Objects | Adopted source |
| --- | --- |
| Eight Solar System planets | [JPL physical parameters](https://ssd.jpl.nasa.gov/planets/phys_par.html), mean radii and masses; rounded, uncertainties not transcribed |
| Bennu | [Lauretta et al. 2019, Table 1](https://heliophysics.gsfc.nasa.gov/sed/content/uploadFiles/publication_files/Lauretta2019.pdf), mass and shape volume |
| Eros | [Yeomans et al. 2000](https://doi.org/10.1126/science.289.5487.2085), mass and density |
| TRAPPIST-1 b–h | [Agol et al. 2021](https://doi.org/10.3847/PSJ/abd022), adopted transit-timing/transit solution |
| 55 Cancri e | [Acuña et al. 2023, Table 2](https://www.aanda.org/articles/aa/pdf/2023/09/aa45736-22.pdf), values attributed there to Bourrier et al. 2018 |
| WASP-35/48/51 b | [Enoch et al. 2011](https://arxiv.org/abs/1104.2827) |
| CoRoT-3 b | [Deleuil et al. 2008](https://arxiv.org/abs/0810.0919); ambiguous massive planet / brown dwarf, grouped with brown dwarfs for exploration |
| WASP-30 b | [Anderson et al. 2010](https://arxiv.org/abs/1010.3006), rounded abstract values |
| TRAPPIST-1 star | [Van Grootel et al. 2018](https://arxiv.org/abs/1712.01911), semi-empirical mass |
| OGLE-TR-122 b | [Pont et al. 2005](https://doi.org/10.1051/0004-6361:200500025) |
| HATS stellar companions | [Zhou et al. 2014](https://arxiv.org/abs/1310.7591) |

Classification is an editorial label, not a hard mass boundary. Brown-dwarf formation, age, composition and hydrogen-burning limits are not reducible to a single universal threshold. Stars in this sample span roughly 0.089–0.20 solar masses.

## Adding or updating data

1. Save the original paper/table or API response in a dated research archive. Record its URL, retrieval date, query, checksum, citation, parameter definitions and license. The seed catalog was manually transcribed from the linked publications/tables; no complete machine snapshot is claimed for it.
2. Choose a coherent mass–radius solution from the same publication where possible. Verify mass is a true inferred mass, not M sin i, a limit or a mass predicted from radius. Reject nonpositive/missing measurements. Keep modeled masses or radii in a separately labeled layer if later added.
3. Record original values, units, radius convention, methods, asymmetric errors and quality flags. Convert once with the declared constants. Never infer that an absent error is zero; document derived radii and correlations.
4. Assign a stable unique ID; deduplicate names and retain one documented adopted solution per object. Review substellar classifications manually. Add source registry entries with HTTPS links; never insert source HTML into the page.
5. Compare with the current catalog in a pull request. Explain changed solutions and excluded rows, run validation, then manually inspect the plot. Update the catalog review date and commit the raw response/query manifest when redistribution is permitted.

### NASA Exoplanet Archive candidate workflow

```sh
python3 scripts/refresh_exoplanets.py --output work/exoplanets-2026-10-14.json
```

This explicitly downloads a **review candidate**, not the published catalog. It uses `ps` default publication rows with positive mass/radius, `pl_bmassprov='Mass'`, and both limit flags equal to zero. It excludes M sin i and limits. Save the raw response and its SHA-256 manifest; inspect per-row `pl_refname` and the original paper to confirm the values are not inferred from a mass–radius relation. A default solution is not always the most precise solution and this strict selection can omit planets with good measurements in other rows. It must not be treated as a completeness criterion.

See the Archive's [column definitions](https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html) and [TAP documentation](https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html). `pscomppars` combines parameters and can contain calculated values; do not merge it blindly into a measured mass–radius sample. No refresh runs automatically at page load, ensuring that a published plot remains reproducible.


## Supplied spreadsheet datasets (added 2026-10-14)

The three original workbooks were read without editing them. The normalized records and import diagnostics are in `data/supplied-datasets.json`, including original-file SHA-256 checksums. No current web refresh has replaced these supplied values.

| Supplied dataset | Usable unique rows | Skipped rows | Interpretation |
| --- | ---: | ---: | --- |
| Personal objects / citations | 51 | 1 | Planet 9 has ambiguous mass and no numeric radius. Original associated paper labels retained; these are not verified numerical measurement references. |
| Carmichael Table A1 | 37 | 0 | Table describes transiting brown dwarfs and very low-mass stars as of August 2022. Classified as “Substellar companions” for dataset exploration, without asserting a physical boundary. Numbered references and the full supplied reference key are retained. |
| NASA mass-radius workbook | 1298 | 229 | Use median mass and radius from 2522 positive, non-limit paired rows. Ten rows have uncertainty warnings; repeated names are aggregated. |

The catalog has 1413 distinct names including 37 optional host stars; the default view retains 1376 objects with hosts hidden. Personal data precedes Carmichael, then NASA, then starter. This is an explicit display policy, not a ranking of scientific accuracy. The NASA workbook has repeated names and no publication-solution IDs, mass-provenance flags or measurement-method columns. Its rows must not be described as a fully vetted measured population. Literature rows cannot be identified as current/default or most precise from this file alone. The user's research list likewise includes model-dependent brown-dwarf estimates and unverified adopted values. Preserve these limitations when using the plot scientifically.

The Moon now uses mass 7.346 × 10²² kg and volumetric mean radius 1737.4 km from the [NASA Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html). The supplied spreadsheet values are preserved under `supplied_original`, and associated research papers remain attached. Original workbooks are unchanged. No fuzzy object renaming is performed (for example “WASP-107” is not silently changed to “WASP-107 b”).

The two unnamed numeric columns in the NASA sheet are not used: the importer uses the explicitly labeled Jupiter mass/radius columns and declared atlas constants. This avoids silently mixing radius conventions. All normalized errors and central values use the same unit factors as the starter. Formula cells are read from their saved cached results; formulas are never evaluated by the importer. Missing or nonnumeric results are rejected.

Import reports include the input row number, rejection reason, omitted uncertainty warnings, and cross-dataset overlap decisions. Deduplication normalizes case, whitespace and Unicode minus signs; it does not infer aliases or choose between publications based on recency. Associated papers are escaped text, and only HTTP(S) source URLs become links.


## Display groups

The three supplied datasets load automatically in the background. The sidebar filters four display groups: Solar System objects (including asteroids and moons), Exoplanets, Brown dwarfs, and Low-mass stars. Identified low-mass stars retain their class. Other extrasolar objects with mass at least 1000 Earth masses are displayed in Brown dwarfs; lighter extrasolar objects appear in Exoplanets. This is the user's chosen visualization cutoff, not a universal physical definition. Original source classifications remain in the data, and provenance remains available separately from the concise hover labels.

Bennu and Eros were removed at the user's request. The displayed catalog excludes objects below the adopted lunar mass or mean radius, making the Moon the smallest object. Research objects use their group colors without a coral highlight option.

The Sun is included as a separate solar reference using the declared conversion constants: 1.98847 × 10³⁰ kg and 695700 km, or approximately 332956 Earth masses and 109.198 Earth radii. It is separate from the low-mass-star group.

## Public outreach interface

The public page loads only the published populations and research associations. Upload and data-management controls have been removed, and browser-local imports from earlier development versions are ignored. Data maintenance remains a file-based workflow described in README.md.

## Object-to-publication links

`data/research-publications.json` preserves the supplied object/citation associations and resolves them to author/year entries from [Channon Visscher's publications page](https://cvisscher.github.io/publications/), retrieved 2026-10-15. It includes 51 object records and 42 unique ADS entries. Each object has at least one direct ADS link. This documents related research, not the source of every mass/radius measurement.

Kataria labels were reconciled using Table 1 of [the 2016 paper](https://arxiv.org/abs/1602.06733); Vos 2022 refers to [the preprint published in 2023](https://arxiv.org/abs/2212.07399). The malformed encoded trailing slash in the source page's Moses 2013 Neptune ADS link was removed. Tsai 2023 was matched to the published [WASP-39b paper](https://www.nature.com/articles/s41586-023-05902-2). Other associations retain the user's supplied object-to-paper mapping and match bibliography metadata, without claiming an independent full-text audit of each association.

The Gliese 229Ba/Bb Visscher+2020 labels are unresolved; they are preserved without creating a misleading link to the Jupiter commentary. Older papers refer to unresolved Gliese 229B. The source website's other unrelated entries were not copied into the public registry.


## Median aggregation and host-star extraction (2026-10-15)

The unweighted median mass and median radius are computed independently over each object's eligible rows. A density column was not supplied: displayed density is M/(4πR³/3) from those medians, not the median of per-row densities. Limit flags still exclude a row. Exact repeated numerical values retain their row multiplicity; no publication-level deduplication is inferred without publication identifiers. This is a descriptive summary of supplied rows, not a statistically combined posterior or a single coherent paper solution.

A multiple-row aggregate has null mass_error and radius_error; published marginal errors cannot be directly inherited as an uncertainty on its median. The measurements array and provenance.rows preserve original central values, units, errors and row identifiers. Single-row objects retain their available source errors. Across different datasets, the research/Carmichael/NASA/starter priority still applies.

Carmichael hosts are extracted separately from M⋆/M⊙ and R⋆/R⊙. Companions continue to use MBD/MJ and RBD/RJ. The 37 host rows retain the same worksheet/row provenance and original solar-unit values. They appear under Host stars, including hosts above a solar mass, and are initially hidden. They are not added to the low-mass-star classification.
