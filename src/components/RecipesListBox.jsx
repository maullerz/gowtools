import React from 'react'
import LocalStorageMixin from 'react-localstorage'
import i18n from 'i18n-js'
import ReactList from 'react-list'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import DataService from '../DataService.jsx'


const isEqualSubset = (a, b) => {
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
};

const isEqual = (a, b) => isEqualSubset(a, b) && isEqualSubset(b, a);


var ItemsListBox = React.createClass({

  mixins: [LocalStorageMixin],

  showAllBoostsClicked: function() {
    this.setState({
      showAllBoosts: !this.state.showAllBoosts,
      invalidateHack: !this.state.invalidateHack
    });
  },

  getInitialState: function() {
    this.firstRender = true;
    return {
      invalidateHack: false,
      showAllBoosts: true,
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  invalidate: function() {
    this.setState({ invalidateHack: !this.state.invalidateHack });
  },

  getFilteredData: function(onlyTypes, onlySlots, onlyEvents, onlyBoosts) {
    var filteredData = this.DataService.getSortedAndFilteredData(onlyTypes, onlyEvents, onlyBoosts, onlySlots);
    var locale = i18n.currentLocale();
    return filteredData.map(function(item) {
      return this.getItemNodes(item, onlyBoosts, locale);
    }, this);
  },

  itemRenderer: function(index, key) {
    const recipe = this.DataService.recipes[index];
    return <Recipe data={recipe} key={key} openItemInfo={this.props.openItemInfo} openRecipeInfo={this.props.openRecipeInfo} />;
  },

  tableItemsRenderer: function(items, ref) {
    return <div className='recipes-table' ref={ref}>{items}</div>;
  },

  render: function() {
    if (!this.DataService || !this.DataService.isReady()) return (
      <div className={"tab-statistics"+this.props.className}>
        <div className='loading'>{i18n.t('items-list.loading')}</div>
      </div>
    );

    // className={'glyph-btn'+this.getControlsState()} onClick={this.editSetItem}
    const header = `${i18n.t('items-list.recipes')}: ${this.DataService.recipes.length}`;

    return (
      <div className={"tab-statistics"+this.props.className}>

        <div className="statistics-controls">
          <Button className='glyph-btn'>
            <Glyphicon glyph="edit"/>
          </Button>

          <div className='gap'/>

          <div className='gap'>
            {'RECIPE PANEL'}
          </div>
        </div>

        <div className='recipes-items-list'>

          {false && <div className="thead">
            <div className="recipe">
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
              <div className="th"></div>
            </div>
          </div>}

          {false && <h4>{header}</h4>}
          <ReactList
            ref='reactList'
            initialIndex={0}
            invalidateHack={this.state.invalidateHack} /*small hack to force ReactList update*/
            itemRenderer={this.itemRenderer}
            itemsRenderer={this.tableItemsRenderer}
            length={this.DataService.recipes.length}
            useTranslate3d={true}
            pageSize={10}
            threshold={800}
            type='uniform'
          />

        </div>
      </div>
    );
  }
});

function Recipe(props) {
  const r = props.data;
  const spriteName = "sprite m" + r.id;
  const openRecipeFn = () => props.openRecipeInfo(r.id);

  return (
    <div className="recipe" key={props.key}>
      <div className="rcell id" onClick={openRecipeFn}>
        <div id='img44' style={{ margin: 'auto' }} className={spriteName}/>
      </div>

      <div className='rcell name'>{r[`name_${i18n.currentLocale()}`]}</div>

      <RecipePart core itemId={r.recipe_info.core} openItemInfo={props.openItemInfo} />

      {r.recipe_info.pieces.map((pieceId) => {
        return <RecipePart itemId={pieceId} openItemInfo={props.openItemInfo} />
      })}
    </div>
  )
}

function RecipePart(props) {
  const openInfoFn = () => props.openItemInfo(props.itemId);
  return (
    <div className={`rcell ${props.core ? 'core' : ''}`} onClick={props.itemId ? openInfoFn : null}>
      {props.itemId && <div id='img44' style={{ margin: 'auto' }} className={"icon-img sprite m" + props.itemId} />}
    </div>
  );
}

module.exports = ItemsListBox;
