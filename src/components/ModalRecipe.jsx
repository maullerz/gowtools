import React from 'react'
import DataService from '../DataService.jsx'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import i18n from 'i18n-js'


var ModalRecipe = React.createClass({

  getInitialState: function() {
    return {
      item: null,
      showModal: false,
      showAllBoosts: false
    };
  },

  componentDidMount: function() {
    this.DataService = DataService();
  },

  toggleShowAllBoosts: function() {
    this.setState({ showAllBoosts: !this.state.showAllBoosts });
  },

  close: function() {
    this.setState({ showModal: false });
  },

  open: function(id) {
    var item = this.DataService.getRecipeById(id);
    this.setState({
      item: item,
      showModal: true
    });
  },

  getBoostsRows: function() {
    return this.DataService.getRecipeSummaryTable(this.state.item, this.state.showAllBoosts);
  },

  render: function() {
    const { item, showAllBoosts } = this.state;
    if (!item) return null;

    const head = (
      <Modal.Title>
        {item[`name_${i18n.currentLocale()}`]}
      </Modal.Title>
    );

    var spriteName = 'sprite ' + item.sprite;
    var body = <Modal.Body>

      {/* ЯДРО и результат крафта */}
      {false && <div className='modal-image-pieces'>
        <div id='info-img' className={spriteName} />
        <div id='info-img' className={'sprite m'+item.recipe_info.core}/>
        <div className="title">{this.DataService.getItemNameById(item.recipe_info.core)}</div>
      </div>}

      {/* ФРАГМЕНТЫ */}
      <div className='modal-body-pieces'>
        {false && <div className="param">{item.id}</div>}
        {item.recipe_info.pieces.map((pieceId, i) =>
          <div className="param" key={i}>
            <div id='img' className={'sprite m'+pieceId} />
            <div className="title">{this.DataService.getItemNameById(pieceId)}</div>
          </div>
        )}
      </div>

      {/* БУСТЫ */}
      {this.getBoostsRows()}
    </Modal.Body>;


    return (
      <Modal id='item-info' show={this.state.showModal} onHide={this.close}>

        <Modal.Header closeButton>
          {head}
          <Button className='glyph-btn showBoosts' onClick={this.toggleShowAllBoosts}>
            <Glyphicon glyph={showAllBoosts ? 'eye-close' : 'eye-open'}/>
          </Button>
        </Modal.Header>

        {body}

      </Modal>
    );


    // ------------------------------------------------------------------
    // var item = this.state.item;
    // if (item) {
    //   var head = (
    //     <Modal.Title>
    //       {this.DataService.getItemName(item)}
    //     </Modal.Title>
    //   );

    //   // for debug issues
    //   // if (process.env.NODE_ENV !== 'production') {
    //   //   var debugUrl = 'http://gow.y96.ru/en/resources/corespieces/'+item.id;
    //   // }

    //   var locale = i18n.currentLocale();
    //   var rows = Object.keys(item.info).map(function(param, index) {
    //     return (
    //       <tr className='param' key={'param-'+index}>
    //         <td className='param'>{i18n.t('info.'+param)+':'}</td>
    //         <td>{item.info[param][locale]}</td>
    //       </tr>
    //     )
    //   }, this);

    //   // Для undefined cобытий
    //   if (!item.info['event']) {
    //     rows.unshift(
    //       <tr className='param' key='param-event'>
    //         <td className='param'>{i18n.t('info.event')+':'}</td>
    //         <td>{this.DataService.getEventName(item.eventId)}</td>
    //       </tr>
    //     )
    //   }

    //   // Линк для дебага
    //   // if (debugUrl) {
    //   //   rows.unshift(
    //   //     <tr className='param' key='param-debug'>
    //   //       <td className='param'>{'DEBUG'}</td>
    //   //       <td><a href={debugUrl} target='_blank'>{'link to item.id: '+item.id}</a></td>
    //   //     </tr>
    //   //   )
    //   // }

    //   var firstInfoBlock = (
    //     <table className='modal-body-params'><tbody>
    //       {rows}
    //     </tbody></table>
    //   )

    //   var spriteName = 'sprite ' + item.sprite;
    //   var body = (
    //     <Modal.Body>
    //       <div className='modal-body-image'>
    //         <div className='modal-image-background'>
    //           <div id='info-img' className={spriteName} />
    //         </div>
    //       </div>
    //       <div className='modal-body-params'>
    //         {firstInfoBlock}
    //       </div>
    //       {this.getBoostsRows()}
    //     </Modal.Body>
    //   );
    // } else {
    //   var head = null;
    //   var body = <Modal.Body><h4>THERE IS NOTHING TO SHOW!</h4></Modal.Body>;
    // }

    // return (
    //   <Modal id='item-info' show={this.state.showModal} onHide={this.close}>

    //     <Modal.Header closeButton>
    //       {head}
    //     </Modal.Header>

    //     {body}

    //   </Modal>
    // );
  }
});

module.exports = ModalRecipe;
