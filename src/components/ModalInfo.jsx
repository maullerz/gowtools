import React from 'react'
import DataService from '../DataService.jsx'
import Modal from 'react-bootstrap/lib/Modal'
import Table from 'react-bootstrap/lib/Table'
import i18n from 'i18n-js'

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
    return this.DataService.getSimpleSummaryTable(this.state.item);
  },

  render: function() {
    var item = this.state.item;
    if (item) {
      var head = (
        <Modal.Title>
          {this.DataService.getItemName(item)}
        </Modal.Title>
      );

      // for debug issues
      // if (process.env.NODE_ENV !== 'production') {
      //   var debugUrl = 'http://gow.y96.ru/en/resources/corespieces/'+item.id;
      // }

      var locale = i18n.currentLocale();
      var rows = Object.keys(item.info).map(function(param, index) {
        return (
          <tr className='param' key={'param-'+index}>
            <td className='param'>{i18n.t('info.'+param)+':'}</td>
            <td>{item.info[param][locale]}</td>
          </tr>
        )
      }, this);

      // Для undefined cобытий
      if (!item.info['event']) {
        rows.unshift(
          <tr className='param' key='param-event'>
            <td className='param'>{i18n.t('info.event')+':'}</td>
            <td>{this.DataService.getEventName(item.eventId)}</td>
          </tr>
        )
      }

      // Линк для дебага
      // if (debugUrl) {
      //   rows.unshift(
      //     <tr className='param' key='param-debug'>
      //       <td className='param'>{'DEBUG'}</td>
      //       <td><a href={debugUrl} target='_blank'>{'link to item.id: '+item.id}</a></td>
      //     </tr>
      //   )
      // }

      var firstInfoBlock = (
        <table className='modal-body-params'><tbody>
          {rows}
        </tbody></table>
      )

      var spriteName = 'sprite ' + item.sprite;
      var body = (
        <Modal.Body>
          <div className='modal-body-image'>
            <div className='modal-image-background'>
              <div id='info-img' className={spriteName} />
            </div>
          </div>
          <div className='modal-body-params'>
            {firstInfoBlock}
          </div>
          {this.getBoostsRows()}
        </Modal.Body>
      );
    } else {
      var head = null;
      var body = <Modal.Body><h4>THERE IS NOTHING TO SHOW!</h4></Modal.Body>;
    }

    return (
      <Modal id='item-info' show={this.state.showModal} onHide={this.close}>
        
        <Modal.Header closeButton>
          {head}
        </Modal.Header>
        
        {body}

      </Modal>
    );
  }
});

module.exports = ModalInfo;
