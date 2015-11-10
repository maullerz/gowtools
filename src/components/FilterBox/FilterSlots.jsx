import React from 'react';
import $ from 'jquery';
React.Bootstrap = require('react-bootstrap');
React.Bootstrap.Select = require('./rbs.jsx');

var FilterSlots = React.createClass({
  componentDidMount: function() {
    $('.selectpicker').selectpicker();
    $('body').on('change', '.selectpicker.FilterSlots', this.getSelectedValues, this.props.onChange);
    // setTimeout(function() {
    //   $('.selectpicker.FilterSlots').val(['Helm']);
    //   $('.selectpicker.FilterSlots').trigger('change');
    //   $('.selectpicker.FilterSlots').selectpicker('refresh');
    // }, 1500);
  },
  getSelectedValues: function() {
    var result = [];
    var list = $('.selectpicker.FilterSlots').find("option:selected");
    $.each(list, function(key, value) {
      result.push(list[key].value);
    });
    return result;
  },
  render: function() {
    return (
      <React.Bootstrap.Select data-width='25%' className="selectpicker FilterSlots" multiple title='Slots'>
        <option>Helm</option>
        <option>Armor</option>
        <option>Feet</option>
        <option>Weapon</option>
        <option>Accessory</option>
      </React.Bootstrap.Select>
    );
  }
});

module.exports = FilterSlots;
