const cx = require('classnames');
const React = require('react');
const {NotificationItem} = require('./NotificationItem');

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

  _handleItemClick(e, id) {
    this.props.handleItemClick && this.props.handleItemClick(e, id);
  }

  _handleItemDismiss(e, id) {
    this.props.handleItemDismiss && this.props.handleItemDismiss(e, id);
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
      <div className="tui-notification-list-container">
        <ul className="tui-notification-list">
          {notifications.map((notification) => this.renderItem(notification))}
        </ul>
      </div>
    </div>)
  }
}

module.exports = {NotificationView};
