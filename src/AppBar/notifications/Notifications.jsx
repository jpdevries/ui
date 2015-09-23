const cx = require('classnames');
const React = require('react');
const _ = require('lodash');

const {NotificationView} = require('../../NotificationView');
const {notificationStore} = require('./notificationStore');

/**
 * Notifications
 * @property blob
 */
class Notifications extends React.Component {
    constructor(props) {
        super();
        this.state = {
            unreadCount: 0,
            unseenCount: 0,
            notifications: [],
        }
        this.onStatusChange = this.onStatusChange.bind(this);
        this._handleSeen = this._handleSeen.bind(this);
        this._handleItemClick = this._handleItemClick.bind(this);
        this._handleItemDismiss = this._handleItemDismiss.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = notificationStore.listen(this.onStatusChange);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(bundle) {
        console.log(
            "[Notifications] Received new state from Store: " +
            `${bundle.unseenCount}/${bundle.unreadCount}/${bundle.notifications.length}`);
        this.setState({
            unreadCount: bundle.unreadCount,
            unseenCount: bundle.unseenCount,
            notifications: bundle.notifications,
        });
    }

    _handleItemClick(event, id) {
      const notification = _.find(this.state.notifications, {id: id});
      console.log("Clicked:", notification);
      // Do something if notification has an associated action
    }

    _handleItemDismiss(event, id) {
      console.log("Dismissed:", id);
      // NotificationsActions.markNotifications([id], null);
    }

    _handleSeen() {
      const seenNotificationIds = _.take(
        this.state.notifications, 5).map((n) => n.id);
      // NotificationsActions.markNotifications(null, seenNotificationIds);
    }

    render() {
        return (<NotificationView
          unseenCount={this.state.unseenCount}
          notifications={this.state.notifications}
          handleSeen={this._handleSeen}
          handleItemClick={this._handleItemClick}
          handleItemDismiss={this._handleItemDismiss} /> );
    }
}

module.exports = {Notifications}
