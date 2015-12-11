import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

import DataService from '../DataService.jsx';

var FilterEvents = React.createClass({

  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return { events: [] }
  },

  componentWillMount: function() {
    this.DataService = DataService();
    // TODO: set this.sortedBoosts[i18n.locale]
  },

  eventClicked: function(event) {
    var eventId = parseInt(event.currentTarget.value);
    var currEvents = this.state.events.concat([]);
    var ix = currEvents.indexOf(eventId);
    if (ix >= 0) {
      currEvents.splice(ix, 1);
    } else {
      currEvents.push(eventId);
    }
    this.setState({ events: currEvents });
    this.props.onEventSelected(currEvents);
  },

  getBtnState: function(eventId) {
    return this.state.events.indexOf(eventId) >= 0 ? 'active' : '';
  },

  clearFilter: function() {
    this.setState({ events: [] });
    this.props.onEventSelected([]);
  },

  clearBtnState: function() {
    return this.state.events.length > 0 ? '' : ' hidden';
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;
    
    // TODO FIXME Russian Event Names!
    var eventNodes = this.DataService.events.map(function(eventName, eventId) {
      return (
        <Button id='snap-filter-btn' value={eventId} key={'event-'+eventId}
                onClick={this.eventClicked}
                className={(() => { return this.getBtnState(eventId) })()}>
          {eventName}
        </Button>
      )
    }, this);

    return (
      <div className='snap-filter'>
        <div className='snap-filter-header'>
          <button type="button" className={"snap-filter-clear-btn"+this.clearBtnState()} onClick={this.clearFilter}>
            <Glyphicon glyph="remove"/>
          </button>
          <span className='snap-filter-headtext'>{i18n.t('filter.events')}</span>
        </div>
        <div className='snap-filter-container'>
          {eventNodes}
        </div>
      </div>
    );
  }
});

module.exports = FilterEvents;
