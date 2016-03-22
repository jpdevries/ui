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
    data: React.PropTypes.array.isRequired,
    initialSelectedInd: React.PropTypes.number,
    selectedInd: React.PropTypes.number,
    defaultDisplay: React.PropTypes.string,
    handleChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {open: false};
  },

  getDefaultProps() {
    return {data: []};
  },

  componentDidMount() {
    document.addEventListener('click', this._checkClickAway);
  },

  componentWillUnmount() {
    document.removeEventListener('click', this._checkClickAway);
  },

  _checkClickAway(e) {
    if (!ReactDOM.findDOMNode(this.dropdownButton).contains(e.target)) {
      this.setState({open: false});
    }
  },

  _generateNodes() {
    const {data} = this.props;
    return data.map((item, ind) => {
      return (
        <p
          className={cx("dropdown-item", item.className)}
          id={ind}
          key={ind}
          value={item.value || item}>
          {item.displayName || item}
        </p>
      );
    });
  },

  _toggleOpen() {
    this.setState({open: !this.state.open});
  },

  _handleChange(event) {
    let {handleChange} = this.props;
    this._toggleOpen();
    handleChange(event);
  },

  _determineSelectedInd() {
    const { data, initialSelectedInd, selectedInd, value } = this.props;

    // Case 1: selectedInd or initialSelectedInd provided by props
    if (selectedInd || initialSelectedInd) {
      return selectedInd || initialSelectedInd;
    }

    // Case 2: no data provided
    if (!data.length) {
      return -1;
    }

    if (typeof(data[0]) === "object") {
      // Case 3: data is array of objects with {displayName: 'foo', value: 'bar'}
      const values = data.map(item => item.value);
    }
    else {
      // Case 4: data is array of values
      const values = data;
    }

    return data.indexOf(value);
  },

  _getDisplayText() {
    const { data, defaultDisplay } = this.props;
    const selectedInd = this._determineSelectedInd();

    if (selectedInd === -1) {
      return defaultDisplay;
    }

    if (typeof(data[0]) === "object") {
      return data[selectedInd] && data[selectedInd].displayName || defaultDisplay;
    }

    return data[selectedInd]
  },

  render() {
    const { className } = this.props;

    const dropdownClasses = cx(
      'dd-open',
      {hidden: !this.state.open});

    return (
      <div className={cx("dropdown-container", className)}>
        <div
            className="button dd-button"
            onClick={this._toggleOpen}
            ref={c => this.dropdownButton = c}
            data-clickable>
          <span className="dropdown-text">
            {this._getDisplayText()}
          </span>
          <span className="icon-navigatedown" aria-hidden="true"></span>
        </div>
        <div
          className={dropdownClasses}
          onClick={this._handleChange}>
          {this._generateNodes()}
        </div>
      </div>
    );
  }
});

module.exports = Dropdown;
