
import React from 'react';
import DataService from '../DataService.jsx';

var ItemRow = React.createClass({

  componentWillMount: function() {
    this.DataService = DataService();
  },

  boostName: function() {
    return this.DataService.getBoostName(this.props.boostId);
  },

  calculateBoostByLvl: function(lvl) {
    var boost = this.props.item.stats_info[this.props.boostId];
    return this.DataService.calculateLuck(boost[lvl]);
  },

  itemSelected: function(event) {
    var name = event.target.className;
    if (name === 'icon' || name === 'icon-img') return;
    this.props.onItemSelected(this.props.item)
  },

  render: function() {
    var item = this.props.item;

    var clsName = [];
    if (this.props.selected) clsName.push('selected');
    clsName.push(this.props.clsName ? this.props.clsName : 'mini');

    // var icon = <img className="icon-img" width="32" src={'images/'+item.img_base} />;
    var spriteName = "icon-img sprite " + item.sprite;
    var icon = <div id='img32' className={spriteName}/>;
    var openInfoFn = function() { this.props.modalInfo.open(item.href) }.bind(this);

    return (
      <tr className={clsName.join(' ')} onClick={this.itemSelected}>
        {this.props.clsName ? <td className="icon" onClick={openInfoFn}>{icon}</td> : <td className="icon"/>}
        {this.props.clsName ? <td className="item-name">{item.name_ru}</td> : <td className="item-name"/>}
        {false ? <td className="item-name">{item.name_en}</td> : null}
        {this.props.boostId ? <td className="boost-name">{this.boostName()}</td> : null}
        {this.props.boostId ? <td className="lvl6">{this.calculateBoostByLvl(5)}</td> : null}
        {this.props.boostId ? <td className="lvl5">{this.calculateBoostByLvl(4)}</td> : null}
        {this.props.boostId ? <td className="lvl4">{this.calculateBoostByLvl(3)}</td> : null}
        {(this.props.boostId && true) ? null : <td className="game-event">{item.gameEvent}</td>}
      </tr>
    );
  }
});

module.exports = ItemRow;
