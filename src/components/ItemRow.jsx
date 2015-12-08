
import React from 'react';
import DataService from '../DataService.jsx';

var ItemRow = React.createClass({

  componentWillMount: function() {
    this.DataService = DataService();
  },

  boostName: function() {
    return this.DataService.getBoostName(this.props.boostId);
  },

  itemName: function() {
    return this.DataService.getItemName(this.props.item);
  },

  calculateBoostByLvl: function(lvl) {
    try {
      var boost = this.props.item.stats_info[this.props.boostId];
      return this.DataService.calculateLuck(boost[lvl]);
    } catch(e) {
      console.log(e);
      console.log('bid:'+this.props.boostId);
      console.log(boost);
      console.log(this.props.item.href);
    }
  },

  itemSelected: function(event) {
    var name = event.target.className.split(' ')[0];
    if (name === 'icon' || name === 'icon-img') return;
    this.props.onItemSelected(this.props.item)
  },

  render: function() {
    var item = this.props.item;
    var rowClass = [];

    if (this.props.selected) rowClass.push('selected');

    var spriteName = "icon-img sprite " + item.sprite;
    var openInfoFn = function() { this.props.openItemInfo(item.href) }.bind(this);

    // console.log('this.props.matchClass:'+this.props.matchClass);

    if (this.props.firstRow) {

      rowClass.push('first-raw');
      return (
        <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
          <td className="icon" colSpan='3' onClick={openInfoFn}>
            <div id='img44' className={spriteName}/>
          </td>
          <td className="item-name" colSpan='13'>{this.itemName()}</td>
          <td className="game-event" colSpan='4'>{item.gameEvent}</td>
        </tr>
      );
      // var firstBoost;
      // var firstRow = (
      //   <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
      //     <td className="icon" onClick={openInfoFn}>
      //       <div id='img44' className={spriteName}/>
      //     </td>
      //     <td className="item-name" colSpan='3'>{this.itemName()}</td>
      //     <td className="game-event" colSpan='2'>{item.gameEvent}</td>
      //   </tr>
      // );
      // if (this.props.matchClass) {
      //   firstBoost = (
      //     <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
      //       <td colSpan='3' className={"boost-name"+this.props.matchClass}>
      //         {this.boostName()}
      //       </td>
      //       <td className="lvl6">{this.calculateBoostByLvl(5)}</td>
      //       <td className="lvl5">{this.calculateBoostByLvl(4)}</td>
      //       <td className="lvl4">{this.calculateBoostByLvl(3)}</td>
      //     </tr>
      //   );
      // } else {
      //   firstBoost = null;
      // }
      // return (
      //   <span>
      //   {firstRow}
      //   {firstBoost}
      //   </span>
      // );

    } else {

      if (this.props.boostId) {
            // <td className="dummy-icon"/>
        return (
          <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
            <td colSpan='15' className={"boost-name"+this.props.matchClass}>
              {this.boostName()}
            </td>
            <td className="sel-lvl lvl6" colSpan='1'>{this.calculateBoostByLvl(5)}</td>
            <td className="sel-lvl lvl5" colSpan='2'>{this.calculateBoostByLvl(4)}</td>
            <td className="sel-lvl lvl4" colSpan='2'>{this.calculateBoostByLvl(3)}</td>
          </tr>
        );
      } else return null
    }

    // return (
    //   <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
    //     <td className="icon" rowSpan={this.props.rowSpan} onClick={openInfoFn}>
    //       <div id='img44' className={spriteName}/>
    //     </td>
    //     <td className="item-name" colSpan='2'>{this.itemName()}</td>
    //     <td className="game-event" colSpan='3'>{item.gameEvent}</td>

    //     <td colSpan='3' className={"boost-name"+this.props.matchClass}>
    //       {this.boostName()}
    //     </td>
    //     <td className="lvl6">{this.calculateBoostByLvl(5)}</td>
    //     <td className="lvl5">{this.calculateBoostByLvl(4)}</td>
    //     <td className="lvl4">{this.calculateBoostByLvl(3)}</td>
    //   </tr>
    // );

    // return (
    //   <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
    //     {this.props.firstRow ? <td className="icon" rowSpan={this.props.rowSpan} onClick={openInfoFn}>
    //       <div id='img44' className={spriteName}/>
    //     </td> : null}
    //     {this.props.firstRow ? <td className="item-name" rowSpan={this.props.rowSpan}>{this.itemName()}</td> : null}
    //     {this.props.boostId ? <td className={"boost-name"+this.props.matchClass}>{this.boostName()}</td> : null}
    //     {this.props.boostId ? <td className="lvl6">{this.calculateBoostByLvl(5)}</td> : null}
    //     {this.props.boostId ? <td className="lvl5">{this.calculateBoostByLvl(4)}</td> : null}
    //     {this.props.boostId ? <td className="lvl4">{this.calculateBoostByLvl(3)}</td> : null}
    //     {(this.props.boostId && true) ? null : <td className="game-event">{item.gameEvent}</td>}
    //   </tr>
    // );
  }
});

module.exports = ItemRow;
