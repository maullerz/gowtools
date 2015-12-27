import React from 'react';
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
          if (this.coresPiecesData[i].id === id) return this.coresPiecesData[i];
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
        if (!bName) {
          console.error('cannot find boost: '+boostId);
          return '';
        };
        if (bName.indexOf('Attack') >= 0) return ' attack-color';
        if (bName.indexOf('Defense') >= 0) return ' defense-color';
        if (bName.indexOf('Health') >= 0) return ' health-color';
        return '';
      },

      getIconNameForBoost: function(boostId) {
        var bName = this.allBoosts[boostId];
        if (!bName) {
          console.log('cannot find boost: '+boostId);
          return '';
        };
        if (bName.indexOf('Cavalry') >= 0) return 'warelephant128.png';
        if (bName.indexOf('Infantry') >= 0) return 'immortals128.png';
        if (bName.indexOf('Ranged') >= 0) return 'marksmen128.png';
        if (bName.indexOf('Troop') >= 0) return 'gear_icon.png';
        return '';
      },

      getItemName: function(item) {
        return item.name[i18n.currentLocale()];
      },

      getSlotName: function(item) {
        return i18n.t('items-list.'+item.slot);
      },

      getBoostName: function(boostId) {
        if (i18n.currentLocale() === 'ru') {
          return this.allBoostsRu[boostId];
        } else {
          return this.allBoosts[boostId];
        }
      },

      getEventName: function(eventId) {
        return this.events[i18n.currentLocale()][eventId];
      },

      getCurrSetItemSummaryTable: function(currSetItem) {
        var calculatedBoosts = this.calculateCurrSetByQuality([currSetItem]);
        return this.getSummaryTable(calculatedBoosts, 'set-item-statistics');
      },

      getCurrSetSummaryTable: function(flattenCurrSet) {
        var calculatedBoosts = this.calculateCurrSetByQuality(flattenCurrSet);
        return this.getSummaryTable(calculatedBoosts, 'statistics-right-group');
      },

      isEtcBoost: function(boostName) {
        return (
          boostName.indexOf('Trap') >= 0 ||
          boostName.indexOf('Siege') >= 0 ||
          boostName.indexOf('Monster') >= 0 ||
          boostName.indexOf('Speed') >= 0 ||
          boostName.indexOf('Hero') >= 0 ||
          boostName.indexOf('No data') >= 0 ||
          boostName.indexOf('Food') >= 0
        )
      },

      sortBoosts: function(boostsArr) {
        var debuffs = [];
        var boosts = [];
        var debuffsStrat = [];
        var boostsStrat = [];
        var etcBoosts = [];
        var allDebuffs = this.filterDebuffBoosts();

        boostsArr.forEach(function(boostId) {
          var bName = this.allBoosts[boostId];
          if (!bName) {
            console.error('Didnt find bName, boostId:'+boostId);
          } else if (this.isEtcBoost(bName)) {
            etcBoosts.push(boostId);
          } else {
            // var isStrat = bName.indexOf('Strat') >= 0;
            // if (allDebuffs.indexOf(bName) >= 0) {
            //   isStrat ? debuffsStrat.push(boostId) : debuffs.push(boostId);
            // } else {
            //   isStrat ?  boostsStrat.push(boostId) : boosts.push(boostId);
            // }
            if (allDebuffs.indexOf(bName) >= 0) {
              debuffs.push(boostId);
            } else {
              boosts.push(boostId);
            }
          }
        }, this);

        return boosts.concat(debuffs).concat(etcBoosts);
      },

      getSimpleSummaryTable: function(itemBoosts) {
        var boostsArr = Object.keys(itemBoosts);
        boostsArr = this.sortBoosts(boostsArr);

        var rows = boostsArr.map(function(boostId, index) {
          var boost = itemBoosts[boostId];
          var rowColor = this.colorizeStats ? this.getColorForBoost(boostId) : '';
          var iconName = this.getIconNameForBoost(boostId);

          return (
            <tr className={'first-row'+rowColor} key={'b-'+index}>
              <td className='sel-icon'>
                {iconName ? <img className="boost-icon" src={'icons/'+iconName} /> : null}
              </td>
              <td className='sel-boost-name'>
                {this.getBoostName(boostId)}
              </td>
              <td className={'lvl lvl6'}>
                  {this.simpleShow(boost[5])}
              </td>
              <td className='lvl'>{this.simpleShow(boost[4])}</td>
              <td className='lvl'>{this.simpleShow(boost[3])}</td>
              <td className='lvl'>{this.simpleShow(boost[2])}</td>
              <td className='lvl'>{this.simpleShow(boost[1])}</td>
              <td className='lvl'>{this.simpleShow(boost[0])}</td>
            </tr>
          )
        }, this);

        return (
          <div className='item-statistics'>
            <table className='summarize'>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        );
      },

      getSummaryTable: function(calculatedBoosts, summaryTableClass) {
        var debuffs = [];
        var boosts = [];
        var debuffsStrat = [];
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
            boosts.forEach(function(boostId) {
              var stratBoostId = this.regularPairs[boostId];
              if (boostsStrat.indexOf(stratBoostId) === -1) {
                boostsStrat.push(stratBoostId);
              }
            }, this);
          };
          // если есть дебаффы только на регулярные войска
          if (debuffs.length > debuffsStrat.length) {
            debuffs.forEach(function(boostId) {
              var stratBoostId = this.regularPairs[boostId];
              if (debuffsStrat.indexOf(stratBoostId) === -1) {
                debuffsStrat.push(stratBoostId);
              }
            }, this);
          };

          var mapFunc = function(boostId, index) {
            var strategicData = calculatedBoosts[boostId];
            var regBoostId = this.stratPairs[boostId];
            var regData = calculatedBoosts[regBoostId];
            var rowColor = this.colorizeStats ? this.getColorForBoost(boostId) : '';
            var iconName = this.getIconNameForBoost(boostId);

            var valueRegular = this.calculateLuck(regData);
            var valueStrategic = this.calculateLuck(strategicData);

            return (
              <tr className={'first-row'+rowColor} key={'b-'+index}>
                <td className={'sel-icon'}>
                  {iconName ? <img className="boost-icon" src={'icons/'+iconName} /> : null}
                </td>
                <td className='sel-boost-name'>
                  {this.getBoostName(regBoostId)}
                </td>
                <td className={'sel-lvl lvl6'}>
                  {valueStrategic}
                </td>
                <td className={'sel-lvl lvl6'}>
                  {valueRegular}
                </td>
              </tr>
            )
          }

          var mapFuncEtc = function(boostId, index) {
            var data = calculatedBoosts[boostId];
            return (
              <tr className='first-row' key={'etc-'+index}>
                <td className='sel-boost-name etc'>{this.getBoostName(boostId)}</td>
                <td className={'sel-lvl lvl6'}>{this.calculateLuck(data)}</td>
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[1])}</td>}
                {true?null:<td className='sel-lvl'>{this.calculateLuck(data[2])}</td>}
              </tr>
            )
          }

          var rowsSelfStrat = boostsStrat.map(mapFunc, this);
          var rowsDebuffStrat = debuffsStrat.map(mapFunc, this);
          var rowsEtc = etcBoosts.map(mapFuncEtc, this);

          return (
            <div className={summaryTableClass}>
              {(() => {
                if (rowsSelfStrat.length > 0) return (
                  <table className='summarize'>
                    {summaryTableClass !== 'item-statistics' ? (
                      <thead><tr>
                        <th></th>
                        <th>{i18n.t('summary.boosts')}</th>
                        <th className='lvl-head'>{i18n.t('summary.strategic')}</th>
                        <th className='lvl-head'>{i18n.t('summary.regular')}</th>
                      </tr></thead>
                    ) : null}
                    <tbody>
                      {rowsSelfStrat}
                    </tbody>
                  </table>
                );
              })()}

              {(() => {
                if (rowsDebuffStrat.length > 0) return (
                  <table className='summarize'>
                    {summaryTableClass !== 'item-statistics' ? (
                      <thead><tr>
                        <th></th>
                        <th>{i18n.t('summary.debuffs')}</th>
                        <th className='lvl-head'>{i18n.t('summary.strategic')}</th>
                        <th className='lvl-head'>{i18n.t('summary.regular')}</th>
                      </tr></thead>
                    ) : null}
                    <tbody>
                      {rowsDebuffStrat}
                    </tbody>
                  </table>
                );
              })()}

              {(() => {
                if (rowsEtc.length > 0) return (
                  <table className='summarize'>
                    {summaryTableClass !== 'item-statistics' ? (
                      <thead><tr>
                        <th>{i18n.t('summary.etc')}</th>
                        <th></th>
                      </tr></thead>
                    ) : null}
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
          dest[boostId] = [
            boostData[quality][0],
            boostData[quality][1]
          ];
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
            if (item.stats) {
              keys = Object.keys(item.stats);
              keys.forEach(function(boostId) {
                if (!boostId) {
                  // TODO: need to resolve such invalid stats!
                  // console.error('item with invalid boost:');
                  // console.error(item);
                } else {
                  this.concatBoostsByQuality(allBoosts, boostId, item.stats[boostId], 5-flattenItems.qualities[index]);
                }
              }, this);
            } else {
              console.error('item without [stats]:');
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
          if (item.stats){
            keys = Object.keys(item.stats);
            keys.forEach(function(boostId) {
              this.concatBoosts(allBoosts, boostId, item.stats[boostId]);
            }, this);
          } else {
            console.error('item without [stats]:', item);
          }
        }.bind(this));

        return allBoosts;
      },

      isAnyBoostExist: function(onlyBoosts, statsInfo) {
        for (var i = 0, len = onlyBoosts.length; i < len; ++i) {
          if (statsInfo && statsInfo[onlyBoosts[i].toString()]) {
            return true;
          }
        }
        return false;
      },

      isBoostExist: function(boost) {
        for (var i = 0, len = this.coresPiecesData.length; i < len; ++i) {
          var item = this.coresPiecesData[i];
          if (item.stats && item.stats[boost.toString()]) return true;
        }
        return false;
      },

      isEventExist: function(event) {
        for (var i = 0, len = this.coresPiecesData.length; i < len; ++i) {
          var item = this.coresPiecesData[i];
          if (item.info.event && item.info.event[i18n.currentLocale()] === event) return true;
        }
        return false;
      },

      getSortedAndFilteredData: function(onlyTypes, onlyEvents, onlyBoosts, onlySlots) {
        var filteredData = this.getFilteredData(onlyTypes, onlyEvents, onlyBoosts, onlySlots);

        if (onlyBoosts.length === 1) {
          return this.sortByBoost(filteredData, onlyBoosts[0]);
        } else if (onlyBoosts.length > 1) {
          return this.sortByMultiBoost(filteredData, onlyBoosts);
        }

        return filteredData;
      },

      getFilteredData: function(onlyTypes, onlyEvents, onlyBoosts, onlySlots) {
        var typeMatch, eventMatch, slotMatch, boostMatch;

        var data = this.coresPiecesData.filter(function(item) {
          typeMatch = onlyTypes.length === 0 || onlyTypes.indexOf(item.type) >= 0;
          eventMatch = onlyEvents.length === 0 || onlyEvents.indexOf(item.eventId) >= 0;
          slotMatch = onlySlots.length === 0 || onlySlots.indexOf(item.slot) >= 0;
          if (onlyBoosts.length > 0) {
            boostMatch = this.isAnyBoostExist(onlyBoosts, item.stats);
          } else {
            boostMatch = true;
          }

          return typeMatch && eventMatch && slotMatch && boostMatch;
        }.bind(this));

        return data;
      },

      sortByBoost: function(data, boost) {
        data.sort(function(a, b) {
          var value1 = this.calculateLuck(a.stats[boost.toString()][5]);
          var value2 = this.calculateLuck(b.stats[boost.toString()][5]);
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
            var boostA = a.stats[boostId];
            var boostB = b.stats[boostId];
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
        return (Math.round(original*100)/100).toFixed(2);
      },

      simpleShow: function(arr) {
        if (arr) {
          return arr[0] + " - " + (arr[1] || 0);
        }
        return null;
      },

      calculateLuck: function(arr, highRangeBoost) {
        if (!arr || !arr[0] || !arr[1]) return null;

        // TODO get approximate highRangeBoost value
        if (!highRangeBoost) highRangeBoost = 1;

        let CRAFT_CORES_LUCK = this.coreCraftLuck ? 0.8 : 0;

        let min = arr[0],
            max = arr[1]*highRangeBoost;

        let delta = (max-min)*(CRAFT_CORES_LUCK);
        let new_min = min + delta;
        let average = max - (max - new_min) / 2.0;

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
        this.allBoosts = Object.keys(data).map(function(el) {
          return data[el].replace('Strategic', 'Strat')
        }, this);
      },

      loadBoostsRu: function(data) {
        this.allBoostsRu = Object.keys(data).map(function(el) {
          return data[el] //.replace('Понижение', 'Дебафф')
        }, this);
      },

      loadData: function(data) {
        // various data preparing
        for (var i = data.length - 1; i >= 0; i--) {
          if (data[i].type === "Crafting Recipes") {
            data[i] = null;
          } else {
            data[i].sprite = data[i].img_base.replace('.png', '');
            if (data[i].info.event) {
              data[i].event = data[i].info.event.en;
            }
          }
        };

        data = data.filter(function(item){ return item });
        this.coresPiecesData = data;

        // отсортированный массив Событий с айдишниками для фильтра
        this.events = {};
        this.events.en = this.getUniqEvents(data);
        this.events.ru = this.getUniqEventsRu(this.events.en);
        // проставляем айдишники каждому итему чтобы не возиться со строками
        for (var i = data.length - 1; i >= 0; i--) {
          data[i].eventId = this.events.en.indexOf(data[i].event);
        };
      },

      isReady: function() {
        return this.events && this.coresPiecesData && this.allBoosts && this.allBoostsRu;
      },

      getUniqEvents: function(data) {
        // fix undefined and incorrect data
        var uniqueEvents = data.map(function(item) {
          if (item.event === undefined) {
            item.event = 'Epic Snow Chests';
          }
          return item.event;
        });
        // remove duplicates
        uniqueEvents = uniqueEvents.filter(function(item, index) {
          return uniqueEvents.indexOf(item) === index;
        });
        return uniqueEvents.sort();
      },

      getUniqEventsRu: function(events) {
        var uniqueEvents = events.map(function(eventName, index) {
          var eventRu, itemIndex;
          if (eventName === 'Epic Snow Chests') {
            eventRu = 'Эпические снежные сундуки';
          } else {
            itemIndex = this.coresPiecesData.findIndex(function(item) { return item.event === eventName });
            eventRu = this.coresPiecesData[itemIndex].info.event.ru;
          }
          return eventRu;
        }, this);
        return uniqueEvents;
      },

    };

    singleton = new Service();
  }

  return singleton;
};

module.exports = DataService;
