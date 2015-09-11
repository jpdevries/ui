const cx = require('classnames');
const React = require('react');
const {Icon} = require('../Icon');

/**
 * NavLink
 * @property {} description
 */
class NavLink extends React.Component {
    static displayName = "NavLink";
    static propTypes = {
        active: React.PropTypes.bool,
        displayName: React.PropTypes.string,
        icon: React.PropTypes.string,
        url: React.PropTypes.string.isRequired
    }

    render() {
        const {url, active, className, external, displayName, icon} = this.props;

        return (
            <a className={cx({active}, className, "app-nav-link")}
               href={url + '?rel=nav'}
               target={external ? "_blank" : "_self"}>
                {icon &&
                    <Icon className="app-nav-icon" name={icon}/>
                }
                {displayName
                    && <span className="app-nav-text">{displayName}</span>
                }
            </a>
        )
    }
}

module.exports = {NavLink};
