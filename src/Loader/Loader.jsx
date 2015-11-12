const cx = require('classnames');
const React = require('react');

require('./loader.less');

class Loader extends React.Component {
  static displayName = "Loader"

  static propTypes = {
    className: React.PropTypes.string
  }

  render() {
    return <div
      className={cx('tui-loader', this.props.className || "")}>
      Loading
      <span className="tui-loader-dot"></span>
      <span className="tui-loader-dot"></span>
      <span className="tui-loader-dot"></span>
    </div>;
  }
}

module.exports = {Loader};
