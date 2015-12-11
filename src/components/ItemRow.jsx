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
    var boost = this.props.item.stats_info[this.props.boostId];
    return this.DataService.calculateLuck(boost[lvl]);
  },

  itemSelected: function(event) {
    var name = event.target.className.split(' ')[0];
    if (name === 'icon' || name === 'icon-img') return;
    this.props.onItemSelected(this.props.item)
  },

  isItemSelected: function(id) {
    return this.props.isItemSelected(id);
  },

  // <selected> didnt work with this:
  // 
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return this.props.item.href !== nextProps.item.href ||
  //          this.props.selected !== nextProps.selected ||
  //          this.props.matched !== nextProps.matched ||
  //          this.props.boostId !== nextProps.boostId
  // },

  render: function() {
    var item = this.props.item;
    var rowClass = [];

    if (this.isItemSelected(item.href)) rowClass.push('selected');
    if (this.props.matched) rowClass.push('filter-matched');

    var spriteName = "icon-img sprite " + item.sprite;
    var openInfoFn = function() { this.props.openItemInfo(item.href) }.bind(this);

    if (this.props.firstRow) {

      rowClass.push('first-row');
      return (
        <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
          <td className="icon" colSpan='3' onClick={openInfoFn}>
            <div id='img44' className={spriteName}/>
          </td>
          <td className="item-name" colSpan='13'>{this.itemName()}</td>
          <td className="game-event" colSpan='4'>{item.gameEvent}</td>
        </tr>
      );

    } else {

      if (this.props.boostId) {
        return (
          <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
            <td colSpan='15' className={"boost-name"}>
              {this.boostName()}
            </td>
            <td className="sel-lvl lvl6" colSpan='1'>{this.calculateBoostByLvl(5)}</td>
            <td className="sel-lvl lvl5" colSpan='2'>{this.calculateBoostByLvl(4)}</td>
            <td className="sel-lvl lvl4" colSpan='2'>{this.calculateBoostByLvl(3)}</td>
          </tr>
        );
      } else return null
    }
  }
});

module.exports = ItemRow;
