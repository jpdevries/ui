const moment = require('moment');
const Reflux = require('reflux');
const _ = require('lodash');

const {NotificationActions, userFeed} = require('./NotificationActions');

const USER = global.__env.user;

const notificationStore = Reflux.createStore({
  init() {
    this.notifications = [];
    this.listenTo(
      NotificationActions.fetchNotifications.completed, this._onFetchCompleted);
    this.listenTo(
      NotificationActions.processEvent.completed, this._onUpdateReceived);

    NotificationActions.fetchNotifications();

    userFeed.subscribe(NotificationActions.processEvent).then(()=>{}, this._onError);
  },

  _onFetchCompleted(notifications) {
    console.log("Fetch completed");
    console.log(notifications);
    this.notifications = notifications;
    this.trigger(this.notifications);
  },

  _onUpdateReceived(update) {
    console.log("Update received");
    console.log(update);
    debugger;
    this.notifications = {
        unreadCount: update.unreadCount,
        unseenCount: update.unseenCount,
        notifications: _.sortBy(
            _.filter(
                _(this.notifications.notifications).concat(update.added).value(),
                function(item) {
                    return _.findIndex(
                        _.pluck(update.deleted, 'id'), item.id) === -1 })
            , 'time')}
    this.trigger(this.notifications);
  },

  _onError(error) {
    console.log("An error happened while processing notifications: " + error);
  }

});

module.exports = {notificationStore};
