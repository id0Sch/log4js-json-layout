/**
 * Created by id0sch on 08/05/2016.
 */
'use strict';
var util = require('util');

function wrapErrorsWithInspect(items) {
    return items.map(function (item) {
        if ((item instanceof Error) && item.stack) {
            return {
                inspect: function () {
                    return util.format(item) + '\n' + item.stack;
                }
            };
        } else {
            return item;
        }
    });
}
function formatLogData(logData) {
    var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
    return util.format.apply(util, wrapErrorsWithInspect(data));
}
function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
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
        if (data.data.length === 2 && isObject(data.data[1])) {
            output.data = data.data[0]; // the message
            Object.assign(output, data.data[1]);
        } else if (data.data.length === 1 && data.data[0].hasOwnProperty(messageParam)) {
            output.data = data.data[0][messageParam]; // the message
            delete data.data[0][messageParam];
            Object.assign(output, data.data[0]);
        } else if (data.data) {
            output.data = formatLogData(data.data);
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