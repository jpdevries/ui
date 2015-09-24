const cx = require('classnames');
const React = require('react');
const {NotificationItem} = require('./NotificationItem');
const {Icon} = require('../Icon');

require('./notifications.less')

class NotificationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.props.unseenCount === 0) {
      console.log("Should return");
      return;
    }
    if (!this.state.visible) {
      this.props.handleSeen && this.props.handleSeen();
    }
    this.setState({visible: !this.state.visible});
  }

  expand() {
    this.props.handleSeen && this.props.handleSeen();
    this.setState({visible: true});
  }

  collapse() {
    this.setState({visible: false});
  }

  renderItem(notification) {
    return (<NotificationItem
              {...notification}
              handleClick={this.props.handleItemClick}
              handleDismiss={this.props.handleItemDismiss} />);
  }

  render() {
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
          {notifications.map((notification) => this.renderItem(notification))}
        </ul>
      </div>
    </div>)
  }
}

module.exports = {NotificationView};
