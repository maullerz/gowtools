import React from 'react'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

import DataService from '../DataService.jsx'
import ItemRow from './ItemRow.jsx'
import FilterPanel from './FilterPanel.jsx'

var ItemsListBox = React.createClass({

  mixins: [LocalStorageMixin],

  typeSelected: function(types) { this.setState({ onlyTypes: types }) },

  slotSelected: function(slots) { this.setState({ onlySlots: slots }) },

  getInitialState: function() {
    return {
      onlyTypes: [],
      onlySlots: []
    };
  },

  componentWillMount: function() {
    this.DataService = DataService();
  },

  isItemSelected: function(id) {
    return this.props.isItemSelected(id);
  },

  getFilteredData: function(onlyTypes, onlySlots) {
    var filteredData = this.DataService.getFilteredData(
      onlyTypes,
      this.props.onlyEvents,
      [],
      onlySlots
    );

    return filteredData.map(function(item, index) {
      return (
        <ItemRow firstRow={true} item={item} key={"item-"+index}
          selected={this.isItemSelected(item.href)}
          ref={'row-item-'+item.href}
          onItemSelected={this.props.onItemSelected}
          openItemInfo={this.props.openItemInfo} />
      )
    }, this);
  },

  getBoostFilteredNodes: function(onlyTypes, onlySlots) {
    var filteredData = this.DataService.getBoostFilteredData(
      onlyTypes,
      this.props.onlyEvents,
      this.props.onlyBoosts,
      onlySlots
    );

    if (this.props.onlyBoosts.length === 1) {
      filteredData = this.DataService.sortByBoost(filteredData, this.props.onlyBoosts[0]);
    } else if (this.props.onlyBoosts.length > 1) {
      filteredData = this.DataService.sortByMultiBoost(filteredData, this.props.onlyBoosts);
    }

    return filteredData.map(function(item, index) {
      var currRowSpan = 0;
      var onlyFilteredBoosts = false;

      if (onlyFilteredBoosts) {
        this.props.onlyBoosts.forEach(function(boost) {
          var boostId = boost.toString();
          var boost = item.stats_info[boostId];
          if (boost) currRowSpan += 1;
        }, this);
      } else {
        currRowSpan = Object.keys(item.stats_info).length;
      }

      // Show Only Filtered Boosts
      // return this.props.onlyBoosts.map(function(boostId, index) {

      // Show All Item Boosts
      return Object.keys(item.stats_info).map(function(boostId, index) {
        var boostRec = item.stats_info[boostId.toString()];
        var matchedBoost = false;

        if (boostRec !== undefined) {

          // TODO !!!!!!! DAMN FIX THIS !!!!!!!!!!
          if (!onlyFilteredBoosts && this.props.onlyBoosts.indexOf(parseInt(boostId)) >= 0) {
            matchedBoost = true;
          }

          // console.log(boostId);

          return (
            <ItemRow firstRow={index === 0} item={item} key={"item-"+index}
              selected={this.isItemSelected(item.href)}
              ref={'row-item-'+item.href}
              boostId={boostId.toString()}
              matchClass={matchedBoost ? ' filter-match' : ''}
              onItemSelected={this.props.onItemSelected}
              openItemInfo={this.props.openItemInfo} />
          )
        } else {
          return null;
        }

      }, this);

    }, this);
  },

  filterFunc: function(onlyTypes, onlySlots) {
    if (this.props.onlyBoosts.length === 0) {
      return this.getFilteredData(onlyTypes, onlySlots);
    } else {
      return this.getBoostFilteredNodes(onlyTypes, onlySlots);
    }
  },

  getCoreNode: function(slot) {
    if (this.state.onlySlots.length === 0 || this.state.onlySlots.indexOf(slot) >= 0) {
      var nodes = this.filterFunc(['Core'], [slot]);
      if (nodes.length === 0) return null
      else {
        var header = i18n.t('items-list.'+slot) + ': ' + nodes.length;
        header += i18n.t('items-list.items');
        return (
          <div>
            <h4>{header}</h4>
            <table className={"cores-list-"+slot}><tbody>
              {nodes}
            </tbody></table>
          </div>
        )
      }
    } else return null;
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;

    var coreNode = null;
    var pieceNode = null;
    var recipeNode = null;

    if (this.state.onlyTypes.indexOf('Cores') >= 0) {

      coreNode = (
        <div>
          {this.getCoreNode('Helm')}
          {this.getCoreNode('Armor')}
          {this.getCoreNode('Feet')}
          {this.getCoreNode('Weapon')}
          {this.getCoreNode('Accessory')}
        </div>
      );
    };

    if (this.state.onlyTypes.indexOf('Pieces') >= 0) {
      var pieces = this.filterFunc(['Piece'], []);
      if (pieces.length > 0) pieceNode = (
        <div>
          <h4>Pieces: {pieces.length} items</h4>
          <table className="pieces-list"><tbody>
            {pieces}
          </tbody></table>
        </div>
      );
    };

    if (this.state.onlyTypes.indexOf('Crafting Recipes') >= 0) {
      var recipes = this.filterFunc(['Crafting Recipes'], []);
      if (recipes.length > 0) recipeNode = (
        <div>
          <h4>Recipes: {recipes.length} items</h4>
          <table className="recipes-list"><tbody>
            {recipes}
          </tbody></table>
        </div>
      );
    };

    return (
      <div className='cores-list-box'>
        <FilterPanel
          type={this.state.onlyTypes[0]}
          slot={this.state.onlySlots[0]}
          onTypeSelected={this.typeSelected}
          onSlotSelected={this.slotSelected}
        />
        <div className='scrollable-items-list'>
          {coreNode}
          {pieceNode}
          {recipeNode}
        </div>
      </div>
    );
  },
});

module.exports = ItemsListBox;
