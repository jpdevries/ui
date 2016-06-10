const cx = require('classnames');
const React = require('react');
const _ = require('lodash');
const moment = require('moment-timezone');
const uniqueId = require('lodash/utility/uniqueId');

// TUI Components
const {Icon} = require('../Icon');
const {Gravatar} = require('../Gravatar');
const {NavLink} = require('./NavLink');
const {Notifications} = require('./notifications/Notifications');
const {CourseLink} = require('./CourseLink');
const linkSet = require('./linkSet');


/**
 * AppNav
 * @property {} description
 */
class AppNav extends React.Component {
    static propTypes = {
        user: React.PropTypes.object,
        config: React.PropTypes.object.isRequired
    }

    static childContextTypes = {
      user: React.PropTypes.object.isRequired,
    };

    getChildContext() {
      return {
        user: this.props.user,
      }
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
        const navLinks = linkSet.main.filter(link => !link.search);

        return (
            <div className='app-nav-container'>
                <nav onMouseLeave={this._handleMouseLeave}
                     className={navClassName}
                     key="main-navigation"
                     rel="main-navigation">
                    <a href={linkSet.home.url}><div dangerouslySetInnerHTML={{__html: require('./images/white_t_logo.svg')}}>
                    </div></a>
                    <ul className="app-nav-main">
                        {navLinks.map(
                            (link) => <li key={uniqueId('link_')}>
                                <NavLink {...link} /></li>)}
                    </ul>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className="app-nav-list">
                        {navLinks.map(
                            (link) => <li key={uniqueId('link_')}>
                                <NavLink
                                    className="app-nav-link__mobile-only"
                                    {...link} /></li>)}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId('link_')}>
                                <NavLink
                                    className="app-nav-link__in-menu"
                                    {...link}/></li>)}
                    </ul>
                    <Notifications />
                    <a className="app-nav-link app-nav-link__toggle" onClick={this._toggleMenu} aria-label="Toggle Menu">
                        <span alt="Menu" className="app-nav-burger"></span>
                        <Gravatar
                            className="app-nav-gravatar"
                            email=""
                            src={`${config.api.url}/api/hupers/me/avatar`}
                            size={120}/>
                    </a>
                </nav>
            </div>
        )
    }

    renderCourseDropdown() {
      const {config} = this.props;
      const dropdownContentClasses = cx("app-nav-course-dropdown-content",
        {"app-nav-course-dropdown-content__visible" : this.state.isCourseDropdownVisible});

      return (
        <div className="app-nav-course-dropdown">
          <span className='app-nav-link'
                onClick={this._toggleCourseDropdown}>Courses
            <Icon className='app-nav-link-down-arrow' name='navigatedown' alt="Navigate Down" />
          </span>
          <div onMouseEnter={this._handleMouseEnter}
               className={dropdownContentClasses}>
            <div className="app-nav-section-header">Become a developer</div>
            <div className="app-nav-courses">
              <CourseLink href={`${config.www.url}/courses/web-development-career-path/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/career.gz.svg"
                          name="Web Development Career Path" />
            </div>
            <div className="app-nav-section-header">Master a new skill</div>
            <div className="app-nav-courses">
              <CourseLink href={`${config.www.url}/courses/learn-web-development-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/frontend.gz.svg"
                          name="Frontend Development" />
              <CourseLink href={`${config.www.url}/courses/learn-ux-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/uxd.gz.svg"
                          name="User Experience Design" />
              <CourseLink href={`${config.www.url}/courses/learn-angularjs-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/angular.gz.svg"
                          name="Frontend in AngularJS" />
              <CourseLink href={`${config.www.url}/courses/learn-web-design-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/design.gz.svg"
                          name="Modern Web Design" />
              <CourseLink href={`${config.www.url}/courses/learn-python-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/python.gz.svg"
                          name="Programming in Python" />
              <CourseLink href={`${config.www.url}/courses/learn-swift-programming-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/swift.gz.svg"
                          name="iOS Programming in Swift" />
              <CourseLink href={`${config.www.url}/courses/learn-ruby-on-rails-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/ruby.gz.svg"
                          name="Web Development in Rails" />
              <CourseLink href={`${config.www.url}/courses/learn-android-programming-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/android.gz.svg"
                          name="Android Mobile Development" />
              <CourseLink href={`${config.www.url}/courses/learn-nodejs-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/node.gz.svg"
                          name="Backend in Node.js" />
              <CourseLink href={`${config.www.url}/courses/learn-data-science-online/`}
                          icon="//tf-assets-prod.s3.amazonaws.com/wow-next/course-icons/data.gz.svg"
                          name="Data Science in Python" />
            </div>
            <div className="app-nav-courses app-nav-courses__center">
              <CourseLink href={`${config.www.url}/courses/`}
                          name="Explore all courses"
                          arrow={true} />
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
                    <a href={`${linkSet.home.url}/?rel=nav`}>
                      <div dangerouslySetInnerHTML={{__html: require('./images/blue_full_logo.svg')}}/>
                    </a>
                    <ul onMouseEnter={this._handleMouseEnter}
                        className='app-nav-list'>
                        {linkSet.insertCourseDropdown && this.renderCourseDropdown()}
                        {linkSet.insertCourseDropdown && <li key="courseDropdown">
                            <NavLink className='app-nav-link__mobile-only'
                                     displayName='Courses'
                                     url={`${config.www.url}/courses/`} />
                          </li>}
                        {linkSet.menu.map(
                            (link) => <li key={uniqueId('link_')}>
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

        return user && user.tf_login && user.role !== 'guest' ?
            this.renderAuthed(user, config) : this.renderUnauthed(config);
    }
}

module.exports = AppNav;
