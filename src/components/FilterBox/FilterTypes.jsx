import $ from 'jquery';
import React from 'react';
React.Bootstrap = require('react-bootstrap');
React.Bootstrap.Select = require('./rbs.jsx');

var FilterTypes = React.createClass({
  componentDidMount: function() {
    $('.selectpicker').selectpicker();
    $('body').on('change', '.selectpicker.FilterTypes', this.getSelectedValues, this.props.onChange);
    setTimeout(function() {
      $('.selectpicker.FilterTypes').val(['Core']); //'Core', 
      $('.selectpicker.FilterTypes').trigger('change');
      $('.selectpicker.FilterTypes').selectpicker('refresh');
    }, 1500);
  },
  getSelectedValues: function() {
    var result = [];
    var list = $('.selectpicker.FilterTypes').find("option:selected");
    $.each(list, function(key, value) {
      result.push(list[key].value);
    });
    return result;
  },
  render: function() {
    return (
      <React.Bootstrap.Select data-width='25%' className="selectpicker FilterTypes" title='Types'>
        <option>Core</option>
        <option>Piece</option>
        <option>Crafting Recipes</option>
      </React.Bootstrap.Select>
    );
  }
});

module.exports = FilterTypes;
