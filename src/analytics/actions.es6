const log = require('debug')('ui:analytics');
const result = require('lodash/object/result');
const Qs = require('qs');
const is = require('is');

function mergeIntoDict(dest, src) {
    src = src || {};
    dest = dest || {};

    for (let key in src) {
        if (!dest.hasOwnProperty(key)) {
            dest[key] = src[key];
        }
    }

    return dest;
}

// This event mirrors the call signature of global.analytics.track
function track(event, properties, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(properties)) fn = properties, options = null, properties = null;

    const __env = global.__env || {};

    let appInfo = {
        app: result(__env.config, 'app.name', '').toLowerCase(),
        appDisplayName: result(__env.config, 'app.displayName', '').toLowerCase()
    }

    properties = mergeIntoDict(properties, appInfo);
    properties = mergeIntoDict(properties, __env.user);
    properties = mergeIntoDict(properties, Qs.parse(window.location.search));

    global.analytics &&
        global.analytics.track(event, properties, options, fn);
}

// This event mirrors the call signature of global.analytics.identify
function identify(id, traits, options, fn) {
    // Temporary stub, which can be expanded upon to add data.
    global.analytics &&
        global.analytics.track.apply(this, arguments);
}

// This event mirrors the call signature of global.analytics.page
function page(category, name, properties, options, fn) {
    // Temporary stub, which can be expanded upon to add data.
    global.analytics &&
        global.analytics.page.apply(this, arguments);
}

module.exports = {
    track,
    identify,
    page
}
