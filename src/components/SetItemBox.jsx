import React from 'react';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

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
        <div className={'sel-item-core '+quality} key={"sel-item-core"}>
          <div id='img71' className={spriteName} onClick={openInfoFn} />
        </div>
      );

    } else {

      return (
        <div className={'sel-item-core empty'} key={"sel-item-core"}>
          <div id='img71' className='sprite empty'/>
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
        <div className={'sel-item '+quality} key={"sel-item-" + index}>
          <div id='img32' className={spriteName} onClick={openInfoFn} />
        </div>
      );

    }, this);
  },

  render: function() {
    return (
      <div className='set-item-box-head'>
        <Well className="set-item">
          {this.getCoreNode()}
          <div>
            {this.getPieceNodes()}
          </div>
        </Well>
      </div>
    )
  }
});

module.exports = SetItemBox;
