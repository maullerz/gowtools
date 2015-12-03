import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

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

  getSlotsGroupState: function() {
    return this.state.type === 'Pieces' ? 'hidden-group' : '';
  },

  render: function() {
    return (
      <div className='filter-panel'>
        <ButtonGroup>
          <Button id='filter' className={this.getTypesState('Cores')} value='Cores' onClick={this.typeClicked}>
            <img width='100%' src={'icons/cores.png'} />
          </Button>
          <Button id='filter' className={this.getTypesState('Pieces')} value='Pieces' onClick={this.typeClicked}>
            <img width='100%' src={'icons/pieces.png'} />
          </Button>
        </ButtonGroup>
        <ButtonGroup className={this.getSlotsGroupState()}>
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
      </div>
    )
  }
});

module.exports = FilterPanel;
