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
    'name': 'Pricing',
    'location': `${CONFIG.www.url}/pricing`
  },
  {
    'name': 'Team',
    'location': `${CONFIG.www.url}/about`
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
            <div className="social-links">
              <a
                  className="footer-link-social"
                  href="https://www.facebook.com/thinkfulschool"
                  target="_blank">
                <Icon name="facebook"/>
              </a>
              <a
                  className="footer-link-social"
                  href="https://twitter.com/thinkful"
                  target="_blank">
                <Icon name="twitter"/>
              </a>
            </div>
            <a
                className="button button__white"
                href={`${CONFIG.accounts.url}/login`}>
              Sign in
            </a>
            {linkSet.map(link => <a
                className="footer-link"
                href={link.location}>{link.name}</a>)
            }
          </div>
          <div className="footer-contact-links">
            <a
                className="footer-link"
                href="tel:+18583673232">Call us +1 (858) 367-3232</a>
            <a
                className="footer-link"
                href="https://www.thinkful.com/static/pdfs/Privacy-Policy.pdf">
              Privacy policy
            </a>
            <a
                className="footer-link"
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
