const log = require('debug')('ui:analytics');
const result = require('lodash/object/result');
const Qs = require('qs');

function mergeIntoDict(dest, src) {
    let src = src || {};
    let dest = dest || {};

    for (var key in src) {
        if (!dest.hasOwnProperty(key)) {
            dest[key] = src[key];
        }
    }

    return dest;
}

function track(action, type, data={}) {
    action = `${action}: ${global.__env.config.appDisplayName}-${type}`;
    data = {
        app: result(global.__env.config, 'app.name', '').toLowerCase(),
        appDisplayName: result(global.__env.config, 'app.displayName', '').toLowerCase(),
        ...data
    }

    log(action, data);

    let __env = __env || {};
    data = mergeIntoDict(data, __env.user);
    data = mergeIntoDict(data, Qs.parse(window.location.search));

    global.analytics &&
        global.analytics.track(action, data);
}

function identify(id, traits, options, fn) {
    global.analytics &&
        global.analytics.track.apply(this, arguments);
}

function page(category, name, properties, options, fn) {
    global.analytics &&
        global.analytics.page.apply(this, arguments);
}

module.exports = {
    track: track,
    identify: identify,
    page: page
}
