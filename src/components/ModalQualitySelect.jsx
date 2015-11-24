import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import DataService from '../DataService.jsx';
import QualityImg from './QualityImg.jsx';

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

  open: function(item) {
    this.setState({
      item: this.DataService.getItemById(item.href),
      showModal: true
    });
  },

  // TODO: Border for selected Quality
  render: function() {
    var qualitiesNode, selectQuality;
    if (this.state.item) {
      qualitiesNode = this.qualities.map(function(color, index) {
        selectQuality = function() { this.props.qualitySelected(this.state.item, index); this.close(); }.bind(this);
        var spriteName = 'sprite ' + this.state.item.sprite;
        return (
          <QualityImg key={'quality'+index} color={color} spriteName={spriteName} selectQuality={selectQuality} />
        );
      }.bind(this));
    }

    // TODO: 7ая кнопка - {убрать ядро-фраг из выбранных}

    // <Modal.Header closeButton>Выбрать качество:</Modal.Header>
    return (
      <Modal id='quality-select' show={this.state.showModal} onHide={this.close}>
        <Modal.Body>
          {qualitiesNode}
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = ModalQualitySelect;
