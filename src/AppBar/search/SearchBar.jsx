const React = require('react');
const cx = require('classnames');

const {Icon} = require('../../Icon');
const {SearchActions} = require('./SearchActions');

const DOWN_ARROW_KEY_CODE = 40;
const UP_ARROW_KEY_CODE = 38;
const ENTER_KEY_CODE = 13;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this._handleFormInput = this._handleFormInput.bind(this);
    this.state = {
      searchTerm: '',
      selectedSuggestionIdx: -1,
      suggestedEnd: '',
      suggestions: []
    }
  }

  componentDidMount() {
    SearchActions.getSuggestions.completed.listen(this._onGetSuggestionsCompleted);
    React.findDOMNode(this.refs.input).
      addEventListener('keydown', e => this._handleKeyDown(e));
  }

  componentWillUnmount() {
    React.findDOMNode(this.refs.input).
      removeEventListener('keydown', e => this._handleKeyDown(e));
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

  _handleFormInput(event) {
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
  }

  _handleSubmitForm = (event) => {
    if (event) {
      event.preventDefault();
    }
    const {config} = this.props;

    window.location = `${config.projects.url}/search?q=${this.state.searchTerm}`;
  }

  render() {
    const {open} = this.props;
    const {
      searchTerm, selectedSuggestionIdx, suggestedEnd, suggestions
    } = this.state;

    return (
      <div className={cx("search-bar", {"search-bar__hidden": !open})}>
        <div className="search-underlay"/>
        <form
            className="search-form"
            onSubmit={this._handleSubmitForm}>
          <h4 className="search-heading">What would you like to learn?</h4>
          <Icon name="search" className="icon-search"/>
          <input
              className="search-input"
              ref="input"
              type="text"
              onChange={this._handleFormInput}
              value={searchTerm}/>
          {searchTerm.length &&
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
                  key={idx}
                  className={cx(
                    "suggestion-item",
                    {"suggestion-item__active": idx === selectedSuggestionIdx})}
                  onClick={e => this._handleSubmitForm(e)}
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
