/**
 * Created by id0sch on 08/05/2016.
 */
'use strict';

function jsonLayout(config) {
    function formatter(data) {
        delete data.logger;

        var output = {
            "startTime": data.startTime,
            "categoryName": data.categoryName,
            "data": data.data,
            "level": data.level.levelStr
        };
        if (config.source) {
            output.source = config.source;
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