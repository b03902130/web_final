import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'

class Play extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        if (window.configs.usedb) {
            alert('Not yet implement')
        } else {
            alert('Not yet implement')
        }
    }

    render() {
        return (
            <h1>{this.props.roomid}</h1>
        )
    }
} 
        
export default withRouter(Play)



