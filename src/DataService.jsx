import React from 'react';
import _ from 'lodash';

var singleton;

var DataService = function(Environment) {

  if (!singleton) {


    var Service = function() {
      this.currSet = {
        Helm: null,
        Armor: null,
        Feet: null,
        Weapon: null,
        Accessory: [
          null,
          null,
          null
        ]
      }
    };


    Service.prototype = {

      getItemById: function(id) {
        for (var i = 0, len = this.coresPiecesData.length; i < len; i++) {
          if (this.coresPiecesData[i].href === id) return this.coresPiecesData[i];
        }
        return null;
      },

      selectCoreForEdit: function(setItem) {
        // this.currSetItem = setItem;
        this.selectSetItemForEdit(setItem);
        // TODO: open first tab
      },

      removeCoreFromSet: function(itemForRemove) {
        if (itemForRemove.core.slot !== 'Accessory') {
          this.currSet[itemForRemove.core.slot] = null;
        } else {
          this.currSet.Accessory = this.currSet.Accessory.filter(function(item) {
            return item !== itemForRemove;
          });
        }
        // this.coreRemovedCallback();
      },

      flattenCurrSet: function() {
        var items = [
          this.currSet.Helm,
          this.currSet.Armor,
          this.currSet.Feet,
          this.currSet.Weapon
        ].concat(this.currSet.Accessory);

        return items.filter(function(item) { return item });
      },

      addSetItemToSet: function(setItem) {
        if (setItem.core.slot !== 'Accessory') {
          if (this.currSet[setItem.core.slot]) {
            alert('Slot ' + setItem.core.slot + ' already exist!');
            return null;
          } else {
            this.currSet[setItem.core.slot] = setItem;
          }
        } else {
          var accessoryExists = this.currSet.Accessory.filter(function(item) { return item });
          if (accessoryExists.length > 2) {
            alert('All Accessory slots already exist!');
            return null;
          } else {
            this.currSet.Accessory.push(setItem);
          }
        }

        this.coresSetCallback(this.currSet);
      },

      getColorForBoost: function(boostId) {
        var bName = this.allBoosts[boostId];
        if (bName.indexOf('Attack') >= 0) return 'attack-color';
        if (bName.indexOf('Defense') >= 0) return 'defense-color';
        if (bName.indexOf('Health') >= 0) return 'health-color';
        return 'etc-color';
      },

      getIconNameForBoost: function(boostId) {
        var bName = this.allBoosts[boostId];
        if (bName.indexOf('Cavalry') >= 0) return 'cataphracts.png';
        if (bName.indexOf('Infantry') >= 0) return 'peltasts.png';
        if (bName.indexOf('Ranged') >= 0) return 'rangers.png';
        if (bName.indexOf('Troop') >= 0) return 'troopdefensedebuffresistance.png';
        return '';
      },

      getBoostName: function(boostId) {
        if (this.allBoostsRu && this.allBoostsRu[boostId]) {
          return this.allBoostsRu[boostId];
          // return this.allBoosts[boostId];
        } else {
          return this.allBoosts[boostId];
        }
      },

      getItemBoostRows: function(item) {
        
      },

      getCurrSetItemSummaryTable: function(currSetItem) {
        var calculatedBoosts = this.calculateCurrSetByQuality([currSetItem]);
        return this.getSummaryTable(calculatedBoosts);
      },

      getCurrSetSummaryTable: function(flattenCurrSet) {
        var calculatedBoosts = this.calculateCurrSetByQuality(flattenCurrSet);
        return this.getSummaryTable(calculatedBoosts);
      },

      getSummaryTable: function(calculatedBoosts) {
        // FIXME: WTF with that?
        if (!this.allBoosts) return null;
        if (!calculatedBoosts || calculatedBoosts.length === 0) {
          return null;
        } else {
          var allDebuffs = this.filterDebuffBoosts();
          var debuffs = [];
          var boosts = [];
          var debuffsStrat = [];
          var boostsStrat = [];
          var boostsStrat = [];
          var etcBoosts = [];
          Object.keys(calculatedBoosts).forEach(function(boostId, index) {
            var bName = this.allBoosts[boostId];
            if (!bName) {
              log('Didnt find bName, boostId:', boostId);
            } else if (bName.indexOf('Trap') >= 0 || bName.indexOf('Siege') >= 0 || bName.indexOf('Monster') >= 0
              || bName.indexOf('March') >= 0 || bName.indexOf('Hero') >= 0) {
              etcBoosts.push(boostId);
            } else {
              var isStrat = bName.indexOf('Strat') >= 0;
              if (allDebuffs.indexOf(bName) >= 0) {
                isStrat ? debuffsStrat.push(boostId) : debuffs.push(boostId);
              } else {
                isStrat ? boostsStrat.push(boostId) : boosts.push(boostId);
              }
            }
          }, this);

          var mapFunc = function(boostId, index) {
            var data = calculatedBoosts[boostId];
            var regBoostId = this.stratPairs[boostId];
            var regData = calculatedBoosts[regBoostId];
            var rowColor = this.getColorForBoost(boostId);
            var iconName = this.getIconNameForBoost(boostId);
            return (
              <tr className='first-row' key={'b-'+index}>
                <td className={'sel-icon'}>
                  {iconName ? <img width="24" src={'icons/'+iconName} /> : null}
                </td>
                <td className='sel-boost-name'>{this.getBoostName(boostId)}</td>
                <td className={'sel-lvl lvl6 '}>{this.calculateLuck(regData)}</td>
                <td className={'sel-lvl lvl6 '+rowColor}>{this.calculateLuck(data)}</td>
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[1])}</td>}
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[2])}</td>}
              </tr>
            )
          }

          var mapFuncReg = function(boostId, index) {
            var data = calculatedBoosts[boostId];
            var rowColor = this.getColorForBoost(boostId);
            var iconName = this.getIconNameForBoost(boostId);
            return (
              <tr className='first-row' key={'b-'+index}>
                <td className={'sel-icon'}>
                  {iconName ? <img width="100%" src={'icons/'+iconName} /> : null}
                </td>
                <td className='sel-boost-name'>{this.getBoostName(boostId)}</td>
                <td className={'sel-lvl lvl6 '+rowColor}>{this.calculateLuck(data)}</td>
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[1])}</td>}
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[2])}</td>}
              </tr>
            )
          }

          var rowsSelfStrat = boostsStrat.map(mapFunc, this);
          var rowsDebuffStrat = debuffsStrat.map(mapFunc, this);
          var rowsEtc = etcBoosts.map(mapFuncReg, this);

          var rowsSelf = boosts.map(mapFuncReg, this);
          var rowsDebuff = debuffs.map(mapFuncReg, this);

          // TODO - !!!!!!! rowsSelf.length > rowsSelfStrat.length
          if (rowsSelf.length > rowsSelfStrat.length) {
            console.error('TODO - !!!!!!! rowsSelf.length > rowsSelfStrat.length');
          };

          return (
            <div>
              {(() => {
                if (rowsSelfStrat.length > 0) return (
                  <table className='summarize'>
                    <thead><tr>
                      <th></th>
                      <th>Troop Boosts</th>
                      <th>Regular</th>
                      <th>Strategic</th>
                    </tr></thead>
                    <tbody>
                      {rowsSelfStrat}
                    </tbody>
                  </table>
                );
              })()}
              {(() => {
                if (rowsDebuffStrat.length > 0) return (
                  <table className='summarize'>
                    <thead><tr>
                      <th></th>
                      <th>Enemy Debuffs</th>
                      <th>Regular</th>
                      <th>Strategic</th>
                    </tr></thead>
                    <tbody>
                      {rowsDebuffStrat}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )

        }
      },

      concatBoostsByQuality: function(dest, boostId, boostData, quality) {
        if (!dest[boostId]) {
          dest[boostId] = _.cloneDeep(boostData[quality]);
        } else {
          dest[boostId][0] += boostData[quality][0];
          dest[boostId][1] += boostData[quality][1];
        }
      },

      calculateCurrSetByQuality: function(setItems) {
        var keys, allBoosts = {};

        // TODO: move this to setItem.flatten()
        var flattenItems = {
          items: [],
          qualities: []
        };
        setItems.forEach(function(setItem) {
          flattenItems.items = flattenItems.items.concat([setItem.core].concat(setItem.pieces));
          flattenItems.qualities = flattenItems.qualities.concat([setItem.coreQuality].concat(setItem.piecesQualities));
        });

        // log('setItems:' + setItems.length);
        // console.log(setItems);
        // log('flattenItems:' + flattenItems.items.length);
        // console.log(flattenItems);

        flattenItems.items.forEach(function(item, index) {
          if (item) {
            // log('flatten item next:', item);
            if (item.stats_info) {
              keys = Object.keys(item.stats_info);
              keys.forEach(function(boostId) {
                if (!boostId) {
                  // TODO: need to resolve such invalid stats!
                  // console.error('item with invalid boost:');
                  // console.error(item);
                } else {
                  this.concatBoostsByQuality(allBoosts, boostId, item.stats_info[boostId], 5-flattenItems.qualities[index]);
                }
              }.bind(this));
            } else {
              console.error('item without [stats_info]:');
              console.error(item);
            }
          }
        }.bind(this));

        return allBoosts;
      },

      concatBoosts: function(dest, boostId, boostData) {
        if (!dest[boostId]) {
          // cloning boostData
          dest[boostId] = boostData.map(function(values) {
            return [values[0], values[1]];
          });
        } else {
          dest[boostId] = dest[boostId].map(function(values) {
            values[0] += boostData[index][0];
            values[1] += boostData[index][1];
            return [values[0], values[1]];
          });
        }
      },

      calculateAll: function(items) {
        var keys, allBoosts = {};

        items.forEach(function(item) {
          if (item.stats_info){
            keys = Object.keys(item.stats_info);
            keys.forEach(function(boostId) {
              this.concatBoosts(allBoosts, boostId, item.stats_info[boostId]);
            }.bind(this));
          } else {
            console.error('item without [stats_info]:', item);
          }
        }.bind(this));

        return allBoosts;
      },

      isAnyBoostExist: function(onlyBoosts, statsInfo) {
        for (var i = 0, len = onlyBoosts.length; i < len; ++i) {
          if (undefined !== statsInfo && undefined !== statsInfo[onlyBoosts[i].toString()]) {
            return true;
          }
        }
        return false;
      },

      getFilteredData: function(onlyTypes, onlyEvents, onlyBoosts, onlySlots) {
        var data = this.coresPiecesData.filter(function(item) {
          var type = item.main_info_ru["Equipment Types"];
          var gameEvent = item.main_info_ru["Event"];
          var slot = item.main_info_ru["Slot"];

          var typeFilter = onlyTypes.length === 0 || onlyTypes.indexOf(type) >= 0;
          var eventFilter = onlyEvents.length === 0 || onlyEvents.indexOf(gameEvent) >= 0;
          var slotFilter = onlySlots.length === 0 || onlySlots.indexOf(slot) >= 0;

          return typeFilter && eventFilter && slotFilter;
        }.bind(this));

        return data;
      },

      getBoostFilteredData: function(onlyTypes, onlyEvents, onlyBoosts, onlySlots) {
        var data = this.coresPiecesData.filter(function(item) {
          var typeFilter = onlyTypes.length === 0 || onlyTypes.indexOf(item.type) >= 0;
          var eventFilter = onlyEvents.length === 0 || onlyEvents.indexOf(item.gameEvent) >= 0;
          var slotFilter = onlySlots.length === 0 || onlySlots.indexOf(item.slot) >= 0;
          var boostFilter = this.isAnyBoostExist(onlyBoosts, item.stats_info);

          return typeFilter && eventFilter && slotFilter && boostFilter;
        }.bind(this));

        return data;
      },

      sortByBoost: function(data, boost) {
        data.sort(function(a, b) {
          var value1 = this.calculateLuck(a.stats_info[boost.toString()][5]);
          var value2 = this.calculateLuck(b.stats_info[boost.toString()][5]);
          return value2 - value1;
        }.bind(this));

        return data;
      },

      sortByMultiBoost: function(data, boosts) {
        data.sort(function(a, b) {
          var value1 = 0;
          var value2 = 0;
          for (var i = 0, len = boosts.length; i < len; i++) {
            var boostId = boosts[i].toString();
            var boostA = a.stats_info[boostId];
            var boostB = b.stats_info[boostId];
            if (boostA !== undefined && boostA[5] !== undefined)
              value1 += this.calculateLuck(boostA[5]);
            if (boostB !== undefined && boostB[5] !== undefined)
              value2 += this.calculateLuck(boostB[5]);
          };
          return value2 - value1;
        }.bind(this));

        return data;
      },

      round: function(original) {
        return Math.round(original*100)/100;
      },

      simpleShow: function(arr, highRangeBoost) {
        if (!highRangeBoost) highRangeBoost = 1;
        if (arr === null) {
          return null;
        } else {
          return arr[0] + "-" + arr[1]*highRangeBoost;
        }
      },

      calculateLuck: function(arr, highRangeBoost) {
        if (!arr) return null;
        if (arr[0] === null || arr[0] === undefined) return null;
        if (arr[1] === null || arr[1] === undefined) return null;

        if (!highRangeBoost) highRangeBoost = 1;
        var CRAFT_CORES_LUCK = 0.8;
        var min = arr[0],
            max = arr[1]*highRangeBoost;

        var delta = (max-min)*(CRAFT_CORES_LUCK);
        var new_min = min + delta;
        var average = max - (max - new_min) / 2.0;

        return this.round(average);
      },

      filterDebuffBoosts: function(boosts) {
        var items = boosts ? boosts : this.allBoosts;
        if (!items) return null;
        return items.filter(function(item) {
          return item.indexOf('Debuff') >= 0;
        });
      },

      filterStratBoosts: function(boosts) {
        var items = boosts ? boosts : this.allBoosts;
        if (!items) return null;
        return items.filter(function(item) {
          return item.indexOf('Strat') >= 0;
        });
      },

      loadBoosts: function(data) {
        this.stratPairs = {
          "13": "3",
          "14": "4",
          "15": "5",
          "16": "6",
          "17": "7",
          "18": "8",
          "19": "9",
          "20": "10",
          "21": "11",
          "22": "25",
          "23": "26",
          "24": "27",
          "40": "0",
          "41": "1",
          "42": "2",
          "43": "30",
          "44": "31",
          "45": "32",
          "46": "35",
          "47": "36",
          "48": "37",
          "49": "55",
          "50": "56",
          "51": "57",
          "52": "58",
          "53": "59"
        }
        this.allBoosts = $.map(data, function(el) { return el.replace('Strategic', 'Strat') });
      },

      loadBoostsRu: function(data) {
        this.allBoostsRu = $.map(data, function(el) { return el });
      },

      loadData: function(data) {
        for (var i = data.length - 1; i >= 0; i--) {
          // TODO need models:
          data[i].type = data[i].main_info_ru["Equipment Types"];
          data[i].gameEvent = data[i].main_info_ru["Event"];
          data[i].slot = data[i].main_info_ru["Slot"];
          data[i].sprite = data[i].img_base.replace('.png', '');
        };
        this.coresPiecesData = data;
        this.events = this.getUniqEvents(data);
      },

      isReady: function() {
        return this.events && this.coresPiecesData && this.allBoosts && this.allBoostsRu;
      },

      getUniqEvents: function(data) {
        var uniqueEvents = data.map(function(item) {
          if (item.gameEvent === undefined) {
            item.gameEvent = 'Unknown';
            return 'Unknown';
          } else {
            return item.gameEvent;
          }
        });
        uniqueEvents = uniqueEvents.filter(function(item, index) {
          return uniqueEvents.indexOf(item) === index;
        });
        return uniqueEvents.sort();
      },

    };

    singleton = new Service();
  }

  return singleton;
};

module.exports = DataService;