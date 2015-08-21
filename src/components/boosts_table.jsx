/** @jsx React.DOM */
var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var _ = require('lodash');

module.exports = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    this.qualities = ['gray','white','green','blue','purple','gold'];//.reverse();
    return null;
  },
  boostsConcat: function(dest, source) {
    dest.level_values.forEach(function(lvl, index) {
      lvl[0] = this.round(lvl[0] + source.level_values[index][0]);
      lvl[1] = this.round(lvl[1] + source.level_values[index][1]);
    }.bind(this));
  },
  getBoostsSum: function(allBoosts) {
    var summedBoosts = [];
    var i;

    allBoosts.forEach(function(boost) {
      item = this.findItem(summedBoosts, function(existed) {return existed.boost_id == boost.boost_id});
      if (item)
        this.boostsConcat(item, boost);
      else
        summedBoosts.push(boost);
    }.bind(this));

    return summedBoosts;
  },

  getAllBoosts: function() {
    var boosts = [];
    var selectedQualities = [];
    var qindex;

    this.props.data.forEach(function(piece) {
      if (this.props.class_name != 'ttip') {
        qindex = _.indexOf(this.qualities, piece.quality);
      } else {
        qindex = -1;
      }
      piece.boosts.forEach(function(originalBoost) {
        var boost = _.cloneDeep(originalBoost);
        if (qindex >= 0) {
          boost.level_values.unshift(_.cloneDeep(boost.level_values[qindex]));
        } else {
          // boost.level_values.unshift([0, 0]);
        }
        boosts.push(boost);
      });
    }.bind(this));

    this.allBoosts = _.cloneDeep(boosts);
    var result = this.getBoostsSum(this.allBoosts);
    // result.forEach(function(piece) {};);

    return result;
  },

  findItem: function(array, predicate) {
    var length = array.length,
        index = -1;

    while (++index < length) {
      if (predicate(array[index])) {
        return array[index];
      }
    }
    return null;
  },

  round: function(original) {
    return Math.round(original*100)/100;
  },

  parseLvl: function(arr) {
    // or simple range view:
    // return arr[0] + "-" + arr[1];

    // or calculate with luck param
    var CRAFT_CORES_LUCK = 0.8;
    var min = arr[0],
        max = arr[1];

    var delta = (max-min)*(CRAFT_CORES_LUCK);
    var new_min = min + delta;
    var average = max - (max - new_min) / 2.0;

    return this.round(average);
  },

  getClassName: function(arr) {
    return (this.props.class_name || "");
  },

  getHeaderStyle: function() {
    return this.props.class_name == 'ttip' ? {display: 'inline'} : {display: 'none'};
  },

  renderTablePart: function(header, predicate) {
    var lvl_values = this.getAllBoosts().map(function(item, i) {
      if (predicate(item)) {
        return (
          <tr key={i}>
            <td className='boost_name'>{item.short_name}</td>
            {item.level_values.map(function(lvl, i) {
              if (i === 0 && this.props.class_name != 'ttip')
                return (<td className='selected_sum' key={'b'+i}>{this.parseLvl(lvl)}</td>);
              else
                return (<td key={'b'+i}>{this.parseLvl(lvl)}</td>);
            }.bind(this))}
          </tr>
        );
      }
    }.bind(this));

    lvl_values = lvl_values.filter(function(n){return n});

    var selectedRow;
    if (this.props.class_name != 'ttip') {
      selectedRow = <th>Selected</th>
    } else {
      selectedRow = null;
    }

    if (lvl_values.length > 0) {
      return (
        <div>
          <table className={this.getClassName()}>
            
            <thead>
              <tr>
                <th>{header}</th>
                {selectedRow}
                <th>Lvl1</th>
                <th>Lvl2</th>
                <th>Lvl3</th>
                <th>Lvl4</th>
                <th>Lvl5</th>
                <th>Lvl6</th>
              </tr>
            </thead>

            <tbody>
              {lvl_values}
            </tbody>

          </table>
        </div>
      );
    } else {
      return null;
    }
  },

  render: function() {
    if (this.props.data == null || this.props.data.length <= 0) return null;

    return (
      <div>
        <div className='piece_name' style={this.getHeaderStyle()}>
          {this.props.data[0].name}
        </div>
        {this.renderTablePart('Strategic attack:', function(item) { return item.strat && !item.debuff && item.attack })}
        {this.renderTablePart('Strategic defense:', function(item) { return item.strat && !item.debuff && (item.defense || item.health) })}
        {this.renderTablePart('Debuff:', function(item) { return item.debuff })}
        {this.renderTablePart('Other:', function(item) { return !item.strat && !item.debuff })}
      </div>
    );
  }
});
