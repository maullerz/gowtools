import React from 'react';
import Button from 'react-bootstrap/lib/Button';

var QualityImg = React.createClass({
  render: function() {
    return (
      <Button id='quality' className={this.props.color} >
        <div id='img64' className={this.props.spriteName} onClick={this.props.selectQuality} />
      </Button>
    )
  }
});

module.exports = QualityImg;
