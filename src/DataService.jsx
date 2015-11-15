import React from 'react';
import _ from 'lodash';
import i18n from 'i18n-js';

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

      this.regularPairs = {};
      Object.keys(this.stratPairs).forEach(function(stratKey) {
        this.regularPairs[this.stratPairs[stratKey]] = stratKey;
      }, this);
    };


    Service.prototype = {

      getItemById: function(id) {
        for (var i = 0, len = this.coresPiecesData.length; i < len; i++) {
          if (this.coresPiecesData[i].href === id) return this.coresPiecesData[i];
        }
        return null;
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

      getItemName: function(item) {
        return i18n.currentLocale() === 'ru' ? item.name_ru : item.name_en;
      },

      getBoostName: function(boostId) {
        if (i18n.currentLocale() === 'ru') {
          var ruName = this.allBoostsRu && this.allBoostsRu[boostId]
          return ruName ? this.allBoostsRu[boostId] : this.allBoosts[boostId];
        } else {
          return this.allBoosts[boostId];
        }
      },

      getItemBoostRows: function(item) {
        // SHOW ALL BOOSTS of item in ItemsList and ModalInfo
      },

      getCurrSetItemSummaryTable: function(currSetItem) {
        var calculatedBoosts = this.calculateCurrSetByQuality([currSetItem]);
        return this.getSummaryTable(calculatedBoosts);
      },

      getCurrSetSummaryTable: function(flattenCurrSet) {
        var calculatedBoosts = this.calculateCurrSetByQuality(flattenCurrSet);
        return this.getSummaryTable(calculatedBoosts);
      },

      isEtcBoost: function(boostName) {
        return (
          boostName.indexOf('Trap') >= 0 ||
          boostName.indexOf('Siege') >= 0 ||
          boostName.indexOf('Monster') >= 0 ||
          boostName.indexOf('Speed') >= 0 ||
          boostName.indexOf('Hero') >= 0 ||
          boostName.indexOf('Food') >= 0
        )
      },

      getSummaryTable: function(calculatedBoosts) {
        var debuffs = [];
        var boosts = [];
        var debuffsStrat = [];
        var boostsStrat = [];
        var boostsStrat = [];
        var etcBoosts = [];

        // FIXME: WTF with that?
        // при старте бывает что мы попадаем сюда, а бустов внезапно нет
        if (!this.allBoosts) return null;

        if (!calculatedBoosts || calculatedBoosts.length === 0) {
          return null;
        } else {
          var allDebuffs = this.filterDebuffBoosts();
          Object.keys(calculatedBoosts).forEach(function(boostId) {
            var bName = this.allBoosts[boostId];
            if (!bName) {
              console.error('Didnt find bName, boostId:'+boostId);
            } else if (this.isEtcBoost(bName)) {
              etcBoosts.push(boostId);
            } else {
              var isStrat = bName.indexOf('Strat') >= 0;
              if (allDebuffs.indexOf(bName) >= 0) {
                isStrat ? debuffsStrat.push(boostId) : debuffs.push(boostId);
              } else {
                isStrat ?  boostsStrat.push(boostId) : boosts.push(boostId);
              }
            }
          }, this);


          // если есть бусты только на регулярные войска
          if (boosts.length > boostsStrat.length) {
            console.error('TODO - !!!!!!! Regular.length > Strategic.length');
            boosts.forEach(function(boostId) {
              var stratBoostId = this.regularPairs[boostId];
              if (boostsStrat.indexOf(stratBoostId) === -1) {
                boostsStrat.push(stratBoostId);
                console.error('  added '+stratBoostId+': '+this.getBoostName(stratBoostId));
              }
            }, this);
          };
          // если есть дебаффы только на регулярные войска
          if (debuffs.length > debuffsStrat.length) {
            console.error('TODO - !!!!!!! Debuffs Regular.length > Strategic.length');
            debuffs.forEach(function(boostId) {
              var stratBoostId = this.regularPairs[boostId];
              if (debuffsStrat.indexOf(stratBoostId) === -1) {
                debuffsStrat.push(stratBoostId);
                console.error('  added '+stratBoostId+': '+this.getBoostName(stratBoostId));
              }
            }, this);
          };

          var mapFunc = function(boostId, index) {
            var strategicData = calculatedBoosts[boostId];
            var regBoostId = this.stratPairs[boostId];
            var regData = calculatedBoosts[regBoostId];

            var valueRegular = this.calculateLuck(regData);
            var valueStrategic = this.calculateLuck(strategicData);

            var rowColor = this.getColorForBoost(boostId);
            var iconName = this.getIconNameForBoost(boostId);
            return (
              <tr className='first-row' key={'b-'+index}>
                <td className={'sel-icon'}>
                  {iconName ? <img width="24" src={'icons/'+iconName} /> : null}
                </td>
                <td className='sel-boost-name'>
                  {this.getBoostName(regBoostId)}
                </td>
                <td className={'sel-lvl lvl6 '}>
                  {valueRegular}
                </td>
                <td className={'sel-lvl lvl6 '+rowColor}>
                  {valueStrategic}
                </td>
              </tr>
            )
          }

          var mapFuncEtc = function(boostId, index) {
            var data = calculatedBoosts[boostId];
            var rowColor = this.getColorForBoost(boostId);
            var iconName = this.getIconNameForBoost(boostId);
            return (
              <tr className='first-row' key={'b-'+index}>
                <td className={'sel-icon'}>
                  {iconName ? <img width="100%" src={'icons/'+iconName} /> : null}
                </td>
                <td className='sel-boost-name'>{this.getBoostName(boostId)}</td>
                <td className={'sel-lvl lvl6 '} />
                <td className={'sel-lvl lvl6 '+rowColor}>{this.calculateLuck(data)}</td>
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[1])}</td>}
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[2])}</td>}
              </tr>
            )
          }

          var rowsSelfStrat = boostsStrat.map(mapFunc, this);
          var rowsDebuffStrat = debuffsStrat.map(mapFunc, this);
          var rowsEtc = etcBoosts.map(mapFuncEtc, this);

          return (
            <div>
              {(() => {
                if (rowsSelfStrat.length > 0) return (
                  <table className='summarize'>
                    <thead><tr>
                      <th></th>
                      <th>{i18n.t('summary.boosts')}</th>
                      <th>{i18n.t('summary.regular')}</th>
                      <th>{i18n.t('summary.strategic')}</th>
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
                      <th>{i18n.t('summary.debuffs')}</th>
                      <th>{i18n.t('summary.regular')}</th>
                      <th>{i18n.t('summary.strategic')}</th>
                    </tr></thead>
                    <tbody>
                      {rowsDebuffStrat}
                    </tbody>
                  </table>
                );
              })()}

              {(() => {
                if (rowsEtc.length > 0) return (
                  <table className='summarize'>
                    <thead><tr>
                      <th></th>
                      <th>{i18n.t('summary.etc')}</th>
                      <th>{i18n.t('summary.regular')}</th>
                      <th>{i18n.t('summary.strategic')}</th>
                    </tr></thead>
                    <tbody>
                      {rowsEtc}
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

        // TODO: move this to Models/SetItem.flatten()
        var flattenItems = {
          items: [],
          qualities: []
        };

        setItems.forEach(function(setItem) {
          flattenItems.items = flattenItems.items.concat([setItem.core].concat(setItem.pieces));
          flattenItems.qualities = flattenItems.qualities.concat([setItem.coreQuality].concat(setItem.piecesQualities));
        });

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
              }, this);
            } else {
              console.error('item without [stats_info]:');
              console.error(item);
            }
          }
        }, this);

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
            }, this);
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
        if (!arr || !arr[0] || !arr[1]) return null;

        if (!highRangeBoost) highRangeBoost = 1;
        // TODO move CRAFT_CORES_LUCK & highRangeBoost to SETTINGS
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