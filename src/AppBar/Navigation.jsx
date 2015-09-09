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
            isMenuVisible: false,
            isCourseDropdownVisible: false
        };

        this._toggleMenu = this._toggleMenu.bind(this);
        this._toggleCourseDropdown = this._toggleCourseDropdown.bind(this);
        this._handleMouseEnter = this._handleMouseEnter.bind(this);
        this._handleMouseLeave = this._handleMouseLeave.bind(this);
    }

    _toggleMenu() {
        this.setState({
            isMenuVisible: ! this.state.isMenuVisible
        });
    }

    _toggleCourseDropdown() {
        this.setState({
            isCourseDropdownVisible: ! this.state.isCourseDropdownVisible
        });
    }


    _handleMouseEnter(event) {
        if (this.mouseTimeout) {
            clearTimeout(this.mouseTimeout);
        }
    }

    _handleMouseLeave(event) {
        clearTimeout(this.mouseTimeout);
        this.mouseTimeout = setTimeout(() => {
          this.setState({
            isMenuVisible: false,
            isCourseDropdownVisible: false
          })
        }, 400);
    }

    renderAuthed(user, config) {
        const navClassName = cx(
            'app-nav', {'app-nav__visible': this.state.isMenuVisible});

        return (
            <div className='app-nav-container'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName}
                     key="main-navigation"
                     rel="main-navigation">
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

    renderCourseDropdown() {
      const dropdownContentClasses = cx("app-nav-course-dropdown-content",
        {"app-nav-course-dropdown-content__visible" : this.state.isCourseDropdownVisible});

      return (
        <div className="app-nav-course-dropdown">
          <span className='app-nav-link'
                onClick={this._toggleCourseDropdown}>Courses
            <Icon className='app-nav-link-down-arrow' name='navigatedown' />
          </span>
          <div onMouseEnter={this._handleMouseEnter}
               className={dropdownContentClasses}>
            <div className="subheading">Career Path</div>
            <div className="app-nav-courses">
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/frontend-development-career-path">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/career.svg" />
                <span>Frontend Career Path</span>
              </a>
            </div>
            <div className="subheading">1-on-1 Courses</div>
            <div className="app-nav-courses">
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-web-development-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/frontend.svg" />
                <span>Frontend Development</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-ux-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/uxd.svg" />
                <span>User Experience Design</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-angularjs-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/angular.svg" />
                <span>Frontend in AngularJS</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-web-design-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/design.svg" />
                <span>Modern Web Design</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-python-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/python.svg" />
                <span>Programming in Python</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-swift-programming-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/swift.svg" />
                <span>iOS Programming in Swift</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-ruby-on-rails-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/ruby.svg" />
                <span>Web Development in Rails</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-android-programming-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/android.svg" />
                <span>Android Mobile Development</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-nodejs-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/node.svg" />
                <span>Backend in Node.js</span>
              </a>
              <a className="app-nav-courses-link" href="//www.thinkful.com/courses/learn-data-science-online">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/data.svg" />
                <span>Data Science in Python</span>
              </a>
            </div>
            <div className="subheading">Engineer Workshops</div>
            <div className="app-nav-courses">
              <a className="app-nav-courses-link" href="//projects.thinkful.com/library/node.js/introduction/">
                <img className="app-nav-courses-icon" src="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/node.svg" />
                <span>Node.js Library</span>
              </a>
              <a className="app-nav-courses-link" href="//projects.thinkful.com/library/react/">
                <img className="app-nav-courses-icon" src="https://tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/react.svg" />
                <span>React Library</span>
              </a>
            </div>
          </div>
        </div>);
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
                        {linkSet.insertCourseDropdown && this.renderCourseDropdown()}
                        {linkSet.insertCourseDropdown && <li key="courseDropdown">
                            <NavLink className='app-nav-link__mobile-only'
                                     displayName='Courses'
                                     url='//www.thinkful.com/courses' />
                          </li>}
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
