import React from 'react'
import Well from 'react-bootstrap/lib/Well'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import LocalStorageMixin from 'react-localstorage'

import DataService from '../DataService.jsx'
import SetItemModel from '../models/SetItem'
import SetItemBox from './SetItemBox.jsx'


var CraftedItemBox = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'currentSetItem';
  },

  getInitialState: function() {
    var setItem = new SetItemModel();
    return { setItem: setItem };
  },

  componentWillMount: function() {
    this.DataService = DataService();
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
  },

  componentDidMount: function() {
  },

  getItemState: function() {
    if (!this.state.setItem.core) return 'plus';
    var state = this.props.getItemState(this.state.setItem);
    return state;
  },

  getAddBtnState: function() {
    return (!this.state.setItem.core) ? ' hidden' : '';
  },

  getClearBtnState: function() {
    return (!this.state.setItem.core && this.state.setItem.pieces.length === 0) ? ' hidden' : '';
  },

  addButtonClicked: function() {
    var currSetItem = this.state.setItem;

    if (currSetItem.core.slot === 'Accessory') {
      // TODO window.confirm
      var callback = function(buttonIndex) {
        console.log('buttonIndex: '+buttonIndex);
        var isAll = buttonIndex === 1;
        this.addSetItemToSet(currSetItem, isAll);
      }.bind(this);
      navigator.notification.confirm('All or one?', callback, 'Choose', ['All', 'One']);
    } else {
      this.addSetItemToSet(currSetItem, false);
    }
  },

  addSetItemToSet: function(currSetItem, isAll) {
    this.props.addSetItemToSet({
      core: currSetItem.core,
      coreQuality: currSetItem.coreQuality,
      pieces: currSetItem.pieces.concat([]),
      piecesQualities: currSetItem.piecesQualities.concat([])
    }, isAll);
    this.forceUpdate();
  },

  selectSetItemForEdit: function(setItemToSelect) {
    this.updateSetItem(setItemToSelect);
  },

  itemSelected: function(item) {
    var result = false;
    var currSetItem = this.state.setItem;

    if (item.type === 'Core') {
      if (!currSetItem.core) {
        currSetItem.core = item;
        currSetItem.coreQuality = item.quality;
        result = true;
      } else {
        if (item.href !== currSetItem.core.href) {
          currSetItem.core = item;
          currSetItem.coreQuality = item.quality;
          result = true;
        } else {
          currSetItem.core = null;
          currSetItem.coreQuality = null;
        }
      }
    } else if (item.type === 'Piece') {
      var ix = currSetItem.pieces.findIndex(function(piece) { return item.href === piece.href });

      // remove piece from setItem
      if (ix >= 0) {
        currSetItem.pieces.splice(ix, 1);
      } else // add piece to setItem
      if (currSetItem.pieces.length < 6) {
        currSetItem.pieces = currSetItem.pieces.concat(item);
        currSetItem.piecesQualities = currSetItem.piecesQualities.concat(item.quality);
        result = true;
      }
    };

    this.updateSetItem(currSetItem);
    return result;
  },

  updateSetItem: function(newSetItem) {
    this.setState({ setItem: newSetItem });
    this.props.invalidateItemsListBox();
  },

  resetItems: function() {
    if (window.confirm("Do you really want to clear crafted item?")) {
      var emptySetItem = {
        core: null,
        coreQuality: null,
        pieces: [],
        piecesQualities: []
      }
      this.updateSetItem(emptySetItem);
    }
  },

  qualitySelected: function(item, quality) {
    var currSetItem = this.state.setItem;
    if (item.type === 'Core') {
      currSetItem.coreQuality = quality;
    } else if (item.type === 'Piece') {
      var ix = currSetItem.pieces.findIndex(function(piece) { return item.href === piece.href });
      currSetItem.piecesQualities[ix] = quality;
    }
    this.setState({ setItem: currSetItem });
  },

  openQualitySelect: function(item) {
    this.props.modalQualitySelect.open(item);
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return (
      <div className='crafted-item-box'>
        <div className='loading'>LOADING...</div>
      </div>
    );

    var currSetItem = this.state.setItem;

    var summarizeInfoNodes = this.DataService.getCurrSetItemSummaryTable(currSetItem);

    return (
      <div className='crafted-item-box' ref='target'>

        <div className='crafted-item-box-head'>
          <div className='crafted-item-btn-group'>
            <Button className={'glyph-btn' + this.getAddBtnState()} onClick={this.addButtonClicked}>
              <Glyphicon glyph={this.getItemState()}/>
            </Button>
            <Button className={'glyph-btn' + this.getClearBtnState()} onClick={this.resetItems}>
              <Glyphicon glyph="trash"/>
            </Button>
          </div>
          <SetItemBox setItem={this.state.setItem} openInfo={this.openQualitySelect} />
        </div>

        <div className="summarize-info">
          {summarizeInfoNodes}
        </div>
      </div>
    );
  }
});

module.exports = CraftedItemBox;
