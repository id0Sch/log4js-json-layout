# log4js-json-layout

A slim and easy to use JSON layout for [log4js-node](https://github.com/nomiddlename/log4js-node).

[![NPM](https://nodei.co/npm/log4js-json-layout.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/log4js-json-layout/)

[![Build Status](https://travis-ci.org/id0Sch/log4js-json-layout.svg?branch=master)](https://travis-ci.org/id0Sch/log4js-json-layout)

## Installation

```bash
npm install log4js-json-layout --save
```

## Example Output

Output:

```json
{"startTime":"2017-07-27T00:01:05.175Z","categoryName":"/path/to/file/redis-client.js","level":"DEBUG","data":"Connection to Redis successful!"}
```

## Usage

Set the layout type to `json`.

Each log object contains the following properties:

- `startTime` - time in ISO 8601 format
- `categoryName` - specified when `log4js` is initialized
- `data` - if the log message is a string, otherwise omitted
- `level` - level in human readable format
- `source` - if provided, will be included 

### Options

- `type` - string, always `json`
- `source` - optional string, just sets the property `source`. Example value: `development`
- `include` - array of properties to include in the log object
- `colors` - boolean; off by default. If set to true, colorizes the output using log4js default color scheme based on log level. Useful for development, do not use for storing logs.

### Example Config

```js
const log4js = require('log4js');
const jsonLayout = require('log4js-json-layout');

log4js.layouts.addLayout('json', jsonLayout);
```

Minimal:

```js
appenders = [{
  type: 'console',
  layout: {
    type: 'json',
  }
}];
```

More options:

```js
appenders = [{
  type: 'console',
  messageParam: 'msg',
  layout: {
    type: 'json',
    source: 'development',
    include: ['startTime', 'categoryName'],
  }
}];

```
