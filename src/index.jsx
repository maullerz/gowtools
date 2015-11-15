window.onerror = function(message, url, line) {
	console.error(message + "\n" + url + ":" + line);
};

import React from 'react';
import App from './Application.jsx';

function startApp() {
	React.render(<App/>, document.body);	
}

window.onload = function() {
	var url = document.URL;
	var isSmart = (url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
	if (isSmart) {
		document.addEventListener('deviceready', startApp, false);
	}
	else {
		startApp();
	}
}