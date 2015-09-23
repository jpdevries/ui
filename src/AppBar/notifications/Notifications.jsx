const cx = require('classnames');
const React = require('react');

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

    render() {
      return (
        <div>
            <NotificationsCounter count={this.state.unseenCount} />
            <NotificationsDropdown notifications={this.state.notifications} />
        </div>)
    }
}


class NotificationsCounter extends React.Component {
    static propTypes: {
        count: React.PropTypes.number.isRequired
    }

    render() {
        return (
            <div
                style={{
                    width: '30px',
                    height: '30px',
                    background: '#FFFF99',
                    borderRadius: '50%',
                    verticalAlign: 'center',
                    margin: '0 auto',
                    textAlign: 'center',
                }}>
                <a class="app-nav-link__in-menu app-nav-link">
                    {this.props.count }
                </a>
            </div>)
    }
}


class NotificationsDropdown extends React.Component {
    static propTypes: {
        notifications: React.PropTypes.array.isRequired
    }


    render() {
        return (
            <div>
                { this.props.notifications.map(function(item, idx) {
                    return <NotificationRow notification={item} />;
                })}
            </div>)
    }
}


class NotificationRow extends React.Component {
    static propTypes: {
        notification: React.PropTypes.object.isRequired
    }

    render() {
        return <h1>{this.props.notification.object}</h1>;
    }
}


module.exports = {Notifications}
