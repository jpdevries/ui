const cx = require('classnames');
const React = require('react');
const ReactDOM = require('react-dom');

require('./dropdown.less');


/**
 * Shared dropdown menu element
 * @property data {Array} of items to display in the dropdown,
      containing `value` and `displayName`
 * @property selectedInd {Int} of the selected index in the list
 * @property defaultDisplay {String} of default value that should be displayed
 * @property handleChange {Function} to handle dropdown click/change
 */
const Dropdown = React.createClass({

  propTypes: {
    data: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string, React.PropTypes.object
      ])).isRequired,
    handleChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {value:undefined};
  },

  getDefaultProps() {
    return {
      data: [],
      label:'',
      indentation:' • '
    };
  },

  _generateNodes() {
    let {data} = this.props;
    let {indentation} = this.props;

    return data.map((item) => (
      makeOptions(item,0)
    ));

    function makeOptions(item,depth) {
      let items = [];

      if(_.has(item, 'options')) {
        var optionsDOM = item.options.map((item, ind) => (
          makeOptions(item,depth + 1)
        ));
        var indent = '';
        for(var i = 0; i < depth; i++) indent += indentation;
        return (
          <optgroup label={indent + item.label}>
            {optionsDOM}
          </optgroup>
        );
      }

      if(_.isString(item)) { // it is a string
        items.push({
          item:{
            value:cssSafe(item),
            displayName:item
          }
        });
      } else {
        if(_.isArray(item)) { // it is an Array of strings
          _.each(item, function(item) {
            items.push({
              item:{
                value:cssSafe(item),
                displayName:item
              }
            });
          })
        } else { // it is a simple Object
          items.push({ item:item });
        }
      }

      // one or more options
      return items.map((data) => (
        <option
          key={data.item.value}
          label={data.item.label}
          selected={data.item.selected}
          value={data.item.value}>
          {data.item.displayName}
        </option>
      ));

      function cssSafe(name) {
        return name.toLowerCase().replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
      }
    }
  },

  _handleChange(event) {
    let {handleChange} = this.props;
    this.setState({value: event.target.value});
    handleChange(event);
  },

  render() {
    const { className } = this.props;
    let { label } = this.props;

    return (
      <label>
        {label}
        <div className={cx("dropdown-container", className)}>
          <select onChange={this._handleChange} value={this.state.value}>
            {this._generateNodes()}
          </select>
        </div>
      </label>
    );
  }
});

module.exports = Dropdown;
