/** @jsx React.DOM */
var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {tooltipActive: false};
  },
  disableTooltip: function () {
    this.setState({tooltipActive: false});
  },
  qualitySelected: function () {
    this.skipClick = true;
  },
  mouseOver: function () {
    this.setState({tooltipActive: true});
  },
  mouseOut: function () {
    if (!this.props.qualityOpened) {
      this.setState({tooltipActive: false});
    }
  },
  mouseClick: function () {
    if (this.skipClick) {
      this.skipClick = false;
    } else {
      this.props.mouseClick();
    }
  },
  componentDidMount: function() {
    var self = this;
    _.each(this.props.children, function (child) {
      child.props.position = self.getDOMNode().getBoundingClientRect();
    });
  },
  renderChildren: function() {
    var self = this;
    return React.Children.map(this.props.children, function (child) {
      // return React.addons.cloneWithProps(child, {
      return React.cloneElement(child, {
        tooltipActive: self.state.tooltipActive
      })
    }.bind(this))
  },
  render: function () {
    return(
      <div className="Tooltip" onClick={this.mouseClick} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} >
        {this.renderChildren()}
      </div>
    );
  }
});
