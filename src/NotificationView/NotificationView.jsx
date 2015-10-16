const cx = require('classnames');
const React = require('react');
const {NotificationItem} = require('./NotificationItem');
const {Icon} = require('../Icon');
const {AnalyticsAPI} = require('../analytics');

require('./notifications.less')

class NotificationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    console.log('one');
    if (this.props.unreadCount === 0) {
      return;
    }
    if (!this.state.visible) {
      console.log('bell notif');
      this.props.handleSeen && this.props.handleSeen();
    }
    this.setState({visible: !this.state.visible});
  }

  expand() {
    console.log('bell notif2');
    this.props.handleSeen && this.props.handleSeen();
    this.setState({visible: true});
  }

  collapse() {
    console.log('two');
    this.setState({visible: false});
  }

  renderItem(notification) {
    console.log('three');

    return (<NotificationItem
              {...notification}
              handleClick={this.props.handleItemClick}
              handleDismiss={this.props.handleItemDismiss} />);
  }

  renderNotifications(notifications) {
    return notifications.map((notification) => (
             !!notification.is_read ? '' : this.renderItem(notification)));
  }

  renderEmpty() {
    return (<li className="tui-notification-item">
      <div className="tui-notification-content">
        <p className="tui-notification-message">No new notifications! When you receive notifications, they'll show up here.</p>
      </div>
    </li>);
  }

  render() {
    console.log('four');
    const {notifications, unseenCount} = this.props;
    const containerClasses = cx(
      "tui-notification-list-container",
      {"tui-notification-list-container__visible" : this.state.visible }
    )

    const countClasses = cx(
      "tui-notification-count",
      {"tui-notification-count__clear" : unseenCount === 0 }
    )

    const hasNotifications = !_.isEmpty(notifications.filter(notif => ! notif.is_read));

    return (<div className="tui-notification-view">
      <a onClick={this.toggle} className="tui-notification-toggle">
        <span className={countClasses}>
        {unseenCount || <Icon name="notification" />}
        </span>
      </a>
      <div className={containerClasses}>
        <ul className="tui-notification-list">
          {hasNotifications ?
            this.renderNotifications(notifications)
          : this.renderEmpty()}
        </ul>
      </div>
    </div>)
  }
}

module.exports = {NotificationView};
