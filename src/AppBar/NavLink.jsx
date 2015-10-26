const cx = require('classnames');
const React = require('react');
const {Icon} = require('../Icon');

const {SearchActions, SearchBar} = require('./search');

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

class SearchLink extends React.Component {
    static displayName = "SearchLink";

    static propTypes = {
        displayName: React.PropTypes.string,
        icon: React.PropTypes.string,
        onInput: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {open: false}
    }

    _toggleSearchForm(event) {
        event.preventDefault();
        this.setState({open: !this.state.open});
    }

    render() {
        const {className, config, displayName, icon} = this.props;
        const {open} = this.state;

        return (
            <div className="search-container">
                <a className={cx(className, "app-nav-link")}
                   onClick={e => this._toggleSearchForm(e)}>
                    {icon &&
                        <Icon className="app-nav-icon" name={icon}/>
                    }
                    {displayName
                        && <span className="app-nav-text">{displayName}</span>
                    }
                </a>
                <SearchBar
                        config={config}
                        open={open}/>
            </div>
        )
    }
}

module.exports = {NavLink, SearchLink};
