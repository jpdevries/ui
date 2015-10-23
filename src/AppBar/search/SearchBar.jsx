const React = require('react');
const cx = require('classnames');

const {Icon} = require('../../Icon');
const {SearchActions} = require('./SearchActions');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this._handleFormInput = this._handleFormInput.bind(this);
    this.state = {
      suggestions: []
    }
  }

  componentDidMount() {
    SearchActions.getSuggestions.completed.listen(this._onGetSuggestionsCompleted);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open) {
      this._autoFocus();
    }
  }

  _autoFocus = () => {
    React.findDOMNode(this.refs.input).focus()
  }

  _handleFormInput(event) {
    SearchActions.getSuggestions(event.target.value, this.props.config);
  }

  _onGetSuggestionsCompleted = response => {
    this.setState({suggestions: response});
  }

  render() {
    const {open} = this.props;
    const {suggestions} = this.state;

    return (
      <div className={cx("search-bar", {"search-bar__hidden": !open})}>
        <div className="search-underlay"/>
        <div className="search-form">
          <h4>What would you like to learn?</h4>
          <Icon name="search" className="icon-search"/>
          <input
              className="search-input"
              ref="input"
              type="text"
              onChange={this._handleFormInput}/>
        </div>
      </div>
      )
  }
}

module.exports = {SearchBar}
