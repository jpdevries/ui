const React = require('react');

require('./icon.less');

/**
 * Icon
 * @property {String} name  the icon class to use
 */
class Icon extends React.Component {
    static displayName = "Icon"

    static propTypes = {
        name: React.PropTypes.string.isRequired
    }

    render() {
        const {name='pizza', className='', alt, ...props} = this.props;
        let altText = (alt !== undefined) ? <span className="a11y-hidden">&ensp;{alt}</span>  : undefined;

        return (
            <span>
              <span
                  aria-hidden='true'
                  className={`tui-icon icon-${name} ${className}`}
                  {...props}
              />
            {altText}
            </span>
        )
    }
}

module.exports = {Icon};
