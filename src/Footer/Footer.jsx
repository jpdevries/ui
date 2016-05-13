const cx = require('classnames');
const React = require('react');

const {Icon} = require('../Icon');

require('./footer.less');


function generateLinkSet(config) {
  return [
    {
      'heading': 'Courses',
      'links': [
        {
          'name': 'Part Time Career Path',
          'location': `${config.www.url}/courses/web-development-career-path/`,
          'mobile': false
        },
        {
          'name': 'Full Time Career Path',
          'location': `${config.www.url}/courses/full-time-career-path/`,
          'mobile': false
        },
        {
          'name': 'Explore all courses',
          'location': `${config.www.url}/courses/`,
          'mobile': true
        },
        {
          'name': 'Corporate training',
          'location': `${config.www.url}/training-for-teams/`,
          'mobile': true
        },
        {
          'name': 'Bootcamp prep',
          'location': `${config.www.url}/bootcamp-prep/`,
          'mobile': false
        },
        {
          'name': 'Pricing',
          'location': `${config.www.url}/pricing/`,
          'mobile': true
        }
      ]
    },
    {
      'heading': 'Education',
      'links': [
        {
          'name': '1-on-1 mentorship',
          'location': `${config.www.url}/mentorship/`,
          'mobile': false
        },
        {
          'name': 'Career prep',
          'location': `${config.www.url}/career-prep/`,
          'mobile': false
        },
        {
          'name': 'Job guarantee',
          'location': `${config.www.url}/career-path-job-guarantee/`,
          'mobile': false
        },
        {
          'name': 'Student outcomes',
          'location': `${config.www.url}/bootcamp-job-stats/`,
          'mobile': false
        },
        {
          'name': 'Bootcamp Finder',
          'location': `${config.www.url}/bootcamps/`,
          'mobile': true
        },
        {
          'name': 'Learning resources',
          'location': `${config.www.url}/learn/`,
          'mobile': false
        }
      ]
    },
    {
      'heading': 'About',
      'links': [
        {
          'name': 'Mission',
          'location': `${config.www.url}/about/`,
          'mobile': true
        },
        {
          'name': 'Blog',
          'location': 'http://blog.thinkful.com',
          'mobile': true
        },
        {
          'name': 'Careers',
          'location': `${config.www.url}/about/#opportunities`,
          'mobile': false
        },
        {
          'name': 'Mentors',
          'location': `${config.www.url}/mentors/`,
          'mobile': false
        },
        {
          'name': 'Site security',
          'location': `${config.www.url}/responsible-disclosure/`,
          'mobile': true
        },
        {
          'icon': 'facebook',
          'location': 'https://www.facebook.com/thinkfulschool'
        },
        {
          'icon': 'twitter',
          'location': 'https://twitter.com/thinkful'
        }
      ]
    }
  ];
}

class Footer extends React.Component {
  static propTypes = {
    config: React.PropTypes.object,
  }

  render() {
    const { user={} } = this.props;
    const config = this.props.config || global.__env.config;
    const linkSet = generateLinkSet(config);

    return (
      <div className="footer-container">
        <footer className="footer">
          <div className="site-links">
            {linkSet.map(section => <div className="footer-column">
                <h4 className="footer-heading">{section.heading}</h4>
                {section.links.map(link => (
                  <a
                      className={cx("footer-link", {icon: link.icon})}
                      href={link.location}>
                    {link.icon ?
                      <Icon name={link.icon}/>
                    : link.name}
                  </a>))
                }
              </div>)
            }
          </div>
          <div className="timezone">
            All times are in {user.timezone}&nbsp;&nbsp;
            <a href={`${config.settings.url}/profile`}>Change</a>
          </div>
          <div className="legal-links">
            <span>&copy; Thinkful, Inc.</span>&nbsp;·&nbsp;
            <span>
              <a
                  className="footer-link"
                  href={`${config.www.url}/static/pdfs/Terms-of-Service.pdf`}>
                Terms of use
              </a>
            </span>&nbsp;·&nbsp;
            <span>
              <a
                  className="footer-link"
                  href={`${config.www.url}/static/pdfs/Privacy-Policy.pdf`}>
                Privacy policy
              </a>
            </span>&nbsp;·&nbsp;
            <span>
              <a
                  className="footer-link"
                  href={`${config.www.url}/support`}>
                Support
              </a>
            </span>
          </div>
        </footer>
      </div>
      );
  }
}

module.exports = {Footer};
