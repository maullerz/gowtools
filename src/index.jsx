window.onerror = function(message, url, line) {
	console.error(message + "\n" + url + ":" + line);
};

import React from 'react'
import ReactDOM from 'react-dom'
import App from './Application.jsx'

function startApp() {
	ReactDOM.render(<App/>, document.getElementById('content'))
}

window.onload = function() {
	var url = document.URL
	var isBrowser = (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0)
	isBrowser ? startApp() : document.addEventListener('deviceready', startApp, false)
}
