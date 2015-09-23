const Reflux = require('reflux');
const stream = require('getstream');
const _ = require('lodash');

const CONFIG = global.__env.config;
const USER = global.__env.user;

const NotificationActions = Reflux.createActions({
  fetchNotifications: {asyncResult: true},
  markNotifications: {asyncResult: true},
  processEvent: {asyncResult: true},
});

const client = stream.connect(
  CONFIG.vendor.getstream.apiKey, null, CONFIG.vendor.getstream.appId);
const userFeed = client.feed(
  'navbar_notifications',
  (USER? USER.id : 1).toString(),
  CONFIG.vendor.getstream.userFeedToken);

const LIMIT = 10;

const processFetch = function (error, response, body) {
  if (!response || response.status === 200) {
    console.log(body);
    let unread = body.unread;
    let unseen = body.unseen;
    let notifications = _.sortBy(
      _.merge(
        _.flatten(_.pluck(body.results, 'activities')),
        _.map(body.results, function(item) {
          return _.pick(item, ['is_seen', 'is_read']) })),
      'time').reverse()
    /* Sample result
        actor: "Thinkful"
        foreign_id: null
        id: "9fc56050-61a1-11e5-8080-8001719413bb"
        is_read: false
        is_seen: false
        message: "Have opinions? Take our satisfaction survey!"
        object: "Core NPS survey"
        origin: null
        target: null
        time: "2015-09-23T03:17:30.280968"
        verb: "request-nps"
    */

    this.completed({
      unreadCount: unread,
      unseenCount: unseen,
      notifications: notifications})

  } else {
    console.log("[NotificationActions][processFetch] Failure processing...");
    console.log(error);
    console.log(response);
    console.log(body);
    this.failed(error);
  }
}

NotificationActions.fetchNotifications.listen(
  function () {
    userFeed.get({limit: LIMIT}, processFetch.bind(this));
  });


NotificationActions.markNotifications.listen(
  function (markRead, markSeen) {
      userFeed.get(
          {limit: LIMIT, mark_read: markRead, mark_seen: markSeen},
          processFetch.bind(this));
});

NotificationActions.processEvent.listen(
  function (data) {
    console.log("Processing push event..." + data);
    let unread = data.unread;
    let unseen = data.unseen;
    let deleted = _.sortBy(
      _.merge(
        _.flatten(_.pluck(data.deleted, 'activities')),
        _.map(data.deleted, function(item) {
          return _.pick(item, ['is_seen', 'is_read']) })),
      'time')
    let added = _.sortBy(
      _.merge(
        _.flatten(_.pluck(data.new, 'activities')),
        _.map(data.new, function(item) {
          return _.pick(item, ['is_seen', 'is_read']) })),
      'time')
    this.completed({
      unreadCount: unread,
      unseenCount: unseen,
      added: added,
      deleted: deleted});
});

module.exports = {NotificationActions, userFeed};
