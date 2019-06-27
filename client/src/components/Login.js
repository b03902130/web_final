import React, { Component } from 'react';
import { login } from './userFunction';


class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            success: 1
        }

        //this.onChange = this.onChange.bind(this);
        //this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password
        }

        login(user).then(res => {
            if (res === localStorage.usertoken && res != undefined) {
                this.setState({success: 1});
                this.props.history.push(`/`)
            } else {
                this.setState({success: 0});
            }
        })

    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">
                                Please sign in
                            </h1>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                            </div>
                            <button className="btn btn-lg btn-primary btn-block"
                                type="submit">
                                Sign in
                            </button>
                        </form>
                        <br></br>
                        {(this.state.success)?
                            null
                            : 
                              <div className="alert alert-danger">
                                <strong>Wrong Password or Invalid Account</strong> please try it again or go sign up!
                              </div>}


                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
