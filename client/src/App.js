import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import axios from 'axios'


class App extends Component{
  getHandle = () => {
    axios.get('/users/get', {
      headers: {
        id: '12345678'
      }
    }).then(res => {debugger})
    .catch(err => {debugger})
  }

  postHandle = () => {
    axios.post('/users/post', null, {
      headers: {
        id: '12345678'
      }
    }).then(res => {debugger})
    .catch(err => {debugger})
  }


  render(){
    return(
      <Router>
        <div className="App">
          <button onClick={this.getHandle}>get</button>
          <button onClick={this.postHandle}>post</button>
          <Navbar />
          <Route exact path="/" component={LandingPage} />
          <div className="container">
            <Route exact path = "/register" component={Register} />
            <Route exact path = "/login" component={Login} />
            <Route exact path = "/profile" component={Profile} />
          </div>
        

        </div>

      </Router>
    )
  }
}

export default App;
