import React from 'react'
import Well from 'react-bootstrap/lib/Well'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

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
    return {
      infoExpanded: false,
      setItem: setItem
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
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

  getExpandBtnState: function() {
    return this.state.infoExpanded ? 'triangle-top' : 'triangle-bottom';
  },

  toggleSummarizeInfo: function() {
    this.setState({ infoExpanded: !this.state.infoExpanded });
  },

  getSummarizeInfoState: function() {
    return this.state.infoExpanded ? '' : ' hidden';
    // return this.state.infoExpanded ? '' : ' hidden-ext';
  },

  addSetItemToSet: function(currSetItem, isAll) {
    // or if (isAll) {
    //   this.props.addSetItemToSet({
    //   this.props.addSetItemToSet({
    //   this.props.addSetItemToSet({  
    // }
    this.props.addSetItemToSet({
      core: currSetItem.core,
      coreQuality: currSetItem.coreQuality,
      pieces: currSetItem.pieces.concat([]),
      piecesQualities: currSetItem.piecesQualities.concat([])
    }, isAll);
    this.forceUpdate();
  },

  addButtonClicked: function() {
    var currSetItem = this.state.setItem;

    if (currSetItem.core.slot === 'Accessory') {

      var state = this.props.getItemState(this.state.setItem);

      var performAction = function(buttonIndex) {
        if (buttonIndex !== 3) this.addSetItemToSet(currSetItem, buttonIndex === 2);
      }.bind(this);

      if (this.props.platform === 'browser') {
        if (window.confirm(i18n.t('craftedbox.confirm-action'))) {
          performAction(2);
        } else {
          performAction(1);
        }
      } else {
        navigator.notification.confirm(
          i18n.t('craftedbox.confirm-action'),
          performAction,
          i18n.t('craftedbox.title-'+state),
          [
            i18n.t('button.one'),
            i18n.t('button.all'),
            i18n.t('button.cancel')
          ]
        );
      }
    } else {
      this.addSetItemToSet(currSetItem, false);
    }
  },

  resetItems: function() {
    var clearItems = function(buttonIndex) {
      if (buttonIndex === 1) {
        var emptySetItem = {
          core: null,
          coreQuality: null,
          pieces: [],
          piecesQualities: []
        }
        this.updateSetItem(emptySetItem);
      };
    }.bind(this);

    if (this.props.platform === 'browser') {
      if (window.confirm(i18n.t('craftedbox.confirm-clear'))) clearItems(1);
    } else {
      navigator.notification.confirm(
        i18n.t('craftedbox.confirm-clear'),
        clearItems,
        i18n.t('craftedbox.confirm-title')
      );
    }
  },

  selectSetItemForEdit: function(setItemToEdit) {
    this.updateSetItem({
      core: setItemToEdit.core,
      coreQuality: setItemToEdit.coreQuality,
      pieces: setItemToEdit.pieces.concat([]),
      piecesQualities: setItemToEdit.piecesQualities.concat([])
    });
  },

  itemSelected: function itemSelected(item) {
    var result = false;
    var currSetItem = this.state.setItem;

    if (item.type === 'Core') {
      if (!currSetItem.core) {
        currSetItem.core = item;
        currSetItem.coreQuality = item.quality;
        result = true;
      } else {
        if (item.id !== currSetItem.core.id) {
          currSetItem.core = item;
          currSetItem.coreQuality = item.quality;
          result = true;
        } else {
          currSetItem.core = null;
          currSetItem.coreQuality = null;
        }
      }
    } else if (item.type === 'Piece') {
      var ix = currSetItem.pieces.findIndex(function(piece) { return item.id === piece.id });

      // remove piece from setItem
      if (ix >= 0) {
        currSetItem.pieces.splice(ix, 1);
        currSetItem.piecesQualities.splice(ix, 1);
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

  qualitySelected: function(item, quality) {
    var currSetItem = this.state.setItem;
    if (item.type === 'Core') {
      currSetItem.coreQuality = quality;
    } else if (item.type === 'Piece') {
      var ix = currSetItem.pieces.findIndex(function(piece) { return item.id === piece.id });
      currSetItem.piecesQualities[ix] = quality;
    }
    this.setState({ setItem: currSetItem });
  },

  openQualitySelect: function(item) {
    this.props.modalQualitySelect.open(item, this.removeFromSetItem);
  },

  removeFromSetItem: function(item) {
    this.itemSelected(item);
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;
    // (
    //   <div className='crafted-item-box'>
    //     <div className='loading'>LOADING...</div>
    //   </div>
    // );

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

          <SetItemBox active={true} setItem={this.state.setItem} openInfo={this.openQualitySelect} />

          <div className='crafted-item-btn-group expand'>
            <Button ref='expandBtn' className={'glyph-btn expand'} onClick={this.toggleSummarizeInfo}>
              <Glyphicon glyph={this.getExpandBtnState()}/>
            </Button>
          </div>
        </div>

        <div className={'summarize-info' + this.getSummarizeInfoState()}>
          {summarizeInfoNodes}
        </div>
      </div>
    );
  }
});

module.exports = CraftedItemBox;
