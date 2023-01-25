const _ = require("lodash");

var globalSettings = {};

function Settings(useGlobal = false, defaults = {}) {
    var _settings = {};

    if (useGlobal) {
        globalSettings = _.defaults(defaults, globalSettings);
    } else {
        _settings = _.defaults(defaults, _settings);
    }

    return function (toSet = {}) {
        if (useGlobal) {
            globalSettings = _.defaults(toSet, globalSettings);
            return JSON.parse(JSON.stringify(globalSettings));
        } else {
            this._settings = _.defaults(toSet, _settings);
            return JSON.parse(JSON.stringify(_settings));
        }
    };
}

export default Settings;
