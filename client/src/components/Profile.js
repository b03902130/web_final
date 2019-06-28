import React, { Component } from 'react';
import jwt_decode from 'jwt-decode'
import headshot from '../boy.png'

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
            email: ''
        }
    }


    componentDidMount() {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            // this.setState(state =>{
            //     state.first_name = decoded.first_name;
            //     state.last_name = decoded.last_name;
            //     state.email = decoded.email;
            // })
            this.setState({
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                email: decoded.email
            })
        }
    }

    render() {
        return (
            <div className="container">
                <br></br>
                <div className="row no-gutters">
                    <div className="col-6 col-md-4">
                        <table className="table col-md-6 mx-auto">
                            <tbody>
                                <tr className="">
                                        <img src={headshot} className="media-object" style={{width:'120px'}}/>
                                </tr>
                                <br/> <br/> 
                                <tr>
                                    <td>Frist Name</td>
                                    <td>{this.state.first_name}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{this.state.last_name}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{this.state.email}</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
                {/* <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">
                            Profile
                        </h1>
                    </div>

                    <table className="table col-md-6 mx-auto">
                        <tbody>
                            <tr>
                                <td>Frist Name</td>
                                <td>{this.state.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{this.state.last_name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{this.state.email}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
            </div>
        );
    }
}

export default Profile;