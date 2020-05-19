---
layout: page
title: Modeling Global Temperatures
subtitle: Planetary Chemistry Research
math: true
---

# Climate-Hindcast README

*What factors influence global temperature anomalies?*

A link to an interactive climate/temperature model is [available here](https://www.desmos.com/calculator/coqhcd0vgf). This simple parameterization model considers four main components that influence global temperatures:

* **k<sub>s</sub>:** variations in the total solar irradiance (TSI)
* **k<sub>e</sub>:** the El Niño-Southern Oscillation (ENSO). The SOI index is taken as a proxy for ENSO using data from NOAA
* **k<sub>v</sub>:** stratospheric aersol optical depth from volcanic eruptions
* **k<sub>a</sub>:** anthropogenic forcing, including well-mixed greenhouse gases (WMGHG) and land-use changes

These can be adjusted in an [interactive desmos worksheet](https://www.desmos.com/calculator/dxg7zokoot) to reproduce global temperatures from 1980.

**Disclaimer:** this simple hindcast model was developed primarily as an undergraduate teaching tool, in order to demonstrate the major processes that influence global temperature - and in particular, to demonstrate that **the temperature changes observed over the past 40 years cannot be re-created without considering anthropogenic effects**. *This approach is **not** intended to serve as a detailed or accurate analysis of climate forcing effects,* and the *k* values discussed below serve as rough proportionality constants. For further reading I recommend the following (not exhaustive):

* Marvel, K., G.A. Schmidt, R.L. Miller, and L. Nazarenko (2016) Implications for climate sensitivity from the response to individual forcings. *Nature Climate Change*, 6, no. 4, 386-389.
* Canty, T. Mascioloi, N.R., Smarte, M.D., and Salawitch, R.J. (2013). An empirical model of global climate – Part 1: A critical evaluation of volcanic cooling. *Atmospheric Chemistry and Physics*, 13, 3997-4031.
* Kopp, G. and Lean, J.L. (2011) A new, lower value of total solar irradiance: Evidence and climate significance. *Geophysical Research Letters*, 38, L01706.
* Lean, J.L. and Rind, D.H. (2009) How will Earth’s surface temperature change in future decades? *Geophysical Research Letters*, 36, L15708.
* Lean, J.L. and Rind, D.H. (2008) How natural and anthropogenic influences alter global and regional surface temperatures: 1889 to 2006. *Geophysical Research Letters*, 35, L18701.
* Hansen, J. et al. (2005) Efficacy of climate forcings. *Journal of Geophysical Research*, 110, D18104.
* Douglass, D.H. and Clader, B.D. (2002) Climate sensitivity of the Earth to solar irradiance. *Geophysical Research Letters*, Vol. 29, No. 16.

## Method ##
### Temperature Records ###

The baseline used for the hindcast model is 1980; the temperature records must therefore be normalized (i.e., such that the temperature anomaly in 1980 = 0 C by definition) to show the temperature increase from 1980 forward. For example,

* [NASA GISTemp](https://data.giss.nasa.gov/gistemp/); 1980 temperature anomaly = 0.2745 C, so that ![equation](https://latex.codecogs.com/gif.latex?t_%7Bmodel%7D%20%3D%20t_%7B%7Brecord%7D%7D%20-%200.2745)
* [Hadley-CRU](https://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/download.html#regional_series); HadCRUT4 1980 temperature anomaly = 0.092 C, so that ![equation](https://latex.codecogs.com/gif.latex?t_%7Bmodel%7D%20%3D%20t_%7B%7Brecord%7D%7D%20-%200.092)
* [Berkely Earth](http://berkeleyearth.org/data/) Land+Ocean time series; 1980 temperature anomaly = 0.20 C, so that ![equation](https://latex.codecogs.com/gif.latex?t_%7Bmodel%7D%20%3D%20t_%7B%7Brecord%7D%7D%20-%200.20)

Note that these normalization values may be adjusted for comparison over other time intervals.

### Climate Model Components ###

The "hindcast" or 4-component model temperature is determined using the following expression:

![equation](https://latex.codecogs.com/gif.latex?%5Cdelta%20t_%7Bmodel%7D%3Dk_%7Bs%7D%28y_%7Bs%7D&plus;c_%7Bs%7D%29&plus;k_%7Be%7D%28y_%7Be%7D%29&plus;k_%7Bv%7D%28y_%7Bv%7D%29&plus;k_a%28y_a&plus;c_a%29)

where the *k* values are treated as free parameters in the model. The *k* value relates the observed temperature anomaly to some observed change in the data set, e.g.

* **solar component:** ![equation](https://latex.codecogs.com/gif.latex?%5Cdelta%20t_%7Bs%7D%3Dk_%7Bs%7D%28y_%7Bs%7D&plus;c_s%29) gives the temperature anomaly (δt) from variations in the total solar irradiance (TSI in W/m<sup>2</sup>, given by y<sub>s</sub>). The c<sub>s</sub> term normalizes the solar data to ~1980 baseline. The (model_k_solar) data uses a 1-month lag and 1-month smoothing of daily data. Corrected TSI data from [Dudok de Wit et al. 2017](https://spot.colorado.edu/~koppg/TSI/Thierry_TSI_composite.txt).
* **El-Nino-Southern-Oscillation (ENSO) component:** ![equation](https://latex.codecogs.com/gif.latex?%5Cdelta%20t_%7Be%7D%3Dk_%7Be%7D%28y_%7Be%7D%29) gives the temperature anomaly (δt) from variations in Souther Oscillation Index (SOI), given by y<sub>e</sub>. This term is already a normalized index, so no c<sub>e</sub> term is included. The (model_k_enso) data uses a 0-, 2-, and 10-month lag and 3-month smoothing of monthly data following the approach of Kopp & Lean (2011). SOI data adopted from [NOAA](https://www.ncdc.noaa.gov/teleconnections/enso/indicators/soi/).
* **stratospheric aerosol (volcanic) component:** ![equation](https://latex.codecogs.com/gif.latex?%5Cdelta%20t_%7Bv%7D%3Dk_%7Bv%7D%28y_%7Bv%7D%29) gives the temperature anomaly (δt) caused by strasopheric aerosols following volcanic eruptions, characterized by an optical depth term y<sub>v</sub>. No contribution from strasospheric aerosols provides an optical depth of zero, so no c<sub>v</sub> is included. The (model_k_volcano) data uses a  0- and 10-month lag following the approach of Kopp & Lean (2011). Stratospheric optical thickness data taken from [NASA GISTEMP](https://data.giss.nasa.gov/modelforce/strataer/).
* **anthropogenic component:** ![equation](https://latex.codecogs.com/gif.latex?%5Cdelta%20t_%7Ba%7D%3Dk_%7Ba%7D%28y_%7Ba%7D&plus;c_a%29) gives the temperature anomaly (δt) from anthropogenic forcings (y<sub>a</sub>), including land-use changes and greenhouse gases (GHG). The (model_k_anthro) data considers 10-year lag of annual data; the c<sub>a</sub> term allows for normalization to 1980. Anthropogenic forcing values adopted from [NASA GISS Model E forcings](https://data.giss.nasa.gov/modelforce/).

This project is released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

