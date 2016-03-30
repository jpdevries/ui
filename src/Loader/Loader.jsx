const cx = require('classnames');
const React = require('react');

require('./loader.less');

class Loader extends React.Component {
  static displayName = "Loader"

  static propTypes = {
    className: React.PropTypes.string,
    height: React.PropTypes.string
  }

  static defaultProps = {
    height: '60px'
  }

  render() {
    return <div
      className={cx('tui-loader', this.props.className)}
      style={{height: this.props.height}}>
      <svg className="tui-loader-inner" height="25" width="25">
        <circle className="tui-loader-stroke" cx="25" cy="25" r="15" fill="none" strokeWidth="5" strokeMiterlimit="10" />
      </svg>
    </div>;
  }
}

module.exports = {Loader};
