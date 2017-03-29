# Angular2 Components for dc.js
[![Build Status](https://travis-ci.org/Ventrom/Ventrom/ng2-dcjs.svg?branch=master)](https://travis-ci.org/Ventrom/Ventrom/ng2-dcjs)
[![npm version](https://badge.fury.io/js/ng2-dcjs.svg)](http://badge.fury.io/js/ng2-dcjs)
[![devDependency Status](https://david-dm.org/Ventrom/Ventrom/ng2-dcjs/dev-status.svg)](https://david-dm.org/Ventrom/Ventrom/ng2-dcjs#info=devDependencies)
[![GitHub issues](https://img.shields.io/github/issues/Ventrom/Ventrom/ng2-dcjs.svg)](https://github.com/Ventrom/Ventrom/ng2-dcjs/issues)
[![GitHub stars](https://img.shields.io/github/stars/Ventrom/Ventrom/ng2-dcjs.svg)](https://github.com/Ventrom/Ventrom/ng2-dcjs/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Ventrom/Ventrom/ng2-dcjs/master/LICENSE)

## Demo
https://Ventrom.github.io/Ventrom/ng2-dcjs/demo/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

## About

A collection of Angular2 components to render WebGL scenes with dcjs

## Installation

Install through npm:
```
npm install --save ng2-dcjs
```

To use the module, first import it in your app:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DcjsModule } from 'ng2-dcjs';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        DcjsModule
    ],
    declarations: [],
    bootstrap:    [ AppComponent ]
})
export class AppModule {}
```

## Documentation
All documentation is auto-generated from the source via typedoc and can be viewed here:
https://Ventrom.github.io/Ventrom/ng2-dcjs/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

## License

MIT
