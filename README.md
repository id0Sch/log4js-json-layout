# log4js-json-layout
[![NPM](https://nodei.co/npm/log4js-json-layout.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/log4js-json-layout/)

provides a slim and easy to use json-layout for log4js-node (https://github.com/nomiddlename/log4js-node)

# installation
```
npm install log4js-json-layout
```

# usage
layout should be type 'json'

currently we support include options only, array of items is expected
log object will contain these properties : ["startTime","categoryName","data","level"]
source param will be added to each json object if provided 

```
var log4js = require('log4js');
var jsonLayout = require('log4js-json-layout');

log4js.layouts.addLayout('json', jsonLayout);

appenders = [{
    type: 'console',
    messageParam : 'msg',
    layout: {
        type: 'json',
        source : 'development',
        include: ['startTime', 'categoryName']
    }
  }
];

```
