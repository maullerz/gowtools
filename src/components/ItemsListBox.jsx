import React from 'react'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'
import ReactList from 'react-list'
import shallowEqual from '../lib/shallowEqual'

import DataService from '../DataService.jsx'
import ItemRow from './ItemRow.jsx'
import FilterPanel from './FilterPanel.jsx'


const isEqualSubset = (a, b) => {
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
};

const isEqual = (a, b) => isEqualSubset(a, b) && isEqualSubset(b, a);


var ItemsListBox = React.createClass({

  mixins: [LocalStorageMixin],

  typeSelected: function(types) { this.setState({ onlyTypes: types }) },

  slotSelected: function(slots) { this.setState({ onlySlots: slots }) },

  showAllBoostsClicked: function() {
    this.setState({
      showAllBoosts: !this.state.showAllBoosts,
      invalidateHack: !this.state.invalidateHack
    });
  },

  getInitialState: function() {
    this.firstRender = true;
    return {
      invalidateHack: false,
      showAllBoosts: true,
      onlyTypes: ['Cores'],
      onlySlots: []
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  invalidate: function() {
    this.setState({ invalidateHack: !this.state.invalidateHack });
  },

  getItemRow: function(item, index, boostId, matched) {
    return (
      <ItemRow firstRow={index === 0} item={item} key={"item-"+index}
        boostId={boostId}
        matched={matched}
        ref={'row-item-'+item.href}
        isItemSelected={this.props.isItemSelected}
        onItemSelected={this.props.onItemSelected}
        openItemInfo={this.props.openItemInfo} />
    );
  },

  getItemNodes: function(item, onlyBoosts) {
    var boostsArr = Object.keys(item.stats_info);
    boostsArr.unshift(null); // for header row

    var items = boostsArr.map(function(boostId, index) {

      if (index === 0) {
        // header row
        return this.getItemRow(item, index, null, null);

      } else {
        // boosts rows
        var matchedBoostId = onlyBoosts.indexOf(parseInt(boostId));

        if (this.state.showAllBoosts) {
          var matched = matchedBoostId >= 0 ? true : false;
          return this.getItemRow(item, index, boostId, matched);
        } else {
          if (matchedBoostId < 0) return null
          else return this.getItemRow(item, index, boostId, null);
        }
      }
    }, this);

    items = items.filter(function(item){ return item });

    return items;
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

  itemSizeGetter: function(index) {
    var rows = this.pieces[index];
    var size = 0;
    rows.forEach(function(row, index) {
      // TODO set this appropriate to different medias
      if (index === 0) size += 45;
      else if (row) size += 17;
    });
    return size;
  },

  itemRenderer: function(index, key) {
    return this.pieces[index];
  },

  itemsRenderer: function(items, ref) {
    return (
      <table ref={ref} className="pieces-list"><tbody>
        {items}
      </tbody></table>
    )
  },

  getPieceNodes: function() {
    if (this.state.onlyTypes.indexOf('Pieces') >= 0) {
      this.pieces = this.getFilteredData(['Piece'], [], this.props.onlyEvents, this.props.onlyBoosts);
      if (this.pieces.length > 0) {
        return (
          <div>
            <h4>Pieces: {this.pieces.length}</h4>
            <ReactList
              ref='reactList'
              initialIndex={0}
              invalidateHack={this.state.invalidateHack} /*small hack to force ReactList update*/
              itemRenderer={this.itemRenderer}
              itemsRenderer={this.itemsRenderer}
              itemSizeGetter={this.itemSizeGetter}
              length={this.pieces.length}
              useTranslate3d={true}
              pageSize={20}
              threshold={800}
              type='variable'
            />
          </div>
        );
      } else return null;
    } else {
      this.pieces = null;
      return null;
    }
  },

  // TODO
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (this.firstRender && this.DataService && this.DataService.isReady()) {
  //     this.firstRender = false;
  //     return true;
  //   } else {
  //     var result = !shallowEqual(this.props.onlyEvents, nextProps.onlyEvents) ||
  //                  !shallowEqual(this.props.onlyBoosts, nextProps.onlyBoosts) ||
  //                  !shallowEqual(this.state, nextState);
  //     if (this.refs.reactList) this.refs.reactList.scrollAround(0);
  //     // if (this.refs.reactList) this.refs.reactList.forceUpdate();
  //     // if (this.refs.reactList) this.refs.reactList.refs.ref.forceUpdate();
  //     return result;
  //   }
  // },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return (
      <div className='cores-list-box'>
        <div className='loading'>LOADING...</div>
      </div>
    );

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
          {/* TODO: по этим фильтрам ничего не найдено */}
        </div>
      </div>
    );
  }
});

module.exports = ItemsListBox;
