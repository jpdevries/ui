const React = require('react');
const cx = require('classnames');
const {Icon} = require('../Icon');

require('./modal.less');

/*
 * Two ways to use it.
 *
 * Render plain, without a close= prop, and it will show up
 * as soon as it is rendered, e.g. in a subroute.
 *
 * Render within a {boolean && <Modal close={handlerFunc} />}
 * to show it conditionally on a user action.
 */
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      controlledByParent: !! props.close
    }

    this._closeModal = this._closeModal.bind(this);
  }

  static displayName = "Modal";

  static propTypes = {
      className: React.PropTypes.string,
      close: React.PropTypes.func
  }

  _closeModal() {
    this.setState({isOpen: false});
  }

  render() {
    const {className} = this.props;
    const {controlledByParent, isOpen} = this.state;

    const closeModal = this.props.close || this._closeModal;

    const wrapperClasses = cx("tui-modal-wrapper", {
      "tui-modal-wrapper__hidden": (!controlledByParent) && (!isOpen)
    });
    const modalClasses = cx("tui-modal-content", className);

    return (
      <div className={wrapperClasses}>
        <div className="tui-modal-curtain" onClick={closeModal}/>
        <div className={modalClasses}>
          <a className="tui-modal-close-button" onClick={closeModal}>
            <Icon name="close" alt="Close" />
          </a>
          {this.props.children}
        </div>
      </div>);
  }
}

module.exports = {Modal};
