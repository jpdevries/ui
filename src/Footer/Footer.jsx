const React = require('react');
const {Icon} = require('../Icon');

const CONFIG = global.__env.config;

require('./footer.less');

const linkSet = [
  {
    'name': 'Mentors',
    'location': `${CONFIG.www.url}/mentors`
  },
  {
    'name': 'Student reviews',
    'location': `${CONFIG.www.url}/reviews`
  },
  {
    'name': 'Pricing',
    'location': `${CONFIG.www.url}/pricing`
  },
  {
    'name': 'About us',
    'location': `${CONFIG.www.url}/about`,
    'subLink':
      {
        'name': "We're hiring!",
        'location': `${CONFIG.www.url}/about/#opportunities`
      }
  },
  {
    'name': 'Learning resources',
    'location': `${CONFIG.www.url}/learn`
  },
  {
    'name': 'Training for teams',
    'location': `${CONFIG.www.url}/teams`
  },
  {
    'name': 'Bootcamp prep',
    'location': `${CONFIG.www.url}/bootcamp-prep`
  },
  {
    'name': 'Workshops and office hours',
    'location': `${CONFIG.officeHours.url}/workshops`
  },
  {
    'name': 'Blog',
    'location': `//blog.thinkful.com`
  }
];

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <div className="footer-centered">
          <div className="footer-site-links">
            <a
                className="button button__white"
                href={`${CONFIG.accounts.url}/login`}>
              Sign in
            </a>
            {linkSet.map(link => {
              return (
                <div className="footer-link">
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
