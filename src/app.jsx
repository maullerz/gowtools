/** @jsx React.DOM */
var $ = require('jquery');
var React = require('react');
var PiecesBox = require('./components/pieces_components');

React.initializeTouchEvents(true);

module.exports = React.createClass({
	
	componentDidMount: function(){
		this.initApp();
		this.loadData();
	},

	loadData: function(){
		$.getJSON("./pieces.json", function(data){         
		  console.log("data loaded:" + data[0]["name"]);
		  this.setState({ data: data });
		}.bind(this));
	},

	initApp: function(){
		if (this.isAndroid()) {
			this.initAndroid();
		}
		if (this.isIOS()) {
			this.initIOS();
		}
	},

	initAndroid: function(){
		$(document.body).addClass('android');
	},

	initIOS: function(){
		$(document.body).addClass('ios');
		if (this.isIOS7()) this.initIOS7();
	},

	initIOS7: function(){
		$(document.body).addClass('ios7');
	},
		
	isBrowser: function() {
		var url = document.URL;
		return !(url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
	},

	getPlatform: function(){
		var platform = '';
		if( !!window.device && !!window.device.platform ){
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
		if (!this.isIOS()) {
			return null;
		}
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
		return <PiecesBox url="pieces.json" />
	},

	renderTest: function(){
		return <div className="splashscreen">
		         <img src="res/academy.png" width='212' height='145' />
					   <div>
							 {"Press to enter Crafting Tool"}
						 </div>
					 </div>
	}

});
