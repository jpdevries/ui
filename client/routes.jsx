const React = require('react');
const Router = require('react-router');
const {DefaultRoute, Route, RouteHandler, NotFoundRoute, Redirect} = Router;
const {DemoPage} = require('./DemoPage');
const {HomePage} = require('./HomePage');
const {StaticModalPage} = require('./StaticModalPage');

const {
  FourOhFour,
  AppBar
} = require('./../src');

const USER = global.__env ? global.__env.user : null;
const CONFIG = global.__env ? global.__env.config : null;

class App extends React.Component {
  render() {
    return <div>
      <AppBar user={USER} config={CONFIG}/>
      <RouteHandler user={USER} {...this.props}/>
    </div>;
  }
}

const routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="demo" path="demo" handler={DemoPage}>
      <Route name="modalRoute" path="modal" handler={StaticModalPage} />
    </Route>
    <DefaultRoute name="default" handler={HomePage} />
    <NotFoundRoute handler={FourOhFour}/>
  </Route>
);


module.exports = {routes};
