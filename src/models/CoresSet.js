
var CoresSet = function ModelSetItem() {
  this.Helm = null;
  this.Armor = null;
  this.Feet = null;
  this.Weapon = null;
  this.Accessory = [];
    //   null,
    //   null,
    //   null
    // ]
};

CoresSet.prototype = {


  flatten: function() {
    var items = [
      this.Helm,
      this.Armor,
      this.Feet,
      this.Weapon
    ].concat(this.Accessory);

    return items.filter(function(item) { return item });
  }
};

module.exports = CoresSet;
