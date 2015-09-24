const cx = require('classnames');
const moment = require('moment');
const React = require('react');
const {Icon} = require('../Icon');

class NotificationItem extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleDismiss = this._handleDismiss.bind(this);
  }

  _handleClick(e) {
    this.props.handleClick && this.props.handleClick(e, this.props.id);
  }

  _handleDismiss(e) {
    this.props.handleDismiss && this.props.handleDismiss(e, this.props.id);
  }

  render() {
    const timeDifference = moment.utc(this.props.time).fromNow();
    const debugThis = false;

    return (<li className="tui-notification-item">
      <a onClick={this._handleDismiss} className="tui-notification-item-dismiss">
        <Icon name="close" />
      </a>
      <a onClick={this._handleClick} className="tui-notification-content">
        <time className="tui-notification-time">{timeDifference}</time>
        {debugThis && <pre>{JSON.stringify(this.props)}</pre>}
        <p className="tui-notification-message">{this.props.message}</p>
      </a>
    </li>);
  }
}

module.exports = {NotificationItem};
