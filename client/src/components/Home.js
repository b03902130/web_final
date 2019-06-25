import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rooms: []
        }
    }

    componentDidMount() {
        if (window.configs.usedb) {
            this.setState({rooms: window.database.rooms})
        } else {
            alert('Not yet implement')
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.rooms.map(room => (
                        <div>
                            <h3>{room.name}</h3>
                            <p>{`${room.player_num} players are in this room`}</p>
                            <Link to={`/rooms/${room.primary_k}`}>enter</Link>
                        </div>
                    ))
                }
            </div>                
        )
    }
} 
        
export default withRouter(Home)

