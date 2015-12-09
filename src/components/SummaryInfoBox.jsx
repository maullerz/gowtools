import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';
import LocalStorageMixin from 'react-localstorage';
import i18n from 'i18n-js';

import DataService from '../DataService.jsx';
import CoresSetModel from '../models/CoresSet';
import SetItemBox from './SetItemBox.jsx';

var SummaryInfoBox = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'currentSet';
  },

  getInitialState: function() {
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
    var coresSet = new CoresSetModel();
    return {
      itemsExpanded: true,
      coresSet: coresSet
    };
  },

  flattenCoresSet: function() {
    var items = [
      this.state.coresSet.Helm,
      this.state.coresSet.Armor,
      this.state.coresSet.Feet,
      this.state.coresSet.Weapon
    ].concat(this.state.coresSet.Accessory);

    return items.filter(function(item) { return item });
  },

  removeSetItemFromSet: function(setItemToRemove) {
    if (setItemToRemove.core.slot !== 'Accessory') {
      this.state.coresSet[setItemToRemove.core.slot] = null;
    } else {
      this.state.coresSet.Accessory = this.state.coresSet.Accessory.filter(function(item) {
        return item !== setItemToRemove;
      });
    }
    this.setState({ coresSet: this.state.coresSet });
  },

  isEqualItems: function(first, second) {
    var result = false;
    if (Array.isArray(second)) {
      result = second.every(function(accessory) {
        return this.isEqualItems(first, accessory);
      }, this);
    } else {
      result = first.core.href === second.core.href;
      // TODO: do we need to compare qualities?
      // result = result && (first.coreQuality === second.coreQuality);
      result = result && (first.pieces.length === second.pieces.length)
      result = result && first.pieces.every(function(piece, index) {
        // && first.piecesQualities[index] === second.piecesQualities[index]
        return piece.href === second.pieces[index].href;
      }, this);
    }

    return result;
  },

  getItemState: function(setItem) {
    // 'plus' / 'minus' / 'exchange'
    if (setItem.core.slot !== 'Accessory') {
      if (this.state.coresSet[setItem.core.slot]) {
        if (this.isEqualItems(setItem, this.state.coresSet[setItem.core.slot])) {
          return 'minus';
        } else {
          return 'transfer';
        }
      } else {
        return 'plus';
      }
    } else {
      if (this.state.coresSet.Accessory.length < 3) {
        return 'plus';
      } else {
        if (this.isEqualItems(setItem, this.state.coresSet.Accessory)) {
          return 'minus';
        } else {
          return 'transfer';
        }
      }
    }
  },

  addSetItemToSet: function(setItem, isAll) {
    var state = this.getItemState(setItem);
    console.log(state);
    if (setItem.core.slot !== 'Accessory') {
      if (state === 'plus' || state === 'transfer') {
        this.state.coresSet[setItem.core.slot] = setItem;
      } else if (state === 'minus') {
        this.state.coresSet[setItem.core.slot] = null;
      }
    } else {
      if (state === 'plus') {
        if (isAll) {
          this.state.coresSet.Accessory = [setItem, setItem, setItem];
        } else {
          this.state.coresSet.Accessory.push(setItem);
        }
      } else if (state === 'transfer') {
        if (isAll) {
          this.state.coresSet.Accessory = [setItem, setItem, setItem];
        } else {
          this.state.coresSet.Accessory.shift();
          this.state.coresSet.Accessory.push(setItem);
        }
      } else if (state === 'minus') {
        if (isAll) {
          this.state.coresSet.Accessory = [];
        } else {
          var index = this.state.coresSet.Accessory.findIndex(function(accessory) {
            return this.isEqualItems(setItem, accessory);
          }, this);
          this.state.coresSet.Accessory.splice(index, 1);
        }
      }
    }
    this.setState({ coresSet: this.state.coresSet });
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  renderCurrSet: function(flattenItems) {
    return flattenItems.map(function(setItem, index) {
      var quality = this.qualities[setItem.coreQuality];
      var spriteName = 'sprite ' + setItem.core.sprite;
      var coreNode = (
        <div className={'sel-item-core '+quality}>
          <div id='img64' className={spriteName} />
        </div>
      );
      var pieceNodes = setItem.pieces.map(function(piece, index) {
        var quality = this.qualities[setItem.piecesQualities[index]];
        var spriteName = 'sprite ' + piece.sprite;
        return (
          <div className={'sel-item '+quality} key={"piece-coreset-" + index}>
            <div id='img32' className={spriteName} />
          </div>
        );
      }.bind(this));

      var selectFunc = function() { this.props.selectSetItemForEdit(setItem); this.forceUpdate(); }.bind(this);
      var removeFunc = function() { this.removeSetItemFromSet(setItem); this.forceUpdate(); }.bind(this);

      return (
        <SetItemBox key={"set-item-"+index} setItem={setItem} openInfo={true ? null : this.openQualitySelect} />
      )
    }.bind(this));
  },

  toggleExpand: function() {
    this.setState({ itemsExpanded: !this.state.itemsExpanded });
  },

  clearSet: function() {
    // TODO: PROMT DIALOG
    this.setState({ coresSet: new CoresSetModel() });
  },

  render: function() {
    if (!this.DataService) return null;
    var flattenItems = this.flattenCoresSet();

    return (
      <div className={"tab-statistics"+this.props.className}>
        <div className='statistics-set-items'>
          {this.renderCurrSet(flattenItems)}
        </div>
        {this.DataService ? this.DataService.getCurrSetSummaryTable(flattenItems) : null}
      </div>
    );
  }
});

module.exports = SummaryInfoBox;
