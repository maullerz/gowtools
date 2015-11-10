import React from 'react';
import DataService from '../../DataService.jsx';
import $ from 'jquery';
React.Bootstrap = require('react-bootstrap');
React.Bootstrap.Select = require('./rbs.jsx');

var FilterEvents = React.createClass({
  componentWillMount: function() {
    this.DataService = DataService();
  },

  componentDidMount: function() {
    $('.selectpicker').selectpicker();
    $('body').on('change', '.selectpicker.FilterEvents', this.getSelectedValues, this.props.onChange);
  },

  getSelectedValues: function() {
    var result = [];
    var list = $('.selectpicker.FilterEvents').find("option:selected");
    $.each(list, function(key, value) {
      // log('key:', key, ' value:', value.text);
      result.push(value.text);
    });
    return result;
  },

  render: function() {
    if (!this.DataService || !this.DataService.events) return null;

    var eventNodes = this.DataService.events.map(function(item, index) {
      return <option value={index} key={'event-'+index}>{item}</option>
    });
    setTimeout(function() {
      $('.selectpicker.FilterEvents').selectpicker('refresh')
    }, 100);

    return (
      <React.Bootstrap.Select data-width='25%' className="selectpicker FilterEvents" multiple title='Events'>
        {eventNodes}
      </React.Bootstrap.Select>
    );
  }
});

module.exports = FilterEvents;
