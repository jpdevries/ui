const cx = require('classnames');
const React = require('react');
const {NotificationItem} = require('./NotificationItem');

require('./notifications.less')

class NotificationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.toggle = this.toggle.bind(this);
    this._handleItemClick = this._handleItemClick.bind(this);
    this._handleItemDismiss = this._handleItemDismiss.bind(this);
  }

  toggle() {
    this.setState({visible: !this.state.visible});
  }

  expand() {
    this.setState({visible: true});
  }

  collapse() {
    this.setState({visible: false});
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
    const containerClasses = cx(
      "tui-notification-list-container",
      {"tui-notification-list-container__visible" : this.state.visible }
    )

    return (<div className="tui-notification-view">
      <a onClick={this.toggle} className="tui-notification-toggle">
        {unseenCount}
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
