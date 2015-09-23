const cx = require('classnames');
const React = require('react');

const notificationStore = require('./notificationStore');


/**
 * Notifications
 * @property blob
 */
class Notifications extends React.Component {
    static displayName = "Notifications";
    static propTypes = {
        blob: React.PropTypes.object
    }

    constructor(props) {
        super();
        this.state = {
            unreadCount: 0,
            unseenCount: 0,
            notifications: [],
        }
    }

    componentDidMount: function() {
        this.unsubscribe = notificationStore.listen(this.onStatusChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    onStatusChange: function(notifications) {
        this.setState({
            unreadCount: notifications.unreadCount,
            unseenCount: notifications.unseenCount,
            notifications: notifications.notifications,
        }
);
    },

    render() {
      //const {href, icon, name, arrow} = this.props;

        return (
            <li>
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
                        {this.state.unreadCount }
                    </a>
                </div>
            </li>)
    }
}

module.exports = {Notifications}
