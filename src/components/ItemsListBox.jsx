import React from 'react'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'
import shallowEqual from '../lib/shallowEqual'

import DataService from '../DataService.jsx'
import ItemRow from './ItemRow.jsx'
import FilterPanel from './FilterPanel.jsx'

var ItemsListBox = React.createClass({

  mixins: [LocalStorageMixin],

  typeSelected: function(types) { this.setState({ onlyTypes: types }) },

  slotSelected: function(slots) { this.setState({ onlySlots: slots }) },

  showAllBoostsClicked: function() {
    this.setState({ showAllBoosts: !this.state.showAllBoosts });
  },

  getInitialState: function() {
    this.firstRender = true;
    return {
      showAllBoosts: true,
      onlyTypes: ['Cores'],
      onlySlots: []
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  isItemSelected: function(id) {
    return this.props.isItemSelected(id);
  },

  getItemRow: function(item, index, selected, boostId, matched) {
    return (
      <ItemRow firstRow={index === 0} item={item} key={"item-"+index}
        boostId={boostId}
        selected={selected}
        matched={matched}
        ref={'row-item-'+item.href}
        onItemSelected={this.props.onItemSelected}
        openItemInfo={this.props.openItemInfo} />
    );
  },

  getItemNodes: function(item, onlyBoosts) {
    var selected = this.isItemSelected(item.href);
    var boostsArr = Object.keys(item.stats_info);
    boostsArr.unshift(null); // header row

    return boostsArr.map(function(boostId, index) {

      if (index === 0) {
        // header row
        return this.getItemRow(item, index, selected, null, null);

      } else {
        // boosts rows
        var matchedBoostId = onlyBoosts.indexOf(parseInt(boostId));

        if (this.state.showAllBoosts) {
          var matched = matchedBoostId >= 0 ? true : false;
          return this.getItemRow(item, index, selected, boostId, matched);
        } else {
          if (matchedBoostId < 0) return null
          else return this.getItemRow(item, index, selected, boostId, null);
        }

      }
    }, this);
  },

  getFilteredData: function(onlyTypes, onlySlots, onlyEvents, onlyBoosts) {
    var filteredData = this.DataService.getSortedAndFilteredData(onlyTypes, onlyEvents, onlyBoosts, onlySlots);

    return filteredData.map(function(item) {
      return this.getItemNodes(item, onlyBoosts);
    }, this);
  },

  getCoreSlotNode: function(slot) {
    if (this.state.onlySlots.length === 0 || this.state.onlySlots.indexOf(slot) >= 0) {
      var cores = this.getFilteredData(['Core'], [slot], this.props.onlyEvents, this.props.onlyBoosts);
      if (cores.length === 0) return null
      else {
        var header = i18n.t('items-list.'+slot) + ': ' + cores.length;
        return (
          <div>
            <h4>{header}</h4>
            <table className={"cores-list-"+slot}><tbody>
              {cores}
            </tbody></table>
          </div>
        )
      }
    } else return null;
  },

  getCoreNodes: function() {
    if (this.state.onlyTypes.indexOf('Cores') >= 0) {
      return (
        <div>
          {this.getCoreSlotNode('Helm')}
          {this.getCoreSlotNode('Armor')}
          {this.getCoreSlotNode('Feet')}
          {this.getCoreSlotNode('Weapon')}
          {this.getCoreSlotNode('Accessory')}
        </div>
      );
    } else return null;
  },

  getPieceNodes: function() {
    if (this.state.onlyTypes.indexOf('Pieces') >= 0) {
      var pieces = this.getFilteredData(['Piece'], [], this.props.onlyEvents, this.props.onlyBoosts);
      if (pieces.length > 0) {
        return (
          <div>
            <h4>Pieces: {pieces.length}</h4>
            <table className="pieces-list"><tbody>
              {pieces}
            </tbody></table>
          </div>
        );
      } else return null;
    } else return null;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (this.firstRender && this.DataService && this.DataService.isReady()) {
      this.firstRender = false;
      return true;
    } else {
      return !shallowEqual(this.props.onlyEvents, nextProps.onlyEvents) ||
             !shallowEqual(this.props.onlyBoosts, nextProps.onlyBoosts) ||
             !shallowEqual(this.state, nextState);
    }
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;

    return (
      <div className='cores-list-box'>
        <FilterPanel
          showAllBoosts={this.state.showAllBoosts}
          type={this.state.onlyTypes[0]}
          slot={this.state.onlySlots[0]}
          showAllBoostsClicked={this.showAllBoostsClicked}
          onTypeSelected={this.typeSelected}
          onSlotSelected={this.slotSelected}
        />
        <div className='scrollable-items-list'>
          {this.getCoreNodes()}
          {this.getPieceNodes()}
        </div>
      </div>
    );
  }
});

module.exports = ItemsListBox;
