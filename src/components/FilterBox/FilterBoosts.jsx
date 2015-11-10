import React from 'react';
import DataService from '../../DataService.jsx';
import $ from 'jquery';
React.Bootstrap = require('react-bootstrap');
React.Bootstrap.Select = require('./rbs.jsx');

var FilterBoosts = React.createClass({

  componentWillMount: function() {
    this.DataService = DataService();
  },

  componentDidMount: function() {
    $('.selectpicker').selectpicker();
    $('body').on('change', '.selectpicker.FilterBoosts', this.getSelectedValues, this.props.onChange);

    setTimeout(function() {
      // $('.selectpicker.FilterBoosts').val(['Cavalry Attack', 'Cavalry Defense']);
      $('.selectpicker.FilterBoosts').selectpicker('refresh');
      // $('.selectpicker.FilterBoosts').trigger('change');
    }, 1000);
  },

  getSelectedValues: function() {
    var result = [];
    var list = $('.selectpicker.FilterBoosts').find("option:selected");

    $.each(list, function(key, value) {
      // log('list[key]:', key, list[key]);
      result.push(list[key].value); //this.props.boosts.indexOf( //.value
    }.bind(this));
    return result;
  },

  // TODO: beautifull combobox for boosts
  render: function() {
    if (!this.DataService || !this.DataService.allBoostsRu) return null;
    
    var boosts = this.DataService.allBoosts.map(function(item, index) {
      var subtext = null;
      var boostName = this.DataService.allBoostsRu[index];
      if (boostName.indexOf('страт') >= 0) {
        subtext = 'страт';
        boostName = boostName.replace('страт', '');
      }
      // var boostName = this.DataService.allBoosts[index];
      // if (boostName.indexOf('Strat') >= 0) {
      //   subtext = 'strat';
      //   boostName = boostName.replace('Strat', '');
      // }

      // var ix = item.indexOf('Strategic ');
      // if (ix >= 0) {
      //   var name = item.replace('Strategic ', '');
      //   var subtext = 'strategic';
      // } else {
      //   var name = item;
      //   var subtext = null;
      // }
      return <option value={index} data-subtext={subtext} key={'boost-'+index}>{boostName}</option>
    }, this);

    return (
        <React.Bootstrap.Select data-width='25%' className="selectpicker FilterBoosts"
                data-style="btn-danger"
                data-selected-text-format="count"
                multiple title='Boosts'>
          {boosts}
        </React.Bootstrap.Select>
    );
  }
});

module.exports = FilterBoosts;
