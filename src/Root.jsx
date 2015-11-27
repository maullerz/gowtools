import React from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Input from 'react-bootstrap/lib/Input';
import LocalStorageMixin from 'react-localstorage';
import i18n from 'i18n-js';

import DataService from './DataService.jsx';
import SelectedItemsBox from './components/SelectedItemsBox.jsx';
import ItemsListBox from './components/ItemsListBox.jsx';
import SummaryInfoBox from './components/SummaryInfoBox.jsx';

function ajax(opts){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    var completed = 4;
    if (xhr.readyState === completed) {
      if (xhr.status === 200){
        opts.success(JSON.parse(xhr.responseText), xhr);
      } else {
        opts.error(xhr, xhr.responseText);
      }
    }
  };
  xhr.open('GET', opts.url, true);
  xhr.send(opts.data);
}

var Root = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'tabs';
  },

  getInitialState: function() {
    return {
      activeTab: 1,
      language: i18n.currentLocale() || i18n.defaultLocale
    }
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.loadBoosts();
    this.loadBoostsRu();
    this.loadCoresPiecesData();
  },

  loadBoosts: function() {
    ajax({
      url: this.props.boostsUrl,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.DataService.loadBoosts(data);
        if (this.DataService.isReady) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.boostsUrl, status, err.toString());
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
        if (this.DataService.isReady) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.boostsUrl, status, err.toString());
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
        if (this.DataService.isReady) this.forceUpdate();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.corespiecesUrl, status, err.toString());
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

  handleTabSelect: function(tabKey) {
    this.setState({ activeTab: tabKey });
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

  render: function() {
    if (i18n.currentLocale() !== this.state.language) i18n.locale = this.state.language;
    return (
      <div className='root'>
        <Tabs activeKey={this.state.activeTab} animation={false} onSelect={this.handleTabSelect}>
          <Tab eventKey={1} title={i18n.t('tabs.crafting')}>
            <div>
              <div className='vertical-line'/>
              <SelectedItemsBox activeTab={this.state.activeTab}
                ref='selectedItems'
                invalidateItemsListBox={this.invalidateItemsListBox}
                addSetItemToSet={this.addSetItemToSet}
              />
              <ItemsListBox activeTab={this.state.activeTab}
                ref='itemsList'
                onItemSelected={this.itemSelected}
                isItemSelected={this.isItemSelected}
              />
            </div>
          </Tab>
          <Tab eventKey={2} title={i18n.t('tabs.summary')}>
            <div>
              <SummaryInfoBox activeTab={this.state.activeTab}
                ref='summaryInfoBox'
                selectSetItemForEdit={this.selectSetItemForEdit}
              />
            </div>
          </Tab>
          <Tab eventKey={3} title={i18n.t('tabs.settings')}>
            <Input groupClassName='select-language'
                   type="select"
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
          </Tab>
        </Tabs>
      </div>
    );
  }
});

module.exports = Root;
