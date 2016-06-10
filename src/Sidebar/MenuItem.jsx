const React = require('react');
const classnames = require('classnames');

const Icon = require('../Icon').Icon;

/**
 *  Menu item element
 *  @property classes {String/Object/Array} of classes
 *  @property isActive {Boolean} indictaing if the item is currently active
 */
class MenuItem extends React.Component {
  static propTypes = {
    classes: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object,
        React.PropTypes.array
      ]),
    isActive: React.PropTypes.bool
  }

  render() {
    const {classes, isActive, handleClick} = this.props;
    const itemClasses = classnames(classes, 'menu-item', {'menu-item__active': isActive});

    return (
      <div className={itemClasses} onClick={handleClick}>
        <Icon name="navigateright" alt="Navigate Right" />
        {this.props.children}
      </div>
    );
  }
}


module.exports = MenuItem;
