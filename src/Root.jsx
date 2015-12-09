import React from 'react'
import ReactDOM from 'react-dom'
import SnapJS from 'snapjs'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import Input from 'react-bootstrap/lib/Input'
import Button from 'react-bootstrap/lib/Button'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'

import DataService from './DataService.jsx'
import ModalInfo from './components/ModalInfo.jsx';
import ModalQualitySelect from './components/ModalQualitySelect.jsx';
import CraftedItemBox from './components/CraftedItemBox.jsx'
import ItemsListBox from './components/ItemsListBox.jsx'
import SummaryInfoBox from './components/SummaryInfoBox.jsx'
import FilterEvents from './components/FilterEvents.jsx'
import FilterBoosts from './components/FilterBoosts.jsx'


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
    // TODO save filter values in storage
    return {
      activeTab: 1,
      language: i18n.currentLocale() || i18n.defaultLocale,
      filterEvents: [],
      filterBoosts: []
    }
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.loadBoosts();
    this.loadBoostsRu();
    this.loadCoresPiecesData();

    var content = ReactDOM.findDOMNode(this.refs.content);
    if (content) this.snapper = new SnapJS({
      element: content,
      tapToClose: true,
      touchToDrag: false,
      // hyperextensible: false,
      // flickThreshold: 50,
      // minDragDistance: 50,

      resistance: 0.7,
      transitionSpeed: 0.5,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)' // easeOutExpo
    });

    this.snapper.on('close', function() {
      this.forceUpdate();
    }.bind(this));


    // this.handleTabSelect(this.state.activeTab);

    // this.snapper.on('animated', function() {
    //   this.snapper.disable();
    //   setTimeout(function() {
    //     this.snapper.enable()
    //   }.bind(this), 1000)
    //   this.forceUpdate();
    // }.bind(this));

    // this.snapper.on('expandRight', function() {
    //   this.snapper.settings({ disable: 'left' });
    // }.bind(this));
    // this.snapper.on('expandLeft', function() {
    //   this.snapper.settings({ disable: 'right' });
    // }.bind(this));
    // this.snapper.on('animated', function() {
    //   if (this.snapper.state() === 'closed') {
    //     this.snapper.settings({ disable: 'none' });
    //   };
    // }.bind(this));
  },

  componentWillUnmount: function() {
    this.snapper.off('close');
    // this.snapper.off('animated');
    // this.snapper.off('expandRight');
    // this.snapper.off('expandLeft');
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
  
  itemSelected: function(item) {
    if (!item.quality) item.quality = 0;
    return this.refs.selectedItems.itemSelected(item);
  },

  unselectItem: function(item) {
    this.refs.itemsList.unselectItem(item);
  },

  isItemSelected: function(id) {
    var currSetItem = this.refs.selectedItems.state.setItem;
    if (currSetItem.core && currSetItem.core.href === id) return true;
    for (var i = 0, len = currSetItem.pieces.length; i < len; i++) {
      if (currSetItem.pieces[i].href === id) return true;
    }
    return false;
  },

  invalidateItemsListBox: function() {
    this.refs.itemsList.forceUpdate();
  },

  getItemState: function(setItem) {
    return this.refs.summaryInfoBox.getItemState(setItem);
  },

  addSetItemToSet: function(setItem) {
    this.refs.summaryInfoBox.addSetItemToSet(setItem);
  },

  selectSetItemForEdit: function(setItem) {
    this.refs.selectedItems.selectSetItemForEdit(setItem);
  },

  handleLanguageSelect: function() {
    var language = this.refs.languageSelect.getValue();
    if (i18n.currentLocale() !== language) {
      i18n.locale = language;
      this.setState({
        language: i18n.currentLocale()
      });
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
    // var snapState = this.snapper.state();
    // var className = (snapState.state === 'left' || snapState.info.opening === 'left') ? ' active' : '';
    var className = document.body.className.indexOf('snapjs-left') >= 0 ? ' active' : '';

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
    // var snapState = this.snapper.state();
    // var className = (snapState.state === 'right' || snapState.info.opening === 'right') ? ' active' : '';
    var className = document.body.className.indexOf('snapjs-right') >= 0 ? ' active' : '';

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
    this.refs.selectedItems.qualitySelected(item, quality);
  },

  openItemInfo: function(id) {
    this.refs.modal.open(id);
  },

  isIOS: function() {
    console.log('document.body.className: '+document.body.className);
    return document.body.className.indexOf('ios') >= 0 ? ' ios' : '';
  },

  handleTabSelect: function(tabKey) {
    // if (this.snapper) {
    //   tabKey === 1 ? this.snapper.enable() : this.snapper.disable();
    // };
    this.setState({ activeTab: tabKey });
  },

  getTabState: function(tabIndex) {
    return this.state.activeTab === tabIndex ? '' : ' hidden';
  },

  render: function() {
    if (i18n.currentLocale() !== this.state.language) i18n.locale = this.state.language;

    if (this.snapper) {
      this.state.activeTab === 1 ? this.snapper.enable() : this.snapper.disable();
    };


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

        <div ref='content' className='snap-content'>

          <Button id='btn-navbar' className={'left'+this.getEventsState()} onClick={this.eventsClicked} >
            <img width='100%' src={'icons/events.png'} />
          </Button>

          <Button id='btn-navbar' className={'right'+this.getBoostsState()} onClick={this.boostsClicked} >
            <img width='100%' src={'icons/boosts.png'} />
          </Button>


          <Nav bsStyle="pills" activeKey={this.state.activeTab} onSelect={this.handleTabSelect}>
            <NavItem eventKey={1} title="Crafting"> {i18n.t('tabs.crafting')} </NavItem>
            <NavItem eventKey={2} title="Statistics"> {i18n.t('tabs.summary')}  </NavItem>
            <NavItem eventKey={3} title="Settings"> {i18n.t('tabs.settings')} </NavItem>
          </Nav>

          <div className={'tab-crafting'+this.getTabState(1)}>
            <CraftedItemBox
              ref='selectedItems'
              modalQualitySelect={this.refs.modalQualitySelect}
              invalidateItemsListBox={this.invalidateItemsListBox}
              addSetItemToSet={this.addSetItemToSet}
              getItemState={this.getItemState}
            />
            <ItemsListBox
              ref='itemsList'
              onlyEvents={this.state.filterEvents}
              onlyBoosts={this.state.filterBoosts}
              openItemInfo={this.openItemInfo}
              onItemSelected={this.itemSelected}
              isItemSelected={this.isItemSelected}
            />
          </div>


          <SummaryInfoBox className={this.getTabState(2)}
            ref='summaryInfoBox'
            modalQualitySelect={this.refs.modalQualitySelect}
            selectSetItemForEdit={this.selectSetItemForEdit}
          />


          <div className={'tab-settings'+this.getTabState(3)}>
            <Input groupClassName='select-language'
                   type='select'
                   ref='languageSelect'
                   value={this.state.language}
                   onChange={this.handleLanguageSelect}
                   label={i18n.t('language')} >
              <option value='ru'>{i18n.t('russian')}</option>
              <option value='en'>{i18n.t('english')}</option>
            </Input>
            <div>
              {'TODO:'}
            </div>
            <div>
              {'-- CORES CRAFT LUCK'}
            </div>
            <div>
              {'-- HIGH RANGE BOOST'}
            </div>
          </div>

        </div>

      </div>
    );


  }
});

module.exports = Root;
