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

    return data.map((item, ind) => (
      makeOptions(item,ind,0)
    ));

    function makeOptions(item,ind,depth) {
      let items = [];

      if(item.options !== undefined) {
        var optionsDOM = item.options.map((item, ind) => (
          makeOptions(item,ind,depth + 1)
        ));
        var indent = '';
        for(var i = 0; i < depth; i++) indent += indentation;
        return (
          <optgroup label={indent + item.label}>
            {optionsDOM}
          </optgroup>
        );
      }

      if(typeof(item) !== 'object') { // it is a string
        items.push({
          item:{
            value:item,
            displayName:item
          },ind:ind
        });
      } else {
        if(item.length !== undefined) { // it is an Array
          for(var i = 0; i < item.length; i++) {
            items.push({
              item:{
                value:item[i],
                displayName:item[i]
              },
              ind:ind.toString() + '-' + i.toString()
            });
          }
        } else { // it is an Object
          items.push({
            item:item,
            ind:ind
          });
        }
      }

      // one or more options
      return items.map((data) => (
        <option
          id={data.ind}
          key={data.ind}
          selected={data.item.selected}
          value={data.item.value}>
          {data.item.displayName}
        </option>
      ));
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
        <select className={cx("dropdown-container", className)} onChange={this._handleChange} value={this.state.value}>
          {this._generateNodes()}
        </select>
      </label>
    );
  }
});

module.exports = Dropdown;
