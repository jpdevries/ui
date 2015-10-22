const cx = require('classnames');
const moment = require('moment-timezone');
const React = require('react');
const _ = require('lodash');

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
  }

  static propTypes = {
    attending: React.PropTypes.bool,
    config: React.PropTypes.object,
    handleCancelRSVPClick: React.PropTypes.func,
    handleRSVPClick: React.PropTypes.func,
    handleCancelSessionClick: React.PropTypes.func,
    handleCancelAllSessionsClick: React.PropTypes.func,
    handleEditSessionClick: React.PropTypes.func,
    handleViewDetailsClick: React.PropTypes.func,
    hosting: React.PropTypes.bool,
    previewing: React.PropTypes.bool,
    session: React.PropTypes.object.isRequired,
    user: React.PropTypes.object
  }

  static defaultProps = {
    attending: false,
    hosting: false,
    linkToCalendar: false,
    previewing: false
  }

  _shouldRenderMobile() {
    return this.props.previewing;
  }

  render() {
    const {
      attending, className, handleViewDetailsClick, hosting, linkedSession,
      previewing, session, user
    } = this.props;

    const {
      background_image_url, description, duration_minutes, host, id, project,
      rsvp_contact_ids, session_type, start_dt_utc, tags, title, title_slug
    } = session;

    const style = {
      workshop: {
        backgroundImage: `url(${background_image_url || host.image_url})`,
        backgroundPosition: "50% 50%"},
      qaSession: {backgroundImage: `url(${host.image_url})`}
    }

    return (
      <div className={cx("session", {"session__past": session.isPast()}, className)}>
        <div className="session-image-wrapper">
          {session.isStartingSoon() &&
            <div className="session-time-alert">Starting soon!</div>
          }
          {session.isHappeningNow() &&
            <div className="session-time-alert">Happening now!</div>
          }
          {linkedSession ?
            <Icon name="navigateright" className="linked-session-icon"/>
          : (attending && <Icon name="alarmclock" className="alarm-icon"/>)
          }
          {!session.isPast() &&
            <div className="session-time">
              {session.startDtLocal(user).format('h:mm A')}&nbsp;&ndash;&nbsp;
              {session.endDtLocal(user).format('h:mm A')}<br/>
              {session.startDtLocal(user).format('MMM Do')}
            </div>
          }
          <div
              className="image-primary"
              style={session.isWorkshop() ? style.workshop : style.qaSession}/>
          {session.isWorkshop() && background_image_url &&
            <img className="image-secondary" src={host.image_url}/>
          }
        </div>

        <div className="session-overview-wrapper">
          <div
              className="overview-content"
              onClick={handleViewDetailsClick}>
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
                  (t, idx) => <div className="topic overview-tag" key={idx}>{t}</div>)}
              </div>
            }
            {rsvp_contact_ids && !!rsvp_contact_ids.length &&
              <div className="session-attendees">
                <Icon name="users"></Icon>
                <span> {rsvp_contact_ids.length} attendee{rsvp_contact_ids.length !== 1 && 's'}</span>
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
        <a className="button" onClick={handleViewDetailsClick}>
          View details
          <Icon name="navigateright" className="button-right-icon"/>
        </a>
      </div>
      )
  }

  _renderQASessionCtas() {
    const {
      attending, config, handleCancelRSVPClick, handleRSVPClick,
      handleCancelSessionClick, handleCancelAllSessionsClick,
      handleEditSessionClick, handleViewDetailsClick, hosting, linkToCalendar,
      previewing, session, user
    } = this.props;
    const {id} = session;

    return (
      <div className="qa-session-ctas">
        {linkToCalendar ?
          <a className="button" onClick={handleViewDetailsClick}>
            View on calendar
            <Icon name="navigateright" className="button-right-icon"/>
          </a>
        : (
          !user ?
            <a className="button" href={`${config.tfl_enroll.url}?rel=qa-session-details`}>
              RSVP
              <Icon name="navigateright" className="button-right-icon"/>
            </a>
          : hosting ?
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
          : attending ?
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
        )}
      </div>
      )
  }
}

module.exports = {OpenSessionOverview};
