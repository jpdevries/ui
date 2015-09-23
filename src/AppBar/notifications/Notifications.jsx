const cx = require('classnames');
const React = require('react');

const {notificationStore} = require('./notificationStore');


/**
 * Notifications
 * @property blob
 */
class Notifications extends React.Component {
    //  static propTypes = {
    //      blob: React.PropTypes.object
    //  }

    constructor(props) {
        super();
        this.setState({
            unreadCount: 0,
            unseenCount: 0,
            notifications: [],
        });
        this.onStatusChange = this.onStatusChange.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = notificationStore.listen(this.onStatusChange);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(notifications) {
        console.log("Status change!!!!");
        console.log(notifications);
        this.setState({
            unreadCount: notifications.unreadCount,
            unseenCount: notifications.unseenCount,
            notifications: notifications.notifications,
        });
    }

    render() {
      //const {href, icon, name, arrow} = this.props;

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
                    {this.state? this.state.unreadCount : 0 }
                </a>
            </div>)
    }
}

module.exports = {Notifications}
