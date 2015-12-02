const React = require('react');
const { Link } = require('react-router');

const { pathWithSlug } = require('../ProxyPathUtils');

class LinkWithSlug extends React.Component {
  render() {
    const { to, ...otherProps } = this.props;
    return <Link {...otherProps} to={pathWithSlug(to)} />
  }
}

export default { LinkWithSlug }
