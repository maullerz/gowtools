import React from 'react'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import i18n from 'i18n-js'

import DataService from '../DataService.jsx'
import QualityImg from './QualityImg.jsx'

var ModalQualitySelect = React.createClass({

  getInitialState: function() {
    return {
      item: null,
      showModal: false
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
  },

  close: function() {
    this.setState({ showModal: false });
  },

  open: function(item, onItemRemove) {
    this.onItemRemove = onItemRemove;
    this.setState({
      item: this.DataService.getItemById(item.id),
      showModal: true
    });
  },

  removeFromSetItem: function() {
    this.close();
    this.onItemRemove(this.state.item);
  },

  // TODO: Border for selected quality
  // show stats for selected quality
  render: function() {
    var qualitiesNode, selectQuality;
    if (this.state.item) {
      qualitiesNode = this.qualities.map(function(color, index) {
        var spriteName = 'sprite ' + this.state.item.sprite;
        selectQuality = function() { this.close(); this.props.qualitySelected(this.state.item, index); }.bind(this);
        return (
          <QualityImg key={'quality'+index} color={color} spriteName={spriteName} selectQuality={selectQuality} />
        );
      }.bind(this));
    }


    return (
      <Modal id='quality-select' show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n.t('craftedbox.select-quality')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='qualities-group'>
            {qualitiesNode}
            {this.onItemRemove ? <Button className={'glyph-btn remove'} onClick={this.removeFromSetItem}>
                {<Glyphicon glyph={'minus'}/> /*i18n.t('button.remove')*/}
              </Button> : null}
          </div>
          <div className='qualities-controls'>

          </div>
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = ModalQualitySelect;
