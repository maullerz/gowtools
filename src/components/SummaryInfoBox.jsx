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
    // 5.228.58.189:3000
    if (setItemToRemove.core.slot !== 'Accessory') {
      this.state.coresSet[setItemToRemove.core.slot] = null;
    } else {
      this.state.coresSet.Accessory = this.state.coresSet.Accessory.filter(function(item) {
        return item !== setItemToRemove;
      });
    }
    this.setState({ coresSet: this.state.coresSet });
  },

  addSetItemToSet: function(setItem) {
    if (setItem.core.slot !== 'Accessory') {
      if (this.state.coresSet[setItem.core.slot]) {
        alert('Slot ' + setItem.core.slot + ' already exist!');
        return null;
      } else {
        this.state.coresSet[setItem.core.slot] = setItem;
      }
    } else {
      var accessoryExists = this.state.coresSet.Accessory.filter(function(item) { return item });
      if (accessoryExists.length > 2) {
        // alert('All Accessory slots already exist!');
        // TODO i18n
        navigator.notification.alert(
            'All Accessory slots already exist!',  // message
            null,         // callback
            'Craft',            // title
            'Ok'                  // buttonName
        );
        return null;
      } else {
        this.state.coresSet.Accessory.push(setItem);
      }
    }
    this.setState({ coresSet: this.state.coresSet });
  },

  componentDidMount: function() {
    this.DataService = DataService();
    // this.DataService.coresSetCallback = function(currSet) {
    //   this.setState({ coresSet: currSet });
    // }.bind(this);
    // update DataService with setItem saved in LocalStorage
    // timeout needed because storage-mixin load will run after that
    // setTimeout(function() {
    //   this.DataService.currSet = this.state.coresSet;
    // }.bind(this), 500);
  },

  renderCurrSet: function(flattenItems) {
    var nodes = flattenItems.map(function(setItem, index) {

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
        // return (
        //   <div className={'piece-coreset '+quality} key={"piece-coreset-" + index}>
        //     <div id='img32' className={spriteName} />
        //   </div>
        // );
      }.bind(this));

      var selectFunc = function() { this.props.selectSetItemForEdit(setItem); this.forceUpdate(); }.bind(this);
      var removeFunc = function() { this.removeSetItemFromSet(setItem); this.forceUpdate(); }.bind(this);

/*
          <div className='sel-group'>
            <Button className='button' onClick={removeFunc}>{i18n.t('button.remove')}</Button>
            <Button className='button' onClick={selectFunc}>{i18n.t('button.select')}</Button>
          </div>
*/
      return (
        <SetItemBox key={"set-item-"+index} setItem={setItem} openInfo={true ? null : this.openQualitySelect} />
      )
    }.bind(this));

    return nodes;
  },

  toggleExpand: function() {
    this.setState({ itemsExpanded: !this.state.itemsExpanded });
  },

  clearSet: function() {
    // TODO: PROMT DIALOG!
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
