import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {blue, red} from '@material-ui/core/colors';

// Set up environment variables
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    window.env = {
        // backend: 'http://localhost:5000/',
        // backend: 'http://linux5.csie.ntu.edu.tw:5000/',
        backend: `http://${window.location.hostname}:5000/`
    }
} else {
    window.env = {
        backend: window.location.host
    }
}

// Set up Material-ui theme
const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: red,
    },
});

// Render the DOM
ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <App />
    </MuiThemeProvider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
