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
      name: React.PropTypes.string
    }

    render() {
      const {href, icon, name} = this.props;

      return (<a className="app-nav-courses-link" href={href + '?rel=nav'}>
        <img className="app-nav-courses-icon" src={icon} />
        <span>{name}</span>
      </a>)
    }
}

module.exports = {CourseLink}
