const cx = require('classnames');
const Link = require('react-router').Link;
const moment = require('moment-timezone');
const React = require('react');
const _ = require('lodash');

const {Icon} = require('../Icon');
const {Tag} = require('../Tag');

require('./open-session-overview.less');

class OverviewContent extends React.Component {
  render() {
    const {session} = this.props;
    const {description, host, title} = session;
    return (
      <div className="overview-content">
        <h3 className="title">{title}</h3>
        <p className="host-name">with {host.name}</p>
        <p className="overview-description">
          {session.isWorkshop() ? description : host.about}
        </p>
      </div>
      );
  }
}

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

  static displayName = "OpenSessionOverview"

  static propTypes = {
    attending: React.PropTypes.bool,
    config: React.PropTypes.object,
    handleCancelRSVPClick: React.PropTypes.func,
    handleRSVPClick: React.PropTypes.func,
    handleCancelSessionClick: React.PropTypes.func,
    handleCancelAllSessionsClick: React.PropTypes.func,
    handleEditSessionClick: React.PropTypes.func,
    hosting: React.PropTypes.bool,
    previewing: React.PropTypes.bool,
    session: React.PropTypes.object.isRequired,
    user: React.PropTypes.object
  }

  static defaultProps = {
    attending: false,
    hosting: false,
    linkToCalendar: false,
    previewing: false,
    tags: []
  }

  _shouldRenderMobile() {
    return this.props.previewing;
  }

  render() {
    const {
      attending, className, config, hosting, linkTo,
      linkedSession, previewing, session, user
    } = this.props;

    const {
      background_image_url, description, detail_page_url, duration_minutes,
      host, id, project, rsvp_contact_ids, session_type, start_dt_utc, tags,
      title, title_slug
    } = session;

    const style = {
      workshop: {
        backgroundImage: `url(${background_image_url || host.image_url})`,
        backgroundPosition: "50% 50%"},
      qaSession: {backgroundImage: `url(${host.image_url})`}
    }

    return (
      <div
          className={cx(
            "session", {
              "session__past": session.isPast(),
              "render-mobile": this._shouldRenderMobile()
            }, className)}>
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
          {linkTo ?
            <Link
                params={{slug: title_slug, id: id}}
                to={linkTo}>
              <OverviewContent session={session}/>
            </Link>
          : <a href={detail_page_url}>
              <OverviewContent session={session}/>
            </a>
          }
          <div className="session-cta">
            {session.isWorkshop() ?
              this._renderWorkshopCta()
            : this._renderQASessionCtas()
            }
            {!!tags.length &&
              <div className="session-tags">
                {tags.map(
                  (t, idx) => <Tag key={idx} displayName={t} config={config}/>)}
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
    const {linkTo, session} = this.props;
    const {detail_page_url, id, session_type, title_slug} = session;
    return (
      <div className="workshop-cta">
        {linkTo ?
          <Link
              className="button"
              params={{slug: title_slug, id: id}}
              to={linkTo}>
            View details
            <Icon name="navigateright" className="button-right-icon"/>
          </Link>
        : <a
              className="button"
              href={detail_page_url}>
            View details
            <Icon name="navigateright" className="button-right-icon"/>
          </a>
        }
      </div>
      )
  }

  _renderQASessionCtas() {
    const {
      attending, config, handleCancelRSVPClick, handleRSVPClick,
      handleCancelSessionClick, handleCancelAllSessionsClick,
      handleEditSessionClick, hosting, linkToCalendar,
      previewing, session, user
    } = this.props;
    const {detail_page_url, id} = session;

    return (
      <div className="qa-session-ctas">
        {linkToCalendar ?
          <a
              className="button"
              href={detail_page_url}>
            View on calendar
            <Icon name="navigateright" className="button-right-icon"/>
          </a>
        : (
          !user.isActive() ?
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
