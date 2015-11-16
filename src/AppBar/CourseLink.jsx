const cx = require('classnames');
const React = require('react');


/**
 * CourseLink
 * @property href
 */
class CourseLink extends React.Component {
    static displayName = "CourseLink";
    static propTypes = {
      href: React.PropTypes.string,
      icon: React.PropTypes.string,
      name: React.PropTypes.string,
      arrow: React.PropTypes.bool
    }

    render() {
      const {href, icon, name, arrow} = this.props;

      return (<a className="app-nav-courses-link" href={href + '?rel=nav'}>
        {icon && <img className="app-nav-courses-icon" src={icon} />}
        <span className="app-nav-courses-link-text">{name}</span>
        {arrow && <span className="icon-navigateright" />}
      </a>)
    }
}

module.exports = {CourseLink}
