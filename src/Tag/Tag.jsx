const cx = require('classnames');
const React = require('react');

class Tag extends React.Component {

  static displayName = 'Tag'

  static propTypes = {
    className: React.PropTypes.string,
    displayName: React.PropTypes.string,
    url: React.PropTypes.string
  }

  render() {
    const {children, className, displayName, url} = this.props;
    return (
      <a
          className={cx("tui-tag", className)}
          href={url}>
        {displayName}
        {children}
      </a>
      )
  }
}

module.exports = {Tag}
