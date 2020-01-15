---
layout: page
title: Modeling Global Temperatures
subtitle: Planetary Chemistry Research
math: true
---

*What factors influence global temperature anomalies?*

A link to an interactive climate/temperature model is [available here](https://www.desmos.com/calculator/pkia0eksxa). This simple model considers four main components that influence global temperatures:

* k<sub>s</sub>: variations in the total solar irradiance (TSI) with a 1-month lag and 1-month smoothing of daily data. Corrected TSI data from [Dudok de Wit et al. 2017](https://spot.colorado.edu/~koppg/TSI/Thierry_TSI_composite.txt)
* k<sub>e</sub>: The El Niño-Southern Oscillation (ENSO) with a 0-, 2-, and 10-month lag and 3-month smoothing of monthly data. The SOI index is taken as a proxy for ENSO using data from [NOAA](https://www.ncdc.noaa.gov/teleconnections/enso/indicators/soi/)
* k<sub>v</sub>: stratospheric aersol optical depth from volcanic eruptions with a 0- and 10-month lag. Stratospheric optical thickness data taken from [NASA GISSTEMP](https://data.giss.nasa.gov/modelforce/strataer/).
* k<sub>a</sub>: anthropogenic forcing, including well-mixed greenhouse gases (WMGHG) and land-use changes with a 10-year lag of annual data, normed to 1980. Forcing data taken from [Miller et al 2014](https://data.giss.nasa.gov/modelforce/Miller_et_2014/Fi_Miller_et_al14_upd.txt) (NASA GISSTEMP Model E)

Also shown are three temperature records for comparison (normed to 1980 baseline)

* [Berkely Earth](http://berkeleyearth.org/data/) Land+Ocean time series
* [Hadley-CRU](https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html#regional_series) global temperature model
* [NASA GISSTemp](https://data.giss.nasa.gov/gistemp/) global temperature model

