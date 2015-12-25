import React from 'react';
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

import DataService from '../DataService.jsx';

var FilterBoosts = React.createClass({

  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return { boosts: [] }
  },

  componentWillMount: function() {
    this.DataService = DataService();
  },

  boostClicked: function(event) {
    var boostId = parseInt(event.currentTarget.value);
    var currBoosts = this.state.boosts.concat([]);
    var ix = currBoosts.indexOf(boostId);
    if (ix >= 0) {
      currBoosts.splice(ix, 1);
    } else {
      currBoosts.push(boostId);
    }
    this.setState({ boosts: currBoosts });
    this.props.onBoostSelected(currBoosts);
  },

  getBtnState: function(boostId) {
    return this.state.boosts.indexOf(parseInt(boostId)) >= 0 ? 'active' : '';
  },

  clearFilter: function() {
    this.setState({ boosts: [] });
    this.props.onBoostSelected([]);
  },

  clearBtnState: function() {
    return this.state.boosts.length > 0 ? '' : ' hidden';
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;
    var locale = i18n.currentLocale();

    if (!this.sortedBoosts) this.sortedBoosts = {};
    if (!this.sortedBoosts[locale]) {
      if (locale === 'ru') {
        var tmp = Object.keys(this.DataService.allBoostsRu);
      } else {
        var tmp = Object.keys(this.DataService.allBoosts);
      }

      // убираем из фильтров бусты не найденные ни в одном итеме
      tmp = this.DataService.sortBoosts(tmp);
      tmp.forEach(function(boostId, index) {
        if (!this.DataService.isBoostExist(boostId)) tmp[index] = null;
      }, this);
      tmp = tmp.filter(function(boostId) { return boostId });
      //////////

      this.sortedBoosts[locale] = {};
      tmp.forEach(function(boostId) {
        var name = this.DataService.getBoostName(boostId);
        this.sortedBoosts[locale][name] = boostId;
      }, this);
    }

    var boostNodes = Object.keys(this.sortedBoosts[locale]).map(function(boostName) {
      var boostId = this.sortedBoosts[locale][boostName];
      return (
        <Button id='snap-filter-btn' value={boostId} key={'boost-'+boostId}
                onClick={this.boostClicked}
                className={(() => { return this.getBtnState(boostId) })()}>
          {boostName}
        </Button>
      )
    }, this);

    return (
      <div className='snap-filter'>
        <div className='snap-filter-header'>
          <button type="button" className={"snap-filter-clear-btn"+this.clearBtnState()} onClick={this.clearFilter}>
            <Glyphicon glyph="remove"/>
          </button>
          <span className='snap-filter-headtext'>{i18n.t('filter.boosts')}</span>
        </div>
        <div className='snap-filter-container'>
          {boostNodes}
        </div>
      </div>
    );
  }
});


module.exports = FilterBoosts;
