const log = require('debug')('ui:analytics');
const result = require('lodash/object/result');
const Qs = require('qs');
const is = require('is');
const superagent = require('superagent');

const __env = global.__env || {};
const urlParams = Qs.parse(window.location.search);
const appInfo = {
    app: result(__env.config, 'app.name', '').toLowerCase(),
    appDisplayName: result(__env.config, 'app.displayName', '').toLowerCase()
}
const cookies = _.object(_.map(document.cookie.split('; '), function(cookie) {
    let [name, value] = cookie.split('=');
    return [name, decodeURIComponent(value)];
}));

function load(writeKey) {
    if (global.analytics) {
        return global.analytics;
    }

    let head = global.document.head;
    let meta;

    // Select from <meta property="x-tf-segmentio-token" content={writeKey} />
    if (!writeKey) {
        meta = head.querySelector('meta[property=x-tf-segmentio-token]');
        writeKey = meta && meta.content;
    }

    // Select from <meta content="segmentio" data-token={writeKey} />
    if (!writeKey) {
        meta = head.querySelector('meta[content=segmentio]');
        writeKey = meta && meta.dataset.token;

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

console.log(__env);


function tryEmail() {
    // Check if the user is logged in
    if (__env.user && __env.user.tf_login) {
        return __env.user.tf_login;
    }

    // Check the URL parameters
    if (urlParams.email) {
        return decodeURIComponent(urlParams.email).toLowerCase()
    }

    // Check the form fields
    let emailFields = document.querySelectorAll('[name="email"]');
    if (emailFields.length && emailFields[0].value.length) {
        return emailFields[0].value;
    }
}

function fallback(callback, postData) {
    console.log(postData);
    superagent.
        post(`${__env.config.oilbird.url}/echo`).
        send(postData).
        withCredentials().
        end((error, response) => {
            console.log(response);
            typeof callback === 'function' && callback();
        });
}

// This event mirrors the call signature of global.analytics.alias
function alias(to, from, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(from)) fn = from, options = null, from = null;
    if (is.object(from)) options = from, from = null;

    // TODO: Don't alias thinkful.com emails.

    global.analytics &&
        global.analytics.alias(to, from, options, fn);
}


// This event mirrors the call signature of global.analytics.track
function track(event, properties, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(properties)) fn = properties, options = null, properties = null;

    properties = mergeIntoDict(properties, appInfo);
    properties = mergeIntoDict(properties, __env.user);
    properties = mergeIntoDict(properties, urlParams);

    if (global.analytics && global.analytics.initialize) {
        global.analytics.track(event, properties, options, fn);
    } else {
        fallback(fn, {
            'call': 'track',
            'email': tryEmail(),
            'name': event,
            'data': properties
        });
    }
}

// This event mirrors the call signature of global.analytics.identify
function identify(id, traits, options, fn) {
    // Argument reshuffling, from original library.
    if (is.fn(options)) fn = options, options = null;
    if (is.fn(traits)) fn = traits, options = null, traits = null;
    if (is.object(id)) options = traits, traits = id, id = user.id();

    let email = tryEmail();
    if (email && !id) {
        id = email;

        // Check if we previously had a different email on file
        // for the user, and alias this email address to it
        if (cookies.user_email && (email !== cookies.user_email)
                && (cookies.user_email.indexOf('@thinkful.com') > -1)) {
            alias(email, alias.user_email);
        }
    }

    global.analytics &&
        global.analytics.identify(id, traits, options, fn);
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

    properties = mergeIntoDict(properties, appInfo);
    properties = mergeIntoDict(properties, __env.user);

    global.analytics &&
        global.analytics.page(category, name, properties, options, fn);
}

module.exports = {
    track,
    identify,
    page,
    load
}
