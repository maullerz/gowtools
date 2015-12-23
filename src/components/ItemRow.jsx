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
    var boost = this.props.item.stats[this.props.boostId];
    return this.DataService.calculateLuck(boost[lvl]);
  },

  getBoostsValues: function() {
    var boost = this.props.item.stats[this.props.boostId];
    return [
      this.DataService.calculateLuck(boost[5]),
      this.DataService.calculateLuck(boost[4]),
      this.DataService.calculateLuck(boost[3])
    ];
  },

  itemSelected: function(event) {
    var name = event.target.className.split(' ')[0];
    if (name === 'icon' || name === 'icon-img') return;
    this.props.onItemSelected(this.props.item);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.item.id !== nextProps.item.id ||
           this.props.selected !== nextProps.selected ||
           this.props.matched !== nextProps.matched ||
           this.props.boostId !== nextProps.boostId ||
           this.props.firstRow !== nextProps.firstRow
  },

  openInfoFn: function() {
    this.props.openItemInfo(this.props.item.id);
  },

  render: function() {
    var item = this.props.item;
    var rowClass = [];

    if (this.props.selected) rowClass.push('selected');
    if (this.props.matched) rowClass.push('filter-matched');

    var spriteName = "icon-img sprite " + item.sprite;

    if (this.props.firstRow) {

      rowClass.push('first-row');
      return (
        <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
          <td className="icon" colSpan='3' onClick={this.openInfoFn}>
            <div id='img44' className={spriteName}/>
          </td>
          <td className="item-name" colSpan='13'>{this.itemName()}</td>
          <td className="game-event" colSpan='4'>{this.DataService.getEventName(item.eventId)}</td>
        </tr>
      );

    } else {

      if (this.props.boostId) {
        var values = this.getBoostsValues();
        return (
          <tr className={rowClass.join(' ')} onClick={this.itemSelected}>
            <td colSpan='15' className={"boost-name"}>
              {this.boostName()}
            </td>
            <td className="sel-lvl lvl6" colSpan='1'>{values[0]}</td>
            <td className="sel-lvl lvl5" colSpan='2'>{values[1]}</td>
            <td className="sel-lvl lvl4" colSpan='2'>{values[2]}</td>
          </tr>
        );
      } else return null
    }
  }
});

module.exports = ItemRow;
