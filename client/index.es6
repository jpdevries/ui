const React = require('react');
const ReactDOM = require('react-dom');
const { createHistory } = require('history');
const { Router } = require('react-router');
const { routes } = require('./routes');

require('tfstyleguide/core.less');

/*
   Index for the Thinkful UI Demo Page
*/

ReactDOM.render(
  <Router history={createHistory()} routes={routes} />,
  global.document.getElementById('tui-demo-app'));
