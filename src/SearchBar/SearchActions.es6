const Reflux = require('reflux');
const superagent = require('superagent');

const SearchActions = Reflux.createActions({
  getSuggestions: {asyncResult: true}
});


SearchActions.getSuggestions.listen(function(input, config) {
  superagent.
    get(`http${config.useSSL ? 's' : ''}:${config.projects.url}/api/search/suggest`).
    query({input: input}).
    withCredentials().
    end((error, response) => {
      !error && response.ok ?
        this.completed(response.body)
      : this.failed(error || response);
    });
});


module.exports = {SearchActions}
