const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const {routes} = require('./routes');

require('tfstyleguide/core.less');

/*
   Index for the Thinkful UI Demo Page
*/

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
    ReactDOM.render(
        React.createElement(Handler, {...state, ...global.__env}),
        global.document.getElementById('tui-demo-app'));
});
