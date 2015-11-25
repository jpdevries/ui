const cx = require('classnames');
const React = require('react');

class OneClickCopy extends React.Component {
  static propTypes = {
    className: React.PropTypes.oneOfType(
            [React.PropTypes.string, React.PropTypes.object]),
    inputText: React.PropTypes.string,
    onCopyClick: React.PropTypes.func,
    onCopyClickSuccess: React.PropTypes.func,
    onCopyClickFail: React.PropTypes.func,
  }

  _handleCopyToClipboard = (event) => {
    const {onCopyClick, onCopyClickSuccess, onCopyClickFail} = this.props;

    event.preventDefault();
    this.refs.copyArea.select();
    onCopyClick();

    try {
      const successful = document.execCommand('copy');
      successful ?
        onCopyClickSuccess()
      : onCopyClickFail();
    } catch (error) {
      onCopyClickFail();
    }
  }

  render() {
    const {className, inputText} = this.props;

    return <div className={cx("one-click-copy", className)}>
      <input
          className="copy-area"
          ref="copyArea"
          onFocus={this._handleInputClick}
          type="text"
          value={inputText}
          readOnly/>
      <div
          className="button copy-button"
          onClick={this._handleCopyToClipboard}>
        Copy
      </div>
    </div>
  }
}

module.exports = {OneClickCopy}
