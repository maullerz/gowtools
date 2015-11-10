
var SetItem = function ModelSetItem() {
  this.core = null;
  this.coreQuality = null;
  this.pieces = [];
  this.piecesQualities = [];
};

SetItem.prototype = {
  // addItemToSetItem: function(item) {
  //   if (item.type === 'Core') {
  //     if (!this.core) {
  //       this.core = item;
  //       this.coreQuality = item.quality;
  //       result = true;
  //     } else {
  //       if (item.href !== this.core.href) {
  //         this.core = item;
  //         this.coreQuality = item.quality;
  //         result = true;
  //       } else {
  //         this.core = null;
  //         this.coreQuality = null;
  //       }
  //     }
  //   } else if (item.type === 'Piece') {
  //     var ix = this.pieces.findIndex(function(piece) { return item.href === piece.href });

  //     // remove piece from setItem
  //     if (ix >= 0) {
  //       this.pieces.splice(ix, 1);

  //     // add piece to setItem
  //     } else if (this.pieces.length < 6) {
  //       this.pieces = this.pieces.concat(item);
  //       this.piecesQualities = this.piecesQualities.concat(item.quality);
  //       result = true;
  //     }
  //   };

  //   return result;
  // },
};

module.exports = SetItem;
