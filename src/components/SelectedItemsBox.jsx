import React from 'react';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import LocalStorageMixin from 'react-localstorage';

import DataService from '../DataService.jsx';
import SetItemModel from '../models/SetItem';
import SetItemBox from './SetItemBox.jsx';


var SelectedItemsBox = React.createClass({

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

  addSetItemToSet: function() {
    var currSetItem = this.state.setItem;
    if (currSetItem.core) {
      this.props.addSetItemToSet({
        core: currSetItem.core,
        coreQuality: currSetItem.coreQuality,
        pieces: currSetItem.pieces.concat([]),
        piecesQualities: currSetItem.piecesQualities.concat([])
      });
    } else {
      alert('Необходимо выбрать сердцевину!');
    }
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
    var emptySetItem = {
      core: null,
      coreQuality: null,
      pieces: [],
      piecesQualities: []
    }
    this.updateSetItem(emptySetItem);
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
    // this.refs.modal.open(item);
    this.props.modalQualitySelect.open(item);
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return null;

    var currSetItem = this.state.setItem;

    var summarizeInfoNodes = this.DataService.getCurrSetItemSummaryTable(currSetItem);
/*

        <ModalQualitySelect ref="modal" qualitySelected={this.qualitySelected}/>
*/
    return (
      <div className='selected-items-box' ref='target'>

        <div className='selected-items-box-head'>
          <div className='selected-items-btn-group'>
            <Button className='button' onClick={this.addSetItemToSet}>
              <Glyphicon glyph="plus"/>
            </Button>
            <Button className='button' onClick={this.resetItems}>
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

module.exports = SelectedItemsBox;
