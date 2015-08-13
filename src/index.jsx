window.onerror = function(message, url, line) {
	alert(message + "\n" + url + ":" + line);
};

var App = require('./app');
var React = require('react');

function startApp() {
	console.log('Starting App!!!!!!!!!');
	React.render(<App/>, document.body);	
}

window.onload = function(){
	var url = document.URL;
	console.log("document:", document);
	var isSmart = (url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
	if (isSmart) {
		document.addEventListener('deviceready', startApp, false);
	}
	else {
		startApp();
	}
}