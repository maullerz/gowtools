import React from 'react';
import DataService from '../DataService.jsx';
import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';

var ModalInfo = React.createClass({

  getInitialState: function() {
    return {
      item: null,
      showModal: false
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  close: function() {
    this.setState({ showModal: false });
  },

  open: function(id) {
    var item = this.DataService.getItemById(id);
    this.setState({
      item: item,
      showModal: true
    });
  },

  getBoostsRows: function() {
    var boosts = this.state.item.stats_info;
    var nodes = Object.keys(boosts).map(function(id, index) {
      var lvls = boosts[id];
      return (
        <tr key={"boost"+index}>
          <td className="boost-name">{this.DataService.getBoostName(id)}</td>
          <td className="lvl6">
              {this.DataService.simpleShow(lvls[5])}
          </td>
          <td>{this.DataService.simpleShow(lvls[4])}</td>
          <td>{this.DataService.simpleShow(lvls[3])}</td>
          <td>{this.DataService.simpleShow(lvls[2])}</td>
          <td>{this.DataService.simpleShow(lvls[1])}</td>
          <td>{this.DataService.simpleShow(lvls[0])}</td>
        </tr>
      );
    }.bind(this));

    return nodes;
  },

  render: function() {
    if (this.state.item !== null) {
      // var name = this.state.item.main_info_ru["Equipment Types"]+': '+
      var name = this.state.item.name_en; 
      var head = (
        <Modal.Title>
          <img className="icon-img" width="32" src={'images/'+this.state.item.img_base} />
          {' '+name}
        </Modal.Title>
      );
      var url = 'http://gow.y96.ru/en/resources/corespieces/'+this.state.item.href;
      var body = (
        <Modal.Body>
          <a href={url} target='_blank'>{'Item page on gow.help'}</a>
          <p>{'Event: '+this.state.item.main_info_ru["Event"]}</p>
          <Table bordered condensed><tbody>
            {this.getBoostsRows()}
          </tbody></Table>
        </Modal.Body>
      );
    } else {
      var head = null;
      var body = <Modal.Body><h4>THERE IS NOTHING TO SHOW!</h4></Modal.Body>;
    }

    return (
      <Modal dialogClassName="custom-modal" show={this.state.showModal} onHide={this.close}>
        
        <Modal.Header closeButton>
          {head}
        </Modal.Header>
        
        {body}

      </Modal>
    );
  }
});

module.exports = ModalInfo;
