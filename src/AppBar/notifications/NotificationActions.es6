const Reflux = require('reflux');
const stream = require('getstream');

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
    this.completed({
      unreadCount: 1,
      unseenCount: 1,
      notifications: [
        {'actor': 'Thinkful', 'verb': 'request-nps', 'object': 'Pretty please'}]})
  } else {
    console.log("Failure processing Streams");
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
    console.log("Processing push event...");
    processFetch(data);
});

module.exports = {NotificationActions, userFeed};
