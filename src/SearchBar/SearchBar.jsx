const React = require('react');
const cx = require('classnames');

const {Icon} = require('../Icon');
const {SearchActions} = require('./SearchActions');

const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const ENTER_KEY_CODE = 13;

class SearchBar extends React.Component {
  static defaultProps = {
    underlay: false,
    heading: false,
    open: false
  }

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: this.props.initialSearchTerm || '',
      selectedSuggestionIdx: -1,
      suggestions: []
    }
  }

  componentDidMount() {
    SearchActions.getSuggestions.completed.listen(this._onGetSuggestionsCompleted);
    React.findDOMNode(this.refs.input).
      addEventListener('keydown', this._handleKeyDown);

    const underlay = React.findDOMNode(this.refs.underlay);
    underlay && underlay.addEventListener('click', this._handleClickAway);

    this._autoFocus();
  }

  componentWillUnmount() {
    React.findDOMNode(this.refs.input).
      removeEventListener('keydown', this._handleKeyDown);
    React.findDOMNode(this.refs.underlay).
      removeEventListener('click', this._handleClickAway);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open) { this._autoFocus(); }
  }

  _autoFocus = () => {
    React.findDOMNode(this.refs.input).focus()
  }

  _onGetSuggestionsCompleted = response => {
    this.setState({
      suggestions: response,
      selectedSuggestionIdx: !response.length ?
          -1
        : this.state.selectedSuggestionIdx
    });
  }

  _handleClickAway = (event) => {
    const {handleClickAway} = this.props;
    handleClickAway(event);
  }

  _handleFormInput = (event) => {
    SearchActions.getSuggestions(event.target.value, this.props.config);
    this.setState({searchTerm: event.target.value});
  }

  _handleClickSuggestion = (suggestion) => {
    this.setState({searchTerm: suggestion}, () => this._handleSubmitForm());
  }

  _handleKeyDown = (event) => {
    const {searchTerm, selectedSuggestionIdx, suggestions} = this.state;

    if (event.which === DOWN_ARROW_KEY_CODE) {
      this._handleMoveDownSelection();
    }
    else if (event.which === UP_ARROW_KEY_CODE) {
      this._handleMoveUpSelection();
    }
    else if (event.which === ENTER_KEY_CODE) {
      this._handleSubmitForm();
    }
  }

  _handleMoveDownSelection = () => {
    const {selectedSuggestionIdx, suggestions} = this.state;
    const newIdx = Math.min(
        selectedSuggestionIdx + 1, suggestions.length - 1);
    this.setState({
      selectedSuggestionIdx: newIdx,
      searchTerm: suggestions[newIdx].text
    });
  }

  _handleMoveUpSelection = () => {
    const {selectedSuggestionIdx, suggestions} = this.state;
    const newIdx = Math.max(selectedSuggestionIdx - 1, 0);
    this.setState({
      selectedSuggestionIdx: newIdx,
      searchTerm: suggestions[newIdx].text
    });
  }

  _handleSuggestionMouseEnter = (idx) => {
    this.setState({
      selectedSuggestionIdx: idx,
      searchTerm: this.state.suggestions[idx].text
    });
  }

  _handleClearInput = () => {
    this.setState({
      searchTerm: '',
      selectedSuggestionIdx: -1,
      suggestions: []
    });
    this._autoFocus();
  }

  _handleSubmitForm = (event) => {
    if (event) {
      event.preventDefault();
    }
    const {config} = this.props;

    window.location = `${config.projects.url}/search?q=${
      encodeURIComponent(this.state.searchTerm)}`;
  }

  render() {
    const {className, heading, underlay, open} = this.props;
    const {
      searchTerm, selectedSuggestionIdx, suggestions
    } = this.state;

    return (
      <div className={cx("search-bar", className)}>
        {underlay &&
          <div className="search-underlay" ref="underlay"/>}
        <form
            className="search-form"
            onSubmit={this._handleSubmitForm}>
          {!!heading &&
            <h4 className="search-heading">{heading}</h4>}
          <Icon name="search" className="icon-search"/>
          <input
              className="search-input"
              ref="input"
              type="text"
              onChange={this._handleFormInput}
              value={searchTerm}/>
          {!!searchTerm.length &&
            <Icon
                name="close"
                className="icon-close"
                onClick={this._handleClearInput}/>
          }
        </form>
        {!!suggestions.length &&
          <div className="search-suggestions">
            {suggestions.map((term, idx) => (
              <div
                  key={term.text}
                  className={cx(
                    "suggestion-item",
                    {"suggestion-item__active": idx === selectedSuggestionIdx})}
                  onClick={this._handleSubmitForm}
                  onMouseEnter={e => this._handleSuggestionMouseEnter(idx)}>
                <p>{term.text}</p>
              </div>))
            }
          </div>
        }
      </div>
      )
  }
}

module.exports = {SearchBar}
