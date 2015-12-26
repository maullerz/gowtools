import React from 'react'
import Well from 'react-bootstrap/lib/Well'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import i18n from 'i18n-js'

var SetItemBox = React.createClass({

  componentWillMount: function() {
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
  },

  itemClicked: function(item) {
    this.props.openInfo && this.props.openInfo(item);
  },

  getCoreNode: function() {
    var currSetItem = this.props.setItem;
    var core = currSetItem.core;

    if (core) {

      var quality = this.qualities[currSetItem.coreQuality];
      var spriteName = 'sprite ' + core.sprite;
      var openInfoFn = function() { this.itemClicked(core) }.bind(this);

      return (
        <div className={'sel-item core '+quality} key={"sel-item-core"}>
          <div id='core' className={spriteName} onClick={openInfoFn} />
        </div>
      );

    } else {

      return (
        <div className={'sel-item core empty'} key={"sel-item-core"}>
          <div id='core' className='sprite empty'>
            {i18n.t('craftedbox.choose-core')}
          </div>
        </div>
      );

    }
  },

  getPieceNodes: function() {
    var currSetItem = this.props.setItem;

    return currSetItem.pieces.map(function(piece, index) {

      var quality = this.qualities[currSetItem.piecesQualities[index]];
      var spriteName = 'sprite ' + piece.sprite;
      var openInfoFn = function() { this.itemClicked(piece) }.bind(this);

      return (
        <div className={'sel-item piece '+quality} key={"sel-item-" + index}>
          <div id='piece' className={spriteName} onClick={openInfoFn} />
        </div>
      );

    }, this);
  },

  getSetItemState: function() {
    var state = this.props.active ? ' active' : '';
    if (this.props.statsKey) state += ' stats';
    return state;
  },

  setItemClicked: function(event) {
    if (!this.props.active) {
      this.props.onActivate(this.props.statsKey);
      event.stopPropagation();
    }
  },

  render: function() {
    return (
      <Well className={"set-item" + this.getSetItemState()} onClickCapture={this.setItemClicked}>
        {this.getCoreNode()}
        {this.getPieceNodes()}
      </Well>
    )
  }

});

module.exports = SetItemBox;
