import React from 'react';
import Button from 'react-bootstrap/lib/Button';
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
  },

  eventClicked: function(event) {
    var eventId = parseInt(event.currentTarget.value);
    var currEvents = this.state.events;
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
        {eventNodes}
      </div>
    );
  }
});

module.exports = FilterEvents;
