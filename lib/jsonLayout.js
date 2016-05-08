/**
 * Created by id0sch on 08/05/2016.
 */
'use strict';

function jsonLayout(config) {
    function formatter(data) {
        delete data.logger;

        var output = {};
        if (config.include && config.include.length) {
            config.include.forEach(function (key) {
                if (data.hasOwnProperty(key)) {
                    output[key] = data[key];
                }
            });
        } else {
            output = data;
        }
        if (output.level) {
            output.level = output.level.levelStr;
        }
        return output;
    }

    function layout(data) {
        var output = formatter(data);
        return JSON.stringify(output);
    }

    return layout
}
module.exports = jsonLayout;