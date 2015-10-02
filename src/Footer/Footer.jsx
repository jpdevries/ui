const React = require('react');
const {Icon} = require('../Icon');

require('./footer.less');

function generateLinkSet(config) {
  return [
    {
      'name': 'Mentors',
      'location': `${config.www.url}/mentors`
    },
    {
      'name': 'Student reviews',
      'location': `${config.www.url}/reviews`
    },
    {
      'name': 'Pricing',
      'location': `${config.www.url}/pricing`
    },
    {
      'name': 'About us',
      'location': `${config.www.url}/about`,
      'subLink':
        {
          'name': "We're hiring!",
          'location': `${config.www.url}/about/#opportunities`
        }
    },
    {
      'name': 'Learning resources',
      'location': `${config.www.url}/learn`
    },
    {
      'name': 'Training for teams',
      'location': `${config.www.url}/teams`
    },
    {
      'name': 'Bootcamp prep',
      'location': `${config.www.url}/bootcamp-prep`
    },
    {
      'name': 'Workshops and office hours',
      'location': `${config.officeHours.url}/workshops`
    },
    {
      'name': 'Blog',
      'location': `//blog.thinkful.com`
    }
  ];
}

class Footer extends React.Component {
  static propTypes = {
    config: React.PropTypes.object
  }

  render() {
    const config = this.props.config || global.__env.config;
    const linkSet = generateLinkSet(config);

    return (
      <div className="footer">
        <div className="footer-centered">
          <div className="footer-site-links">
            <a
                className="button button__white"
                href={`${config.accounts.url}/login`}>
              Sign in
            </a>
            {linkSet.map((link, idx) => {
              return (
                <div className="footer-link" key={idx}>
                  <a className="footer-main-link" href={link.location}>{link.name}</a>
                  {link.subLink &&
                    <a className="footer-sub-link" href={link.subLink.location}>{link.subLink.name}</a>}
                </div>
                )
              })
            }
            <div className="footer-social-links">
              <a
                  className="footer-social-link"
                  href="https://www.facebook.com/thinkfulschool"
                  target="_blank">
                <Icon name="facebook"/>
              </a>
              <a
                  className="footer-social-link"
                  href="https://twitter.com/thinkful"
                  target="_blank">
                <Icon name="twitter"/>
              </a>
            </div>
          </div>
          <div className="footer-contact-links">
            <a
                className="footer-main-link mobile-hidden"
                href="mailto:hello@thinkful.com">
              Email us: hello@thinkful.com
            </a>
            <a
                className="footer-main-link phone-link"
                href="tel:+18583673232">Call us +1 (858) 367-3232</a>
            <div className="copyright mobile-hidden">&copy; 2015 Thinkful, Inc.</div>
            <a
                className="footer-main-link"
                href="https://www.thinkful.com/static/pdfs/Privacy-Policy.pdf">
              Privacy policy
            </a>
            <a
                className="footer-main-link"
                href="https://www.thinkful.com/static/pdfs/Terms-of-Service.pdf">
              Terms of service
            </a>
          </div>
        </div>
      </div>
      );
  }
}

module.exports = {Footer};
