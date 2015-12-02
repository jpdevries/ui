const React = require('react');
const classnames = require('classnames');

require('./layout.less');

/**
 *  Base layout for pages that have a sidebar element.
 *  @property sidebarMenu {Component} to go in the sidebar
 */
class SidebarLayout extends React.Component {
  static propTypes = {
    sidebarMenu: React.PropTypes.element
  }

  render() {
    const {sidebarMenu} = this.props;

    return (
      <div className="sidebar-layout-container">
        <div className="sidebar-layout-sidebar">
          {sidebarMenu}
        </div>
        <div className="sidebar-layout-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}


module.exports = SidebarLayout;
