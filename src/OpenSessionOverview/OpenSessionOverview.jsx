const cx = require('classnames');
const moment = require('moment-timezone');
const React = require('react');
const _ = require('lodash');
const $ = require('jquery');

const {Icon} = require('../Icon');

require('./open-session-overview.less');

/**
 * OpenSessionOverview component
 */
class OpenSessionOverview extends React.Component {
  constructor(props) {
    super(props);
    this._renderQASessionCtas = this._renderQASessionCtas.bind(this);
    this._renderWorkshopCta = this._renderWorkshopCta.bind(this);
    this._shouldRenderMobile = this._shouldRenderMobile.bind(this);
    this._scrollToSession = this._scrollToSession.bind(this);
  }

  static propTypes = {
    handleCancelRSVPClick: React.PropTypes.func,
    handleRSVPClick: React.PropTypes.func,
    handleCancelSessionClick: React.PropTypes.func,
    handleCancelAllSessionsClick: React.PropTypes.func,
    handleEditSessionClick: React.PropTypes.func,
    handleViewDetailsClick: React.PropTypes.func,
    session: React.PropTypes.object,
    user: React.PropTypes.object
  }

  componentDidMount() {
    const node = React.findDOMNode(this.refs.session);
    if (node.classList.contains('session__linked')) {
      this.linkedSessionTimeout = window.setTimeout(() => (
        node.classList.remove('session__linked')), 15000);
      this._scrollToSession();
    }
  }

  componentWillUnmount() {
    if (this.linkedSessionTimeout) {
      window.clearTimeout(this.linkedSessionTimeout);
    }
  }

  componentWillReceiveProps(newProps) {
    const oldLinked = this.props.linkedSession;
    const newLinked = newProps.linkedSession;
    if (!oldLinked && newLinked) {
      this._scrollToSession();
    }
  }

  _scrollToSession() {
    const node = React.findDOMNode(this.refs.session);
    $('html,body').animate({
      scrollTop: node.offsetTop
    }, 500);
  }

  _shouldRenderMobile() {
    const {previewing} = this.props;
    return previewing;
  }

  render() {
    const {
      className, handleViewDetailsClick, linkedSession,
      previewing, session, user} = this.props;
    const {
      background_image_url, description, duration_minutes, host, id, project,
      rsvp_contact_ids, session_type, start_dt_utc, tags, title, title_slug
    } = session;

    const isHost = user.tf_login === host.tf_login;
    const userIsAttending = !previewing && user.exists() &&
      rsvp_contact_ids.indexOf(user.contact_id) > -1;

    const startDtText = session.startDtLocal(user).format('h:mm A');
    const endDtText = session.endDtLocal(user).format('h:mm A');

    // Use workshop image if it's provided. Allow fallback to project image if
    // one exists.
    const backgroundImageUrl = (
      background_image_url ||
      (project && project.background_image_url) ||
      '/static/assets/default_workshop_image.png');

    const style = {
      workshop: {
        backgroundImage: `url(${backgroundImageUrl || host.image_url})`,
        backgroundPosition:
          `${!background_image_url && project && project.image_offset_x || 0}px
          ${!background_image_url && project && project.image_offset_y || 0}px`},
      qaSession: {backgroundImage: `url(${host.image_url})`}
    }

    return (
      <div
          className={cx(
            "session", {
              "session__linked": linkedSession,
              "render-mobile": this._shouldRenderMobile()
            },
            className)}
          ref="session">
        <div className="session-image-wrapper">
          {session.isStartingSoon() &&
            <div className="session-time-alert">Starting soon!</div>}
          {session.isHappeningNow() &&
            <div className="session-time-alert">Happening now!</div>}
          {linkedSession ?
            <Icon name="navigateright" className="linked-session-icon"/>
          : (
            userIsAttending && <Icon name="alarmclock" className="alarm-icon"/>)}
          <div className="session-time">
            {startDtText} &ndash; {endDtText}<br/>
            {session.startDtLocal(user).format('MMM Do')}
          </div>
          <div
              className="image-primary"
              style={session.isWorkshop() ? style.workshop : style.qaSession}/>
          {backgroundImageUrl && session.isWorkshop() &&
            <img className="image-secondary" src={host.image_url}/>}
        </div>

        <div className="session-overview-wrapper">
          <div
              className="overview-content"
              onClick={e => handleViewDetailsClick(session_type, title_slug, id)}>
            <h3 className="title">{title}</h3>
            <p className="host-name">with {host.name}</p>
            <p className="overview-description">
              {session.isWorkshop() ? description : host.about}
            </p>
          </div>
          <div className="session-cta">
            {session.isWorkshop() ?
              this._renderWorkshopCta()
            : this._renderQASessionCtas()
            }
            {!!tags.length &&
              <div className="session-tags">
                {tags.map(
                  (t, idx) => <div className="topic detail-page-topic" key={idx}>{t}</div>)}
              </div>
            }
            {rsvp_contact_ids && !!rsvp_contact_ids.length && 
              <div className="session-attendees">
                <Icon name="users"></Icon>
                <span> { rsvp_contact_ids.length } attendee{rsvp_contact_ids.length !== 1 && 's'}</span>
              </div>}
          </div>
        </div>
      </div>
    )
  }

  _renderWorkshopCta() {
    const {handleViewDetailsClick, session} = this.props;
    const {id, session_type, title_slug} = session;
    return (
      <div className="workshop-cta">
        <a
            className="button"
            onClick={e => handleViewDetailsClick(session_type, title_slug, id)}>
          View details
          <Icon name="navigateright" className="button-right-icon"/>
        </a>
      </div>
      )
  }

  _renderQASessionCtas() {
    const {
      config, handleCancelRSVPClick, handleRSVPClick, handleCancelSessionClick,
      handleCancelAllSessionsClick, handleEditSessionClick, previewing, session,
      user
    } = this.props;
    const {id} = session;

    return (
      <div className="qa-session-ctas">
        {
          !user.exists() ?
            <a className="button" href={`${config.tfl_enroll.url}?rel=qa-session-details`}>
              RSVP
              <Icon name="navigateright" className="button-right-icon"/>
            </a>
          : session.userIsHost(user) ?
            <div className="host-ctas">
              <a
                  className={cx(
                    "button button__black button__black__host",
                    {"disabled": previewing})}
                  href={session.session_room_url}>
                Go to room
                <Icon name="navigateright" className="button-right-icon"/>
              </a>
              {!previewing &&
                <div>
                  <a onClick={e => handleEditSessionClick(id)}>Edit</a>{' / '}
                  <a onClick={e => handleCancelSessionClick(id)}>Cancel</a>
                  {!!session.blueprint_id &&
                    <span>{' / '}
                      <a onClick={e => handleCancelAllSessionsClick(id)}>
                        Cancel all
                      </a>
                    </span>
                  }
                </div>
              }
            </div>
          : session.isUpcoming() ?
            <a className="button button__black" href={session.session_room_url}>
              Go to room
              <Icon name="navigateright" className="button-right-icon"/>
            </a>
          : session.userIsAttending(user) ?
            <div className="user-attending">
              <h5>Your spot is reserved</h5>
              <a href={session.session_room_url}>Go to room</a>
              {' / '}
              <a onClick={e => handleCancelRSVPClick(id)}>Cancel reservation</a>
            </div>
          : <div className="button" onClick={e => handleRSVPClick(id)}>
              RSVP
              <Icon name="navigateright" className="button-right-icon"/>
            </div>
        }
      </div>
      )
  }
}

module.exports = {OpenSessionOverview};
