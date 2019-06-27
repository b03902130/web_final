import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Room from './components/Room'
import axios from 'axios'


class App extends Component{
  render(){
    return(
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Route exact path="/" component={LandingPage} />
            <Route exact path = "/register" component={Register} />
            <Route exact path = "/login" component={Login} />
            <Route exact path = "/profile" component={Profile} />
            <Route exact path = "/rooms/:roomid" component={Room} />
          </div>
        

        </div>

      </Router>
    )
  }
}

export default App;
