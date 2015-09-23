const moment = require('moment');
const Reflux = require('reflux');
const _ = require('lodash');

const {NotificationActions, userFeed} = require('./NotificationActions');

const USER = global.__env.user;

const notificationStore = Reflux.createStore({
  init() {
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
    this.trigger(notifications);
  },

  _onUpdateReceived(update) {
    console.log("Update received");
    console.log(update);
    this.trigger(update);
  },

  _onError(error) {
    console.log("An error happened while processing notifications: " + error);
  }

});

module.exports = {notificationStore};
