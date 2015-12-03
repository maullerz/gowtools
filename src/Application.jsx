import React from 'react'
import i18n from 'i18n-js'
import FastClick from 'fastclick'
import Root from './Root.jsx'

i18n.translations = require('./locales/locales');
i18n.defaultLocale = 'en';

window.log = function(){
  log.history = log.history || []; // store logs to an array for reference
  log.history.push(arguments);
  var values = Array.prototype.slice.call(arguments);

  console.log(values);
};

// ----------
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

////////////////

module.exports = React.createClass({
  
  componentDidMount: function(){
    this.initApp();
  },

  initApp: function(){
    if (this.isAndroid()) this.initAndroid();
    if (this.isIOS()) this.initIOS();
    FastClick.attach(document.body, {});
  },

  initAndroid: function(){
    // $(document.body).addClass('android');
    document.body.className += ' android';
  },

  initIOS: function(){
    // $(document.body).addClass('ios');
    document.body.className += ' ios';
    if (this.isIOS7()) this.initIOS7();
  },

  initIOS7: function(){
    // $(document.body).addClass('ios7');
    document.body.className += ' ios7';
  },

  isBrowser: function() {
    var url = document.URL;
    return !(url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
  },

  getPlatform: function(){
    var platform = '';
    if (!!window.device && !!window.device.platform) {
      platform = window.device.platform.toLowerCase();
    }
    return platform;
  },

  isAndroid: function() {
    return (this.getPlatform() == "android");
  },

  isIOS: function() {
    return (this.getPlatform() == "ios")
  },

  isIOS7: function(){
    return this.getIOSVersion() >= 7;
  },

  getIOSVersion: function() {
    if (!this.isIOS()) return null;
    if (!this.iosVersion) {
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      this.iosVersion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      this.iosVersion = parseInt(this.iosVersion[0]);
    }
    return this.iosVersion;
  },

  getDeviceUuid: function() {
    return !!window.device ? window.device.uuid : null;
  },

  render: function() {
    return (
      <Root
        corespiecesUrl = 'data/y96_corespieces.json'
        boostsUrlRu = 'data/y96_boosts_ru.json'
        boostsUrl = 'data/y96_boosts.json'
      />
    )
  }

});
