const React = require('react');

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
        const {name='pizza', className='', ...props} = this.props;
        return (
            <span
                aria-hidden='true'
                className={`tui-icon icon-${name} ${className}`}
                {...props}
            />
        )
    }
}

module.exports = {Icon};
