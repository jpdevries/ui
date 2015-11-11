const React = require('react');
const moment = require('moment-timezone');
const cx = require('classnames');
const _ = require('lodash');

require('./datepicker.less');

/**
 * Day component
 8 @property date {DateTime} of the date to be displayed
 */
class Day extends React.Component {
  static propTypes = {
    day: React.PropTypes.string
  }

  render () {
    const {date, unclickable, otherMonth, active, onClick} = this.props;
    const classes = cx(
      "day",
      {unclickable: unclickable},
      {'other-month': otherMonth},
      {active: active},
      {today: moment().dayOfYear() === moment(date).dayOfYear()});

    const isToday = moment(date).dayOfYear() === moment().dayOfYear();
    const isFirstOfMonth = moment(date).date() === 1;
    const monthName = moment(date).format('MMM')

    return (
      <div
          className={classes}
          onClick={onClick.bind()}>
        {isFirstOfMonth && <div className="day-tiny-text">{monthName}</div>}
        {isToday && <div className="day-tiny-text">Today</div>}

        {moment(date).date()}
      </div>
    );
  }
}


class DatePicker extends React.Component {
  static displayName = "DatePicker"

  constructor() {
    super();
    this.state = {
      visible: false,
      days: [],
      activeIndex: null,
      monthsNavigated: 0
    }
  }

  componentDidMount() {
    this._generateDays(this.props.defaultDate);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.defaultDate.dayOfYear() !== newProps.defaultDate.dayOfYear()) {
      this._generateDays(newProps.defaultDate);
    }
  }

  _generateDays(defaultDate=false) {
    let {monthsNavigated, activeIndex} = this.state;

    // If called on initial render, check defaultDate to determine if calendar
    // should start on a month different than the current one
    if (defaultDate) {
      monthsNavigated = defaultDate.month() - moment().month();
    }

    const startDay = moment().add(monthsNavigated, 'month').
                            startOf('month').startOf('week').startOf('day');
    const endDay = moment().add(monthsNavigated, 'month').
                          endOf('month').endOf('week').startOf('day');
    const totalDays = endDay.diff(startDay, 'days') + 1;


    const days = _.map(Array(totalDays), (i, idx) => {
                  return {
                    dateObj: moment(startDay).add(idx, 'day'),
                    dayOfYear: moment(startDay).add(idx, 'day').dayOfYear()
                  }});

    // Keep existing activeIndex if it is defined and a new defaultDate has not come thru
    activeIndex = (!! defaultDate || ! activeIndex || activeIndex === -1) ?
      _.findIndex(days, {dayOfYear: moment(defaultDate || '').dayOfYear()}) : activeIndex;

    this.setState({
      days: days,
      activeIndex: activeIndex,
      monthsNavigated: monthsNavigated
    });
  }

  _handleClick(event, newDay) {
    const {days} = this.state;
    const {handleChange} = this.props;
    const newActiveIndex = _.findIndex(days, {dayOfYear: newDay});

    this.setState({activeIndex: newActiveIndex});
    this._toggleOpen();

    handleChange(days[newActiveIndex].dateObj);
  }

  _navigateForward() {
    this.state.monthsNavigated = this.state.monthsNavigated + 1;
    this._generateDays();
  }

  _navigateBack() {
    this.state.monthsNavigated = this.state.monthsNavigated - 1;
    this._generateDays();
  }

  _toggleOpen() {
    this.setState({visible: !this.state.visible});
  }

  render() {
    const {className} = this.props;
    const {days, activeIndex, monthsNavigated, visible} = this.state;
    const activeDay = days[activeIndex] && days[activeIndex].dateObj;
    const datePickerClasses = cx('date-picker', {hidden: !visible});

    return (
      <div className={cx("date-picker-container", className)}>
        <div
            className="button date-picker-button"
            onClick={this._toggleOpen.bind(this)}>
          {moment(activeDay).format('MM/DD/YYYY')}
          <span className="icon-navigatedown" aria-hidden="true"></span>
        </div>
        <div className={datePickerClasses}>
        <span
            className="icon-navigateleft" aria-hidden="true"
            onClick={this._navigateBack.bind(this)}></span>
        <span
            className="icon-navigateright" aria-hidden="true"
            onClick={this._navigateForward.bind(this)}></span>
          <div className="selected-day">
            {moment(activeDay).format('dddd, MMMM Do')}
          </div>
          <div className="day-headings">
            {['S', 'M', 'T', 'W', 'H', 'F', 'S'].
              map((day, key) => <div key={key} className="day-heading">{day}</div>)}
          </div>
          <div className="days-container">
            {days.map((day, key) => <Day
              date={day.dateObj}
              key={key}
              active={key===activeIndex}
              otherMonth={day.dateObj.month() !==
                moment().add(monthsNavigated, 'month').month()}
              unclickable={false}
              onClick={event => this._handleClick(event, day.dayOfYear)}/>)}
          </div>
        </div>
      </div>
    );
  }
}

export {DatePicker}
