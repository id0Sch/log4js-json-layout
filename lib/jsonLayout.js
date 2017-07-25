const util = require('util');
const _ = require('lodash');

function wrapErrorsWithInspect(items) {
  return _.chain(items).map((item) => {
    if ((item instanceof Error) && item.stack) {
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

function formatLogData(logData) {
  const data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
  return util.format(...wrapErrorsWithInspect(data));
}

function createDataOverlays(items) {
  const overlay = {};
  for (const item of items) {
    if (_.isObject(item)) {
      Object.assign(overlay, item);
    }
  }
  return overlay;
}

function jsonLayout(config) {
  function formatter(data) {
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
    const messages = Array.isArray(data.data) ? data.data : [data.data];
    if (typeof messages !== 'string' && messages.length >= 1) {
      if (typeof messages[0] === 'string') {
        output.data = formatLogData(messages);
      }
      const overlays = createDataOverlays(messages);
      if (overlays.hasOwnProperty(messageParam)) {
        output.data = overlays[messageParam];
        delete overlays[messageParam];
      }
      Object.assign(output, overlays);
    }
    if (config.include && config.include.length) {
      const newOutput = {};
      config.include.forEach((key) => {
        if (output.hasOwnProperty(key)) {
          newOutput[key] = output[key];
        }
      });
      return newOutput;
    }
    return output;
  }

  function layout(data) {
    const output = formatter(data);
    return JSON.stringify(output);
  }

  return layout;
}
module.exports = jsonLayout;
