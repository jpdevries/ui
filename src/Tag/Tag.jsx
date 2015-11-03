const cx = require('classnames');
const React = require('react');

class Tag extends React.Component {
  render() {
    const {children, className, config, displayName} = this.props;
    return (
      <a
          className={cx("tui-tag", className)}
          href={`${config.projects.url}/search?q=${displayName}`}>
        {displayName}
        {children}
      </a>
      )
  }
}

module.exports = {Tag}
