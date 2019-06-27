import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Set up environment variables
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    window.env = {
        backend: 'http://localhost:5000/'
    }
} else {
    window.env = {
        backend: window.location
    }
}


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
