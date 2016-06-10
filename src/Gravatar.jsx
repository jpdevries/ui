const cx = require('classnames');
const React = require('react');
const MD5 = require('spark-md5');

const URL = 'https://www.gravatar.com/avatar';

/**
 * Gravatar
 * @property {string} email the users email to use with gravatar
 */
class Gravatar extends React.Component {
    static displayName = "Gravatar"

    static propTypes = {
        email: React.PropTypes.string.isRequired,
        default: React.PropTypes.string,
        size: React.PropTypes.number,
        style: React.PropTypes.object
    }

    static defaultProps = {
        default: 'retro',
        size: 200,
        style: {},
        alt:'Gravatar'
    }

    render() {
        const {className, style, email='', size, alt, ...props} = this.props;
        return <img
            className={cx("gravatar", className)}
            alt={alt}
            src={`${URL}/${MD5.hash(email)}?d=${this.props.default}&s=${size}`}
            style={style || {}}
            {...props}/>
    }
}

export {Gravatar};
