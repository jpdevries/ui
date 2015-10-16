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

    return (<div className="tui-notification-view">
      <a onClick={this.toggle} className="tui-notification-toggle">
        <span className={countClasses}>
        {unseenCount || <Icon name="notification" />}
        </span>
      </a>
      <div className={containerClasses}>
        <ul className="tui-notification-list">
          {notifications.map((notification) => (
            !!notification.is_read ? '' : this.renderItem(notification)))}
        </ul>
      </div>
    </div>)
  }
}

module.exports = {NotificationView};
