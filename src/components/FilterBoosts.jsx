import React from 'react';
import DataService from '../DataService.jsx';

var FilterBoosts = React.createClass({

  componentWillMount: function() {
    this.DataService = DataService();
  },

  componentDidMount: function() {

  },

  getSelectedValues: function() {

  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady) return null;
    
    var boosts = this.DataService.allBoosts.map(function(item, index) {
      var subtext = null;
      var boostName = this.DataService.allBoostsRu[index];

      return <option value={index} data-subtext={subtext} key={'boost-'+index}>{item}</option>
    }, this);

    return (
      <select id="filtersList" width='50px' multiple size='1' name='Boosts[]'>
        {boosts}
      </select>
    );
  }
});

module.exports = FilterBoosts;
