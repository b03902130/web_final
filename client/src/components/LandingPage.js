import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import Home from './Home'

class LandingPage extends Component {
    changeToSignUp = e => {
        e.preventDefault();
        this.props.history.push(`/register`);
    }
    changeToSignIn = e => {
        e.preventDefault();
        this.props.history.push(`/login`);
    }
    
    render() {
        return ( 
            localStorage.usertoken ?
            <Home />
            :
            <div className="container">
                <div className="jumbotron mt-5">
                    <h1 className="display-4">Let's Run</h1>
                    <p className="lead">A competition platform for gesture-controlled racing game</p>
                    <hr className="my-4"></hr>
                        <p className="lead">
                            <a className="btn btn-primary btn-lg" href="#" role="button" onClick={this.changeToSignUp}>Sign up now!</a>
                            <span></span>
                            <a href="#" className="btn btn-link" role="button" onClick={this.changeToSignIn}>Sign in</a>
                        </p>
                </div>


            </div>
                )
            }
        } 
        
export default withRouter(LandingPage)