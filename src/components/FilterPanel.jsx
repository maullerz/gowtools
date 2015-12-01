import React from 'react';
// import i18n from 'i18n-js';
// {i18n.t('button.clear')}

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import FilterBoosts from './FilterBoosts.jsx';

var FilterPanel = React.createClass({

  getInitialState: function() {
    return {
      type: 'Cores',
      slot: null
    }
  },

  typeClicked: function(event) {
    var type = event.currentTarget.value;
    if (type !== this.state.type) {
      this.setState({ type: type });
      this.props.onTypeSelected([ type ]);
    }
  },

  slotClicked: function(event) {
    var slot = event.currentTarget.value;
    if (this.state.slot === slot) slot = null;
    this.setState({ slot: slot });
    this.props.onSlotSelected(slot ? [slot] : []);
  },

  getTypesState: function(type) {
    return this.state.type === type ? 'active' : '';
  },

  getSlotsState: function(slot) {
    return this.state.slot === slot ? 'active' : '';
  },

  render: function() {
    return (
      <div>
        <FilterBoosts/>
        <ButtonGroup>
          <Button id='filter' className={this.getTypesState('Cores')} value='Cores' onClick={this.typeClicked}>
            <img width='100%' src={'icons/cores.png'} />
          </Button>
          <Button id='filter' className={this.getTypesState('Pieces')} value='Pieces' onClick={this.typeClicked}>
            <img width='100%' src={'icons/pieces.png'} />
          </Button>
        </ButtonGroup>
        {this.state.type === 'Cores' ? (
          <ButtonGroup>
            <Button id='filter' className={this.getSlotsState('Helm')} value='Helm' onClick={this.slotClicked}>
              <img width='100%' src={'icons/helmet.png'} />
            </Button>
            <Button id='filter' className={this.getSlotsState('Armor')} value='Armor' onClick={this.slotClicked}>
              <img width='100%' src={'icons/armor.png'} />
            </Button>
            <Button id='filter' className={this.getSlotsState('Feet')} value='Feet' onClick={this.slotClicked}>
              <img width='100%' src={'icons/feet.png'} />
            </Button>
            <Button id='filter' className={this.getSlotsState('Weapon')} value='Weapon' onClick={this.slotClicked}>
              <img width='100%' src={'icons/weapon.png'} />
            </Button>
            <Button id='filter' className={this.getSlotsState('Accessory')} value='Accessory' onClick={this.slotClicked}>
              <img width='100%' src={'icons/accessory.png'} />
            </Button>
          </ButtonGroup>
        ) : null}
      </div>
    )
  }
});

module.exports = FilterPanel;
