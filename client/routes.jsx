const React = require('react');
const Router = require('react-router');
const {IndexRoute, Route, Redirect} = Router;
const {DemoPage} = require('./DemoPage');
const {HomePage} = require('./HomePage');
const {StaticModalPage} = require('./StaticModalPage');

const {
  FourOhFour,
  AppBar
} = require('./../src');

const user = global.__env ? global.__env.user : null;
const config = global.__env ? global.__env.config : null;

class App extends React.Component {
  render() {
    return <div>
      <AppBar config={config} user={user} />
      {React.cloneElement(this.props.children, { user, config })}
    </div>;
  }
}

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={HomePage} />
    <Route path='demo' component={DemoPage}>
      <Route path='modal' component={StaticModalPage} />
    </Route>
    <Route path='*' component={FourOhFour}/>
  </Route>
);

module.exports = {routes};
