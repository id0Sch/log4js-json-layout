const util = require('util');
const _ = require('lodash');
const colors = require('colors/safe');

const defaultLevelColors = {
  ALL: 'grey',
  TRACE: 'blue',
  DEBUG: 'cyan',
  INFO: 'green',
  WARN: 'yellow',
  ERROR: 'red',
  FATAL: 'magenta',
  MARK: 'grey',
  OFF: 'grey',
};

function wrapErrorsWithInspect(items) {
  return _.chain(items).map((item) => {
    if (_.isError(item) && item.stack) {
      return {
        inspect() {
          return `${util.format(item)}\n${item.stack}`;
        },
      };
    } else if (!_.isObject(item)) {
      return item;
    }
  }).compact().value();
}

function formatLogData(...args) {
  const data = _.isArray(args[0]) ? args[0] : args;
  return util.format(...wrapErrorsWithInspect(data));
}

function createDataOverlays(items) {
  const overlay = {};

  _.forEach(items, (item) => {
    if (_.isObject(item)) {
      _.assign(overlay, item);
    }
  });

  return overlay;
}

function jsonLayout(config) {
  function formatter(raw) {
    const data = _.clone(raw);
    delete data.logger;

    const messageParam = config.messageParam || 'msg';

    const output = {
      startTime: data.startTime,
      categoryName: data.categoryName,
      level: data.level.levelStr,
    };

    if (config.source) {
      output.source = config.source;
    }

    const messages = _.isArray(data.data) ? data.data : [data.data];

    if (_.isArray(messages) && messages.length >= 1) {
      if (_.isString(messages[0])) {
        output.data = formatLogData(messages);
      }
      const overlays = createDataOverlays(messages);

      if (_.has(overlays, messageParam)) {
        output.data = overlays[messageParam];
        delete overlays[messageParam];
      }

      _.assign(output, overlays);
    }

    if (config.include && config.include.length) {
      const newOutput = {};
      _.forEach(config.include, (key) => {
        if (_.has(output, key)) {
          newOutput[key] = output[key];
        }
      });
      return newOutput;
    }

    return output;
  }

  return function layout(data) {
    let output = JSON.stringify(formatter(data));

    // Add color to output; don't use this when logging.
    if (_.has(config, 'colors') && config.colors) {
      if (_.has(defaultLevelColors, data.level.levelStr)) {
        const color = defaultLevelColors[data.level.levelStr];
        output = colors[color](output);
      }
    }

    return output;
  };
}
module.exports = jsonLayout;
