import React from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import Well from 'react-bootstrap/lib/Well'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

import DataService from '../DataService.jsx'
import CoresSetModel from '../models/CoresSet'
import SetItemBox from './SetItemBox.jsx'

var SummaryInfoBox = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'coresSet';
  },

  getStateFilterKeys: function() {
    return ['coresSet'];
  },

  getInitialState: function() {
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
    var coresSet = new CoresSetModel();
    return {
      activeKey: 'set-item-0',
      coresSet: coresSet
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.firstRender = true; // because of loading set from localStorage that need to be calculated
  },

  flattenCoresSet: function() {
    var items = [
      this.state.coresSet.Helm,
      this.state.coresSet.Armor,
      this.state.coresSet.Feet,
      this.state.coresSet.Weapon
    ].concat(this.state.coresSet.Accessory);

    return items.filter(function(item) { return item });
  },

  isEqualItems: function(first, second) {
    var result = false;
    if (Array.isArray(second)) {
      result = second.every(function(accessory) {
        return this.isEqualItems(first, accessory);
      }, this);
    } else {
      result = first.core && second.core && first.core.id === second.core.id;
      result = result && (first.coreQuality === second.coreQuality);
      result = result && (first.pieces.length === second.pieces.length)
      result = result && first.pieces.every(function(piece, index) {
        return piece.id === second.pieces[index].id && first.piecesQualities[index] === second.piecesQualities[index];
      }, this);
    }

    return result;
  },

  getItemState: function(setItem) {
    // 'plus' / 'minus' / 'exchange'
    if (setItem.core.slot !== 'Accessory') {
      if (this.state.coresSet[setItem.core.slot]) {
        if (this.isEqualItems(setItem, this.state.coresSet[setItem.core.slot])) {
          return 'minus';
        } else {
          return 'transfer';
        }
      } else {
        return 'plus';
      }
    } else {
      if (this.state.coresSet.Accessory.length < 3) {
        return 'plus';
      } else {
        if (this.isEqualItems(setItem, this.state.coresSet.Accessory)) {
          return 'minus';
        } else {
          return 'transfer';
        }
      }
    }
  },

  addSetItemToSet: function(setItem, isAll) {
    var state = this.getItemState(setItem);
    if (setItem.core.slot !== 'Accessory') {
      if (state === 'plus' || state === 'transfer') {
        this.state.coresSet[setItem.core.slot] = setItem;
      } else if (state === 'minus') {
        this.state.coresSet[setItem.core.slot] = null;
        this.state.activeKey = 'set-item-0';
      }
    } else {
      if (state === 'plus') {
        if (isAll) {
          this.state.coresSet.Accessory = [setItem, setItem, setItem];
        } else {
          this.state.coresSet.Accessory.push(setItem);
        }
      } else if (state === 'transfer') {
        if (isAll) {
          this.state.coresSet.Accessory = [setItem, setItem, setItem];
        } else {
          this.state.coresSet.Accessory.shift();
          this.state.coresSet.Accessory.push(setItem);
        }
      } else if (state === 'minus') {
        this.state.activeKey = 'set-item-0';
        if (isAll) {
          this.state.coresSet.Accessory = [];
        } else {
          var index = this.state.coresSet.Accessory.findIndex(function(accessory) {
            return this.isEqualItems(setItem, accessory);
          }, this);
          this.state.coresSet.Accessory.splice(index, 1);
        }
      }
    }
    this.setState({
      activeKey: this.state.activeKey,
      coresSet: this.state.coresSet
    });
  },

  getActiveSetItem: function() {
    var setItem = this.flattenCoresSet().filter(function(setItem, index) {
      return this.state.activeKey === 'set-item-'+index
    }, this);

    return setItem[0];
  },

  qualitySelected: function(item, quality) {
    var setItem = this.getActiveSetItem();

    if (item.type === 'Core') {
      setItem.coreQuality = quality;
    } else if (item.type === 'Piece') {
      var ix = setItem.pieces.findIndex(function(piece) {
        return piece.id === item.id;
      });
      if (ix >= 0) {
        setItem.piecesQualities[ix] = quality;
      };
    }

    this.forceUpdate();
  },

  openQualitySelect: function(item) {
    this.props.modalQualitySelect.open(item, null);
  },

  renderCurrSet: function(flattenItems) {
    return flattenItems.map(function(setItem, index) {
      if (setItem.core) {
        var quality = this.qualities[setItem.coreQuality];
        var spriteName = 'sprite ' + setItem.core.sprite;
        var coreNode = (
          <div className={'sel-item-core '+quality}>
            <div id='img64' className={spriteName} />
          </div>
        );
      };

      var pieceNodes = setItem.pieces.map(function(piece, ix) {
        var quality = this.qualities[setItem.piecesQualities[ix]];
        var spriteName = 'sprite ' + piece.sprite;
        return (
          <div className={'sel-item '+quality} key={"piece-coreset-" + ix}>
            <div id='img32' className={spriteName} />
          </div>
        );
      }.bind(this));

      var removeFunc = function() { this.removeSetItemFromSet(setItem); this.forceUpdate(); }.bind(this);
      var key = "set-item-"+index;
      var active = this.state.activeKey === key;

      return (
        <SetItemBox key={key} tmpKey={key} active={active} onActivate={this.setItemActivated}
          setItem={setItem} openInfo={this.openQualitySelect} />
      )
    }.bind(this));
  },

  setItemActivated: function(key) {
    this.setState({ activeKey: key });
  },

  removeSetItemFromSet: function(setItemToRemove) {
    if (setItemToRemove.core.slot !== 'Accessory') {
      this.state.coresSet[setItemToRemove.core.slot] = null;
    } else {
      this.state.coresSet.Accessory = this.state.coresSet.Accessory.filter(function(item) {
        return item !== setItemToRemove;
      });
    }
    this.setState({
      activeKey: 'set-item-0',
      coresSet: this.state.coresSet
    });
  },

  removeSetItem: function() {
    if (this.state.activeKey) {
      var setItem = this.getActiveSetItem();

      if (setItem) {
        var remove = function(buttonIndex) {
          if (buttonIndex === 1) this.removeSetItemFromSet(setItem);
        }.bind(this);

        if (this.props.platform === 'browser') {
          if (window.confirm(i18n.t('summary.confirm-remove'))) remove(1);
        } else {
          navigator.notification.confirm(
            i18n.t('summary.confirm-remove'),
            remove,
            i18n.t('craftedbox.confirm-title')
          );
        }

      }
    };
  },

  editSetItem: function() {
    if (this.state.activeKey) {
      var setItem = this.getActiveSetItem();
      if (setItem) {
        this.props.selectSetItemForEdit(setItem);
        this.props.tabSelect(1);
      }
    };
  },

  clearSet: function() {
    var clearAll = function(buttonIndex) {
      if (buttonIndex === 1) {
        this.setState({
          coresSet: new CoresSetModel(),
          activeKey: 'set-item-0',
        });
      }
    }.bind(this);

    if (this.props.platform === 'browser') {
      if (window.confirm(i18n.t('summary.confirm-clear-all'))) clearAll(1);
    } else {
      navigator.notification.confirm(
        i18n.t('summary.confirm-clear-all'),
        clearAll,
        i18n.t('craftedbox.confirm-title')
      );
    }
  },

  getControlsState: function() {
    return this.state.activeKey ? '' : ' hidden';
  },

  getClearBtnState: function() {
    return this.flattenCoresSet().length > 0 ? '' : ' hidden';
  },

  // TODO
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (this.firstRender && this.DataService && this.DataService.isReady()) {
  //     this.firstRender = false;
  //     return true;
  //   } else {
  //     if (nextProps.activeTab === 2) { return true };
  //     return !shallowEqual(this.props.onlyEvents, nextProps.onlyEvents) ||
  //            !shallowEqual(this.props.onlyBoosts, nextProps.onlyBoosts) ||
  //            !shallowEqual(this.state, nextState);
  //   }
  // },

  render: function() {
    if (!this.DataService) return null;

    var flattenItems = this.flattenCoresSet();

    if (flattenItems.length === 0) return (
      <div className={"tab-statistics"+this.props.className}>
        <div className='loading'>{i18n.t('summary.no-cores-in-set')}</div>
      </div>
    );

    var activeSetItem = this.getActiveSetItem();
    var slotName = activeSetItem ? this.DataService.getSlotName(activeSetItem.core) : '';

    return (
      <div className={"tab-statistics"+this.props.className}>
        <div className='statistics-set-items'>
          {this.renderCurrSet(flattenItems)}
        </div>
        <div className="statistics-right-group">
          <div className="statistics-controls">
            <Button className={'glyph-btn'+this.getControlsState()} onClick={this.editSetItem}>
              <Glyphicon glyph="edit"/>
            </Button>

            <div className='gap'/>

            <Button className={'glyph-btn'+this.getControlsState()} onClick={this.removeSetItem}>
              <Glyphicon glyph="minus"/>
            </Button>

            <div className='gap'>
              {slotName}
            </div>

            <Button className={'glyph-btn clear-all'+this.getClearBtnState()} onClick={this.clearSet}>
              <Glyphicon glyph="trash"/>
            </Button>
          </div>
          {this.DataService ? this.DataService.getCurrSetSummaryTable(flattenItems) : null}
        </div>
      </div>
    );
  }
});

module.exports = SummaryInfoBox;
