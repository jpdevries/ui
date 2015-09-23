const cx = require('classnames');
const React = require('react');
const NotificationItem = require('./NotificationItem');

require('./notifications.less')

class NotificationView extends React.Component {
  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);
    this._handleItemDismiss = this._handleItemDismiss.bind(this);
  }

  expand() {
  }

  _handleItemClick(e) {
    this.props.handleItemClick && this.props.handleItemClick(e);
  }

  _handleItemDismiss(e) {
    this.props.handleItemDismiss && this.props.handleItemDismiss(e);
  }

  renderItem(notification) {
    return (<NotificationItem
              {...notification}
              handleClick={this._handleItemClick}
              handleDismiss={this._handleItemDismiss} />);
  }

  render() {
    const {notifications, unseenCount} = this.props;

    return (<div className="tui-notification-view">
      <a onClick={this.expand} className="tui-notification-toggle">
        {unseenCount}
      </a>
      <ul className="tui-notification-list">
        {notifications.map((notification) => this.renderItem(notification))}
      </ul>
    </div>)
  }
}
