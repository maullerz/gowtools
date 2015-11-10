import React from 'react';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import LocalStorageMixin from 'react-localstorage';

import DataService from './DataService.jsx';
import SelectedItemsBox from './components/SelectedItemsBox.jsx';
import ItemsListBox from './components/ItemsListBox.jsx';
import SummaryInfoBox from './components/SummaryInfoBox.jsx';


var Root = React.createClass({

  mixins: [LocalStorageMixin],

  getLocalStorageKey: function() {
    return 'tabs';
  },

  getInitialState: function() {
    return { activeTab: 1 };
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.loadBoosts();
    this.loadBoostsRu();
    this.loadCoresPiecesData();
  },

  loadBoosts: function() {
    $.ajax({
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
    $.ajax({
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
    $.ajax({
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

  render: function() {
    return (
      <div className="root">
        <Tabs activeKey={this.state.activeTab} animation={false} onSelect={this.handleTabSelect}>
          <Tab eventKey={1} title="Craft Core">
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
          <Tab eventKey={2} title="Set Summary">
            <div>
              <SummaryInfoBox activeTab={this.state.activeTab}
                ref='summaryInfoBox'
                selectSetItemForEdit={this.selectSetItemForEdit}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
});

module.exports = Root;
