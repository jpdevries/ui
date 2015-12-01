const cx = require('classnames');
const React = require('react');

/**
  This component can act as a wrapper around anything that should behave as
  a social share link.  Currently supports facebook, twitter and linked in.
 */
class SocialShare extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf(['facebook', 'twitter', 'linkedin']),
    handleTrackClick: React.PropTypes.func
  }

  _openSocialShareWindow = (width, height, location) => {
    window.open(location, '',
      `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,` +
      `height=${height},width=${width},left=500`);
    return false;
  }

  _coerceTwitterConfig = (data) => {
    return {
      url: `http://twitter.com/home/?status=${this.props.content}`,
      width: 600,
      height: 250
    }
  }

  _coerceFacebookConfig = (data) => {
    return {
      url: `https://www.facebook.com/sharer/sharer.php?u=${this.props.url}`,
      width: 600,
      height: 300
    }
  }

  _coerceLinkedInConfig = (data) => {
    return {
      url: `http://www.linkedin.com/shareArticle?mini=true&url=${this.props.url}`,
      width: 600,
      height: 300
    }
  }

  _coerceFromType = (type, data) => {
    switch (type) {
    case 'twitter':
      return this._coerceTwitterConfig(data);
      break;
    case 'facebook':
      return this._coerceFacebookConfig(data);
      break;
    case 'linkedin':
      return this._coerceLinkedInConfig(data);
      break;
    default: return {}
    }
  }

  _handleSocialShareClick = () => {
    const {handleTrackClick, type} = this.props;

    handleTrackClick && handleTrackClick();

    const values = this._coerceFromType(type);
    this._openSocialShareWindow(values.width, values.height, values.url);
  }

  render() {
    return <div
        className={cx("social-link-wrapper", this.props.className)}
        onClick={this._handleSocialShareClick}>
      {this.props.children}
    </div>
  }
}

module.exports = {SocialShare}
