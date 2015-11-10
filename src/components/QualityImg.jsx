import React from 'react';
import Button from 'react-bootstrap/lib/Button';

var QualityImg = React.createClass({
  render: function() {
    return (
      <Button id='quality' className={this.props.color} >
        <img width='64' height='64' src={this.props.url} onClick={this.props.selectQuality} />
      </Button>
    )
  }
});

module.exports = QualityImg;
