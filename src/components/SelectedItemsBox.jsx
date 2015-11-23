import React from 'react';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import LocalStorageMixin from 'react-localstorage';
import i18n from 'i18n-js';

import DataService from '../DataService.jsx';
import ModalQualitySelect from './ModalQualitySelect.jsx';
import SetItemModel from '../models/SetItem';


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
  },

  componentDidMount: function() {
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
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

      // add piece to setItem
      } else if (currSetItem.pieces.length < 6) {
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

  render: function() {
    if (!this.DataService || !this.DataService.isReady) return null;

    var currSetItem = this.state.setItem;
    var core = currSetItem.core;

    if (core) {
      var quality = this.qualities[currSetItem.coreQuality];
      var spriteName = 'sprite ' + core.sprite;
      var openInfoFn = function() { this.refs.modal.open(core) }.bind(this);
      var coreNode = (
        <div className={'sel-item-core '+quality} key={"sel-item-core"}>
          <div id='img64' className={spriteName} onClick={openInfoFn} />
        </div>
      );
    } else {
      var coreNode = (
        <div className={'sel-item-core empty'} key={"sel-item-core"}>
          <div id='img64' className='sprite empty'/>
        </div>
      );
    }

    var pieceNodes = currSetItem.pieces.map(function(item, index) {
      openInfoFn = function() { this.refs.modal.open(item) }.bind(this);
      quality = this.qualities[currSetItem.piecesQualities[index]];
      var spriteName = 'sprite ' + item.sprite;
      return (
        <div className={'sel-item '+quality} key={"sel-item-" + index}>
          <div id='img32' className={spriteName} onClick={openInfoFn} />
        </div>
      );
    }.bind(this));

    var summarizeInfoNodes = this.DataService.getCurrSetItemSummaryTable(currSetItem);

    return (
      <div className='selected-items-box' ref='target'>
        <ModalQualitySelect ref="modal" qualitySelected={this.qualitySelected}/>
        <Well className="selected-items">
          {coreNode}
          <div>
            {pieceNodes}
          </div>
        </Well>
        <Button className='button' onClick={this.addSetItemToSet}>
          {true ? i18n.t('button.add') : i18n.t('button.remove')}
        </Button>
        <Button className='button' onClick={this.resetItems}>
          {i18n.t('button.clear')}
        </Button>
        <div className="summarize-info">
          {summarizeInfoNodes}
        </div>
      </div>
    );
  }
});

module.exports = SelectedItemsBox;
