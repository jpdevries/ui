const cx = require('classnames');
const React = require('react');
const uniqueId = require('lodash/utility/uniqueId');

// TUI Components
const {Icon} = require('../Icon');
const {Gravatar} = require('../Gravatar');
const {NavLink} = require('./NavLink');
const linkSet = require('./linkSet');


/**
 * AppNav
 * @property {} description
 */
class AppNav extends React.Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        config: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            isMenuVisible: false
        };

        this._toggleMenu = this._toggleMenu.bind(this);
        this._handleMouseEnter = this._handleMouseEnter.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
    }

    _toggleMenu() {
        this.setState({
            isMenuVisible: ! this.state.isMenuVisible
        });
    }

    _handleMouseLeave(event) {
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {this._hideMenu()}, 360);
    }

    _handleMouseEnter(event) {
        if (this.mouseTimeout) {
            clearTimeout(this.mouseTimeout);
        }
    }

    _hideMenu() {
        this.setState({ isMenuVisible: false });
    }

    renderAuthed(user, config) {
        const navClassName = cx(
            'app-nav', {'app-nav__visible': this.state.isMenuVisible});

        return (
            <div className='app-nav-container'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName} rel="main-navigation">
                    <a href={linkSet.home.url}><div dangerouslySetInnerHTML={{__html: require('./images/white_t_logo.svg')}}>
                    </div></a>
                    <ul className="app-nav-main">
                        {linkSet.main.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink {...link} /></li>)}
                    </ul>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className="app-nav-list">
                        {linkSet.main.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className="app-nav-link__mobile-only"
                                    {...link} /></li>)}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className="app-nav-link__in-menu"
                                    {...link}/></li>)}
                    </ul>
                    <a className="app-nav-link app-nav-link__toggle" onClick={this._toggleMenu}>
                        <span alt="Menu" className="app-nav-burger"></span>
                        <Gravatar className="app-nav-gravatar" email={user.tf_login} size={120}/>
                    </a>
                </nav>
            </div>
        )
    }

    renderUnauthed(config) {
        const navClassName = cx(
            'app-nav', {'app-nav__visible': this.state.isMenuVisible});

        return (
            <div className='app-nav-container app-nav-container__unauthed'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName} rel="main-navigation">
                    <a href={linkSet.home.url}><div dangerouslySetInnerHTML={{__html: require('./images/blue_full_logo.svg')}}>
                    </div></a>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className='app-nav-list'>
                        {linkSet.main.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className='app-nav-link__mobile-only'
                                    {...link} /></li>)}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId(link)}>
                                <NavLink
                                    className='app-nav-link__in-menu'
                                    {...link}/></li>)}
                    </ul>
                    <a className='app-nav-link app-nav-link__toggle' onClick={this._toggleMenu}>
                        <span alt='Menu' className='app-nav-burger'></span>
                    </a>
                </nav>
            </div>
        )
    }

    render() {
        const {user, config} = this.props;

        return user && user.tf_login ?
            this.renderAuthed(user, config) : this.renderUnauthed(config);
    }
}

module.exports = AppNav;
