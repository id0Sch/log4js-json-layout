# log4js-json-layout
[![NPM](https://nodei.co/npm/log4js-json-layout.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/log4js-json-layout/)

A slim and easy to use JSON layout for [log4js-node](https://github.com/nomiddlename/log4js-node).

## Installation

```bash
npm install log4js-json-layout --save
```

## Usage

Set the layout type to `json`.

Each log object contains the following properties:

- `startTime`
- `categoryName`
- `data`
- `level`
- `source` - if provided, will be included 

### Options

- `type` - string, always `json`
- `source` - optional string, just sets the property `source`. Ex: `development`
- `include` - array of properties to include in the log object
- `colors` - boolean; if set, colorizes the output for humans. Don't use for logging.

### Example

```
const log4js = require('log4js');
const jsonLayout = require('log4js-json-layout');

log4js.layouts.addLayout('json', jsonLayout);

appenders = [{
  type: 'console',
  messageParam: 'msg',
  layout: {
    type: 'json',
    source: 'development',
    include: ['startTime', 'categoryName'],
    colors: false
  }
}];

```
