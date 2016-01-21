const log = require('debug')('ui:analytics');
const Qs = require('qs');
const is = require('is');
const superagent = require('superagent');

const get = require('lodash/object/get')
const defaults = require('lodash/object/defaults')
const zipObject = require('lodash/array/zipObject');
const map = require('lodash/collection/map');

const __env = global.__env || {};
const urlParams = Qs.parse((window.location.search || "").substring(1));
const appInfo = {
    app: get(__env, 'config.app.name', '').toLowerCase(),
    appDisplayName: get(__env, 'config.app.displayName', '').toLowerCase(),
    uiAnalytics: true
}
const cookies = zipObject(map(document.cookie.split('; '), function(cookie) {
    let [name, value] = cookie.split('=');
    return [name, decodeURIComponent(value)];
}));

// Lots of ways of trying to find the user's email
function tryEmail() {
    // Check if the user is logged in
    if (get(__env, 'user.tf_login')) {
        return __env.user.tf_login;
    }

    // Check the URL parameters
    if (urlParams.email) {
        return decodeURIComponent(urlParams.email).toLowerCase()
    }

    // Try the cookies
    if (cookies.user_email) {
        return cookies.user_email;
    }

    // Check the form fields
    const emailFields = document.querySelectorAll('[name="email"]');
    if (emailFields.length && emailFields[0].value.length) {
        return emailFields[0].value;
    }
}

// Failsafe for if segment breaks for some reason
function fallback(callback, postData) {
    superagent.
        post(`${__env.config.oilbird.url}/echo`).
        send(postData).
        withCredentials().
        end((error, response) => {
            is.fn(callback) && callback();
        });
}

function mountSegmentIO() {
    let analytics = global.analytics = global.analytics || [];
    if (!analytics.initialize) {
        if (analytics.invoked) global.console && console.error && console.error("Segment snippet included twice.");
        else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "group", "track", "ready", "alias", "page", "once", "off", "on"];
            analytics.factory = function(t) {
                return function() {
                    let e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics
                }
            };
            for (let t = 0; t < analytics.methods.length; t++) {
                let e = analytics.methods[t];
                analytics[e] = analytics.factory(e)
            }
            analytics.load = function(t) {
                let e = global.document.createElement("script");
                e.type = "text/javascript";
                e.async = !0;
                e.src = ("https:" === global.document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                let n = global.document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e, n)
            };
            analytics.SNIPPET_VERSION = "3.0.1";
        }
    }

    return analytics;
}

function load(writeKey) {
    if (global.analytics) {
        return global.analytics;
    }

    const head = global.document.head;

    // Select from <meta property="x-tf-segmentio-token" content={writeKey} />
    if (!writeKey) {
        const meta = head.querySelector('meta[property=x-tf-segmentio-token]');
        writeKey = meta && meta.content;
    }

    // Select from <meta content="segmentio" data-token={writeKey} />
    if (!writeKey) {
        const meta = head.querySelector('meta[content=segmentio]');
        writeKey = meta && get(meta, 'dataset.token');
    }

    // Select from __env
    if (!writeKey && get(__env, 'config.vendor.segment.token')) {
        writeKey = __env.config.vendor.segment.token;
    }

    // Raise visibility of error… analytics are important
    if (!writeKey) {
        throw new Error('SegmentIO write key is undefined');
    }

    // Mount segment script and global analytics object
    mountSegmentIO();
    // Configure with write key
    global.analytics.load(writeKey);

    return global.analytics;
}

// This event mirrors the call signature of global.analytics.identify
function identify(id, traits, options, fn) {
    if (appInfo.app != 'hawk') {
        log('Identify should only be called on login.');
        return;
    }

    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(traits)) fn = traits, options = null, traits = null;
    if (is.object(id)) options = traits, traits = id, id = user.id();

    let email = tryEmail();

    traits = defaults(traits || {}, appInfo);

    // We don't want to overwrite the mixpanel ID
    if (id && is.email(id)) {
        traits.email = id;
        id = null;
    }

    global.analytics &&
        global.analytics.identify(id, traits, options, fn);
}

// This event mirrors the call signature of global.analytics.alias
function alias(to, from, options, fn) {
    if (appInfo.app != 'tailorbird') {
        log('Alias should only be called on account creation.');
        return;
    }

    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(from)) fn = from, options = null, from = null;
    if (is.object(from)) options = from, from = null;

    // Aliasing Thinkful emails is dangerous, as we impersonate
    if (to && to.indexOf('@thinkful.com') == -1 &&
            (!from || from.indexOf('@thinkful.com') == -1)) {

        global.analytics &&
            global.analytics.alias(to, from, options, fn);
    }
}


// This event mirrors the call signature of global.analytics.track
function track(event, properties, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(properties)) fn = properties, options = null, properties = null;

    properties = defaults(properties || {}, appInfo, __env.user, urlParams);

    if (get(global, 'analytics.initialize')) {
        global.analytics.track(event, properties, options, fn);
    } else {
        fallback(fn, {
            'call': 'track',
            'email': tryEmail(),
            'event': event,
            'properties': properties
        });
    }
}

// This event mirrors the call signature of global.analytics.page
function page(category, name, properties, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(properties)) fn = properties, options = properties = null;
    if (is.fn(name)) fn = name, options = properties = name = null;
    if (is.object(category)) options = name, properties = category, name = category = null;
    if (is.object(name)) options = properties, properties = name, name = null;
    if (is.string(category) && !is.string(name)) name = category, category = null;

    properties = defaults(properties || {}, appInfo, __env.user);

    global.analytics &&
        global.analytics.page(category, name, properties, options, fn);
}

module.exports = {
    load,
    identify,
    alias,
    track,
    page
}
