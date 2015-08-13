/** @jsx React.DOM */
var React = require('react');
var BoostsTable = require('./boosts_table');
var Tooltip = require('./tooltip');

module.exports = React.createClass({
  loadPiecesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.setState({ data: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadPiecesFromServer();
  },
  render: function() {
    return (
      <div className="piecesBox">
        <PiecesList data={this.state.data} />
      </div>
    );
  }
});



var QualityImg = React.createClass({
  select: function() {
    this.props.onSelect(this);
  },
  render: function() {
    return <img id='quality' className={this.props.color} src={this.props.url} onClick={this.select} />;
  }
});


var SelectedPieces = React.createClass({
  checkForEmpty: function(list) {
    if (list.length > 0) {
      return list
    } else {
      return <img src="images/0.png" width='32' height='32' />
    }
  },

  render: function() {
    if (this.props.data == null) return null;

    var selected = this.props.data.map(function(piece, index) {
      var imgUrl = piece.local_img_final;
      if (imgUrl.substring(0, 1) == '/') imgUrl = imgUrl.substring(1);
      return (
        <img id='quality' className={piece.quality} key={"selected-" + index} src={piece.local_img_final} />
      );
    }, this);

    return (
      <div className="selectedPieces">
        {this.checkForEmpty(selected)}
      </div>
    );
  }
});

var PiecesList = React.createClass({
  render: function() {
    var piecesNodes = this.props.data.map(function(piece, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Piece key={"piece-" + index}
          data={piece}
          selectedList={this.selectedPieces}
          togglePiece={this.handlePieceSelect} />
      );
    }, this);

    return (
      <div className="piecesList">
        <SelectedPieces data={this.getSelectedPieces()} />
        <hr/>
        {piecesNodes}
        <hr/>
        <BoostsTable data={this.getSelectedPieces()} />
      </div>
    );
  },

  getInitialState: function() {
    this.selectedPieces = [];
    return {};
  },

  findItem: function(array, predicate) {
    var length = array.length,
        index = -1;

    while (++index < length) {
      if (predicate(array[index])) {
        return array[index];
      }
    }
    return null;
  },

  getSelectedPieces: function() {
    var pieces = this.selectedPieces.map(function(data) {
      var finded = this.findItem(this.props.data, function(item) {return item.id === data.id});
      if (finded) { finded.quality = data.quality }
      return finded;
    }.bind(this));

    return pieces;
  },

  alreadySelected: function(selectedId) {
    var result= false;
    this.selectedPieces.forEach(function(data) {
      if (data.id === selectedId) result = true;
    });
    return result;
  },

  removeFromSelected: function(selectedId) {
    var newArr = [];
    this.selectedPieces.forEach(function(data) {
      if (data.id === selectedId) {
        // nothing
      } else {
        newArr.push(data);
      }
    });
    this.selectedPieces = newArr;
  },

  handlePieceSelect: function(selectedId, quality) {
    if (this.selectedPieces == null || this.selectedPieces == undefined) this.selectedPieces = [];

    this.forceUpdate(); // instead of empty -> this.setState();

    if (this.alreadySelected(selectedId)) {
      this.removeFromSelected(selectedId);
    } else {
      if (this.selectedPieces.length < 6) {
        this.selectedPieces.push({
          id: selectedId,
          quality: quality
        });
        return true;
      }
    }

    return false;
  }
});



var Contents = React.createClass({
  render: function () {
    if (this.props.tooltipActive) {
      return (
        <div className="Tooltip-content bottom">
          {this.props.children}
        </div>
       );
    } else {
      return null;
    }
  }
});

var HoverTrigger = React.createClass({
  render: function () {
    return (
      <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} >
        {this.props.children}
      </div>
    );
  }
});


var Piece = React.createClass({
  getInitialState: function() {
    this.quality = '';
    this.qualities = ['gray','white','green','blue','purple','gold'].reverse();
    return { 
      selected: false,
      qualityOpened: false
    }
  },
  selectQuality: function(quality) {
    this.quality = quality.props.color;
    this.refs.tooltip.disableTooltip();
    this.refs.tooltip.qualitySelected();
    var isSelected = this.props.togglePiece(this.props.data.id, this.quality);
    this.setState({ selected: isSelected, qualityOpened: false });
  },
  openQualityTooltip: function() {
    if (this.state.selected && !this.state.qualityOpened) {
      this.quality = '';
      this.props.togglePiece(this.props.data.id, this.quality);
      this.setState({selected: false});
    } else {
      this.setState({selected: true, qualityOpened: true});
    }
  },
  getClassName: function() {
    return this.state.selected ? 'selected help-tip '+this.quality : 'help-tip '+this.quality;
  },
  getTooltipContent: function() {
    var imgUrl = this.props.data.local_img_final;
    if (this.state.qualityOpened) {
      return (
        <div>
          {
            this.qualities.map(function(color, i) {
              return <QualityImg key={'quality'+i} color={color} url={imgUrl} onSelect={this.selectQuality} />;
            }.bind(this))
          }
        </div>
      );
    } else {
      return <BoostsTable class_name="ttip" data={[this.props.data]} />;
    }
  },
  render: function() {
    var imgUrl = this.props.data.local_img_final;
    if (imgUrl.substring(0, 1) == '/') { 
      imgUrl = imgUrl.substring(1);
    }
    return (
      <Tooltip id='piece' ref="tooltip" qualityOpened={this.state.qualityOpened} mouseClick={this.openQualityTooltip}>
        <HoverTrigger>
          <img id='piece-img' className={this.getClassName()} src={imgUrl} />
        </HoverTrigger>
        <Contents>
          {this.getTooltipContent()}
        </Contents>
      </Tooltip>
    );
  }
});
