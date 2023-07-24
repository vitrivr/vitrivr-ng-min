# vitrivr min
[![License](https://img.shields.io/badge/License-MIT-blueviolet)](#license)


This repository contains the source code of vitrivr min, a minimalist user interface offering text-based video retrieval functionality. It was created using [Angular](https://angular.io/)

vitrivr min is a web-based user interface developed to be used with the latest version of [Cineast](https://github.com/vitrivr/cineast)'s REST API.

## Config

All configuration parameters are compiled into the application, see [settings.model.ts](https://github.com/vitrivr/vitrivr-ng-min/blob/main/src/app/settings.model.ts).



## Prerequisites

### System dependencies
* git
* node.js version 18 or later
* npm version 9 or later (comes with node.js)

## Setup

### Local Angular Application

* Clone the repositoy
* Open the terminal, navigate into the root folder e.g. `./vitrivr-ng-min/`
* run the following commands

``` npm install ```

``` npm update ```

``` npm run gen-cineast-api ```

``` npm run gen-dres-client ```

``` npm start ```

* The vitvivr_min runs on  `http://localhost:4200/`

### API Endpoints

The API Endpoints has to be configures in the Settings Model, see [settings.model.ts](https://github.com/vitrivr/vitrivr-ng-min/blob/main/src/app/settings.model.ts).

One has to set the:

*  `cineastBasePath = ''http://localhost:8080'';`
*  `thumbnailBasePath = 'http://localhost:8080'/thumbnails/';`
*  `objectBasePath = ''http://localhost:8080'/objects/';`


* `readonly dresBaseApi = "https://dmi-dres.dmi.unibas.ch"`
* `public static readonly dresUser = ''`
* `public static readonly dresPassword = ''`
