import React from 'react'
import ReactDOM from 'react-dom'
import SnapJS from 'snapjs'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Input from 'react-bootstrap/lib/Input'
import Button from 'react-bootstrap/lib/Button'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'
import classnames from 'classnames'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import DataService from './DataService.jsx'
import ModalInfo from './components/ModalInfo.jsx';
import ModalQualitySelect from './components/ModalQualitySelect.jsx';
import CraftedItemBox from './components/CraftedItemBox.jsx'
import ItemsListBox from './components/ItemsListBox.jsx'
import RecipesListBox from './components/RecipesListBox.jsx'
import SummaryInfoBox from './components/SummaryInfoBox.jsx'
import FilterEvents from './components/FilterEvents.jsx'
import FilterBoosts from './components/FilterBoosts.jsx'


var admobid = { // for Android
  banner: 'ca-app-pub-4879539644502553/2923487221',
  interstitial: 'ca-app-pub-4879539644502553/6655682820'
};


function ajax(opts){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    var completed = 4;
    if (xhr.readyState === completed) {
      if (xhr.status === 200 || xhr.status === 0) {
        opts.success(JSON.parse(xhr.responseText), xhr);
      } else {
        opts.error(xhr, xhr.status, xhr.statusText);
      }
    }
  };
  xhr.open('GET', opts.url, true);
  xhr.send(opts.data);
}

var Root = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'root';
  },

  getInitialState: function() {
    return {
      activeTab: 1,
      language: i18n.currentLocale() || i18n.defaultLocale,
      craftLuck: true,
      highRangeBoost: true,
      colorizeStats: true,
      filterEvents: [],
      filterBoosts: []
    }
  },

  componentDidMount: function() {
    // if(AdMob) AdMob.createBanner({
    //   adId: admobid.banner,
    //   position: AdMob.AD_POSITION.TOP_CENTER,
    //   autoShow: true
    // });

    // this will create a banner on startup
    if (AdMob) {
      AdMob.createBanner({
        adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        // position: AdMob.AD_POSITION.BOTTOM_LEFT,
        // isTesting: true, // TODO: remove this line when release
        overlap: true,
        offsetTopBar: false,
        bgColor: 'black'
      });

      AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        // isTesting: true, // TODO: remove this line when release
        autoShow: true
      });
    }

    this.DataService = DataService();
    this.loadRecipes();
    this.loadBoosts();
    this.loadBoostsRu();
    this.loadCoresPiecesData();

    var content = ReactDOM.findDOMNode(this.refs.content);
    if (content) this.snapper = new SnapJS({
      element: content,
      tapToClose: true,
      touchToDrag: false,
      slideIntent: 1,
      minDragDistance: 500,
      // hyperextensible: false,
      // flickThreshold: 50,
      // minDragDistance: 50,
      maxPosition: 221,
      minPosition: -221,
      resistance: 0.7,
      transitionSpeed: 0.4,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)' // easeOutExpo
    });

    this.snapper.on('animated', function() {
      this.snapAnimating = false;
      this.forceUpdate();
    }.bind(this));

    this.snapper.disable();
  },

  componentWillUnmount: function() {
    this.snapper.off('animated');
  },

  loadRecipes: function() {
    ajax({
      url: this.props.recipesUrl,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.DataService.loadRecipes(data);
        if (this.DataService.isReady()) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        log(this.props.boostsUrl, status, err.toString());
      }.bind(this)
    });
  },

  loadBoosts: function() {
    ajax({
      url: this.props.boostsUrl,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.DataService.loadBoosts(data);
        if (this.DataService.isReady()) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        log(this.props.boostsUrl, status, err.toString());
      }.bind(this)
    });
  },

  loadBoostsRu: function() {
    ajax({
      url: this.props.boostsUrlRu,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.DataService.loadBoostsRu(data);
        if (this.DataService.isReady()) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        log(this.props.boostsUrl, status, err.toString());
      }.bind(this)
    });
  },

  loadCoresPiecesData: function() {
    ajax({
      url: this.props.corespiecesUrl,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.DataService.loadData(data);
        if (this.DataService.isReady()) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        log(this.props.corespiecesUrl, status, err.toString());
      }.bind(this)
    });
  },
  
  itemSelected: function itemSelected(item) {
    if (!item.quality) item.quality = 0;
    return this.refs.craftedItemBox.itemSelected(item);
  },

  unselectItem: function(item) {
    this.refs.itemsList.unselectItem(item);
  },

  isItemSelected: function isItemSelected(id) {
    var currSetItem = this.refs.craftedItemBox.state.setItem;
    if (currSetItem.core && currSetItem.core.id === id) return true;
    for (var i = 0, len = currSetItem.pieces.length; i < len; i++) {
      if (currSetItem.pieces[i].id === id) return true;
    }
    return false;
  },

  invalidateItemsListBox: function() {
    this.refs.itemsList.invalidate();
  },

  getItemState: function(setItem) {
    return this.refs.summaryInfoBox.getItemState(setItem);
  },

  addSetItemToSet: function(setItem, isAll) {
    this.refs.summaryInfoBox.addSetItemToSet(setItem, isAll);
  },

  selectSetItemForEdit: function(setItem) {
    this.refs.craftedItemBox.selectSetItemForEdit(setItem);
  },

  handleLanguageSelect: function(language) {
    if (i18n.currentLocale() !== language) {
      i18n.locale = language;
      this.DataService.sortItemsByAlphabet();
      this.setState({
        language: i18n.currentLocale()
      });
      this.invalidateItemsListBox();
    }
  },

  selectRu: function() {
    if (i18n.currentLocale() !== 'ru') {
      this.handleLanguageSelect('ru');
    }
  },

  selectEn: function() {
    if (i18n.currentLocale() !== 'en') {
      this.handleLanguageSelect('en');
    }
  },

  eventSelected: function(events) {
    this.setState({ filterEvents: events });
  },

  boostSelected: function(boosts) {
    this.setState({ filterBoosts: boosts });
  },

  getEventsState: function() {
    if (!this.snapper) return '';
    var snapState = this.snapper.state();
    var className = (snapState.state === 'left') ? ' active' : '';
    // var className = document.body.className.indexOf('snapjs-left') >= 0 ? ' active' : '';

    className += this.state.activeTab === 1 ? '' : ' hidden';
    return className;
  },

  eventsClicked: function() {
    var snapState = this.snapper.state();
    if (snapState.state === 'left') {
      this.snapper.close();
    } else {
      this.snapper.open('left');
    }
    this.forceUpdate();
  },

  getBoostsState: function() {
    if (!this.snapper) return '';
    var snapState = this.snapper.state();
    var className = (snapState.state === 'right') ? ' active' : '';
    // var className = document.body.className.indexOf('snapjs-right') >= 0 ? ' active' : '';

    className += this.state.activeTab === 1 ? '' : ' hidden';
    return className;
  },

  boostsClicked: function() {
    var snapState = this.snapper.state();
    if (snapState.state === 'right') {
      this.snapper.close();
    } else {
      this.snapper.open('right');
    }
    this.forceUpdate();
  },

  qualitySelected: function(item, quality) {
    if (this.state.activeTab === 1) {
      this.refs.craftedItemBox.qualitySelected(item, quality);
    } else if (this.state.activeTab === 2) {
      this.refs.summaryInfoBox.qualitySelected(item, quality);
    };
  },

  openItemInfo: function(id) {
    this.refs.modal.open(id);
  },

  isIOS: function() {
    return document.body.className.indexOf('ios') >= 0 ? ' ios' : '';
  },

  handleTabSelect: function(tabKey) {
    // if (this.snapper) {
    //   tabKey === 1 ? this.snapper.enable() : this.snapper.disable();
    // };
    this.setState({ activeTab: tabKey });
    if (AdMob) {
      const show = Math.floor((Math.random() * 5));

      if (show <= 1) AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        // isTesting: true, // TODO: remove this line when release
        autoShow: true,
      });
    }
  },

  getTabState: function(tabIndex) {
    return this.state.activeTab === tabIndex ? '' : ' hidden';
  },

  onColorizeStatsChange: function(event) {
    if (this.DataService) {
      this.DataService.colorizeStats = event.target.checked;
    }
    this.setState({ colorizeStats: event.target.checked });
  },

  onCraftLuckChange: function(event) {
    if (this.DataService) {
      this.DataService.coreCraftLuck = event.target.checked;
    }
    this.setState({ craftLuck: event.target.checked });
    this.invalidateItemsListBox();
  },

  onHighRangeBoostChange: function(event) {
    if (this.DataService) {
      this.DataService.highRangeBoost = event.target.checked;
    }
    this.setState({ highRangeBoost: event.target.checked });
    this.invalidateItemsListBox();
  },

  handleTouchStart: function(event) {
    let snapState = this.snapper.state();

    if (this.snapAnimating === true) {
      if (snapState.state === 'closed') {
        // snapjs 'animated' event didnt fired
        this.snapAnimating = false;
        this.forceUpdate();
      }
      event.stopPropagation();
      event.preventDefault();
    } else if (snapState.state === 'left' || snapState.state === 'right') {
      this.snapAnimating = true;
      this.snapper.close();
      event.stopPropagation();
      event.preventDefault();
    }
  },

  onExpand: function(craftedItemBoxHeight) {
    // var itemsList = ReactDOM.findDOMNode(this.refs.itemsList);
    // console.log(itemsList.clientTop);
    // TODO use state
    // itemsList.clientTop = craftedItemBoxHeight;
  },

  render: function() {
    const { language, activeTab } = this.state;
    if (i18n.currentLocale() !== language) i18n.locale = language;

    if (this.snapper) {
      activeTab === 1 ? this.snapper.enable() : this.snapper.disable();
    };

    if (this.DataService) {
      this.DataService.colorizeStats = this.state.colorizeStats;
      this.DataService.coreCraftLuck = this.state.craftLuck;
      this.DataService.highRangeBoost = this.state.highRangeBoost;
    }


    return (
      <div className='root'>

        <ModalInfo ref="modal"/>
        <ModalQualitySelect ref='modalQualitySelect' qualitySelected={this.qualitySelected}/>


        <div className={'snap-drawers '+this.props.platform}>
          <div className='snap-drawer snap-drawer-left'>
            <FilterEvents onEventSelected={this.eventSelected} />
          </div>
          <div className='snap-drawer snap-drawer-right'>
            <FilterBoosts onBoostSelected={this.boostSelected} />
          </div>
        </div>

        <div ref='content' className='snap-content'
          onTouchStartCapture={this.handleTouchStart}
          onClickCapture={this.handleTouchStart}>

          <Button id='btn-navbar' className={'left'+this.getEventsState()} onClick={this.eventsClicked} >
            <img width='100%' src={'icons/events.png'} />
          </Button>

          <Button id='btn-navbar' className={'right'+this.getBoostsState()} onClick={this.boostsClicked} >
            <img width='100%' src={'icons/boosts.png'} />
          </Button>


          <Nav bsStyle="pills" activeKey={activeTab} onSelect={this.handleTabSelect}>
            <NavItem eventKey={1} title="Crafting">
              {i18n.t('tabs.crafting')}
            </NavItem>
            <NavItem eventKey={2} title="Statistics">
              {i18n.t('tabs.summary')}
            </NavItem>
            <NavItem eventKey={3} title="Recipes">
              {i18n.t('tabs.recipes')}
            </NavItem>
            <NavItem eventKey={4} title="Settings">
              <Glyphicon style={{
                lineHeight: 'normal',
                width: 40,
                textAlign: 'center',
              }} glyph="cog"/>
            </NavItem>
          </Nav>

          <div className={'tab-crafting'+this.getTabState(1)}>
            <CraftedItemBox
              ref='craftedItemBox'
              platform={this.props.platform}
              modalQualitySelect={this.refs.modalQualitySelect}
              invalidateItemsListBox={this.invalidateItemsListBox}
              addSetItemToSet={this.addSetItemToSet}
              getItemState={this.getItemState}
              onExpand={this.onExpand}
            />
            <ItemsListBox
              ref='itemsList'
              styleTop={null}
              onlyEvents={this.state.filterEvents}
              onlyBoosts={this.state.filterBoosts}
              openItemInfo={this.openItemInfo}
              onItemSelected={this.itemSelected}
              isItemSelected={this.isItemSelected}
            />
          </div>


          <SummaryInfoBox className={this.getTabState(2)}
            ref='summaryInfoBox'
            platform={this.props.platform}
            activeTab={activeTab}
            tabSelect={this.handleTabSelect}
            modalQualitySelect={this.refs.modalQualitySelect}
            selectSetItemForEdit={this.selectSetItemForEdit}
          />


          <RecipesListBox className={this.getTabState(3)}
            ref='recipesListBox'
            platform={this.props.platform}
            activeTab={activeTab}
            tabSelect={this.handleTabSelect}
            openItemInfo={this.openItemInfo}
            modalQualitySelect={this.refs.modalQualitySelect}
            selectSetItemForEdit={this.selectSetItemForEdit}
          />


          <div className={'tab-settings'+this.getTabState(4)}>
            <div className='settings-group'>
              <div className='select-language'>
                <div className={classnames('lang-btn', language === 'en' && 'active')} onClick={this.selectEn}>
                  {i18n.t('english')}
                </div>
                <div className={classnames('lang-btn', language === 'ru' && 'active')} onClick={this.selectRu}>
                  {i18n.t('russian')}
                </div>
              </div>
              {false && activeTab === 4 && <div className='settings-panel'>BLABLABLA</div>}
              <Input type="checkbox"
                  checked={this.state.colorizeStats}
                  label={i18n.t('settings.colorize-stats')}
                  onChange={this.onColorizeStatsChange} />
              <Input type="checkbox"
                  checked={this.state.craftLuck}
                  label={i18n.t('settings.craft-luck')}
                  onChange={this.onCraftLuckChange} />

              {/* 25% from diff between low and high ranges */}
              <Input type="checkbox"
                  checked={this.state.highRangeBoost}
                  label={i18n.t('settings.highrange-boost')}
                  onChange={this.onHighRangeBoostChange} />
            </div>
          </div>

        </div>

      </div>
    );


  }
});

module.exports = Root;
