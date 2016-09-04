/**
 * Created by id0sch on 08/05/2016.
 */
'use strict';
var util = require('util');
var _ = require('lodash');

function wrapErrorsWithInspect(items) {
    return _.chain(items).map(function (item) {
        if ((item instanceof Error) && item.stack) {
            return {
                inspect: function () {
                    return util.format(item) + '\n' + item.stack;
                }
            };
        } else if (!_.isObject(item)) {
            return item;
        }
    }).compact().value();
}
function formatLogData(logData) {
    var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
    return util.format.apply(util, wrapErrorsWithInspect(data));
}
function createDataOverlays(items) {
    // var data = Array.isArray(items) ? items : Array.prototype.slice.call(items);
    let overlay = {};
    for (let item of items) {
        if (_.isObject(item)) {
            Object.assign(overlay, item);
        }
    }
    return overlay;
}

function jsonLayout(config) {
    function formatter(data) {
        delete data.logger;
        let messageParam = config.messageParam || 'msg';
        var output = {
            "startTime": data.startTime,
            "categoryName": data.categoryName,
            "level": data.level.levelStr
        };
        if (config.source) {
            output.source = config.source;
        }
        let messages = Array.isArray(data.data) ? data.data : [data.data];
        if (typeof messages !== 'string' && messages.length >= 1) {
            if (typeof messages[0] == 'string') {
                output.data = formatLogData(messages)
            }
            let overlays = createDataOverlays(messages);
            if (overlays.hasOwnProperty(messageParam)) {
                output.data = overlays[messageParam];
                delete overlays[messageParam];
            }
            Object.assign(output, overlays);
        }
        if (config.include && config.include.length) {
            var newOutput = {};
            config.include.forEach(function (key) {
                if (output.hasOwnProperty(key)) {
                    newOutput[key] = output[key];
                }
            });
            return newOutput;
        } else {
            return output;
        }
    }

    function layout(data) {
        var output = formatter(data);
        return JSON.stringify(output);
    }

    return layout
}
module.exports = jsonLayout;